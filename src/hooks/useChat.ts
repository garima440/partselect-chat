import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ProductResult, ChatState } from '@/lib/types';

// Initial system message that defines the assistant's behavior
const SYSTEM_MESSAGE: Message = {
    id: uuidv4(),
    role: 'system',
    content: `You are the PartSelect customer service assistant, specialized in helping customers find and purchase the right refrigerator and dishwasher parts.
  
    Your responsibilities:
    1. Help customers identify the correct parts they need based on their appliance model, symptoms, or part numbers
    2. Answer questions about product compatibility with specific appliance models
    3. Provide installation guidance and troubleshooting tips for parts
    4. Assist with understanding product specifications and features
    5. Guide customers through the purchasing process
    
    Important guidelines:
    - ONLY answer questions related to refrigerator and dishwasher parts, repairs, and appliances
    - If asked about anything outside your domain (other appliances, unrelated topics), politely redirect the conversation to refrigerator and dishwasher parts
    - Be concise but thorough in your responses
    - When you don't know an answer, admit it rather than guessing
    - Always ask for model numbers or part numbers when they're not provided and would be helpful for giving accurate information
    - Format your responses with markdown for readability when appropriate
    - MAINTAIN CONVERSATION CONTEXT: If a user responds with just a model number or part number, understand it's in response to your previous question
    - When a user provides just a model number, use it in the context of the previous conversation`,
        timestamp: Date.now(),
};

export function useChat(): ChatState & {
  sendMessage: (content: string) => Promise<void>;
  resetChat: () => void;
} {
  // Initialize state
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    productResults: [],
  });

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('partselect-chat-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setState(prevState => ({
            ...prevState,
            messages: parsedMessages,
          }));
        }
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (state.messages.length > 0) {
      localStorage.setItem('partselect-chat-messages', JSON.stringify(state.messages));
    }
  }, [state.messages]);

  // Extract potential search terms from user message
  const extractSearchTerms = (message: string) => {
    const partNumberRegex = /(?:part(?:\s+number)?(?:\s*#?\s*|\s+)):?\s*([A-Z0-9]{8,12})\b/i;
    const modelNumberRegex = /(?:model(?:\s+number)?(?:\s*#?\s*|\s+)):?\s*([A-Z0-9]{9,12})\b/i;
    
    const partNumberMatch = message.match(partNumberRegex);
    const modelNumberMatch = message.match(modelNumberRegex);
    
    return {
      partNumber: partNumberMatch ? partNumberMatch[1] : undefined,
      modelNumber: modelNumberMatch ? modelNumberMatch[1] : undefined,
    };
  };

  // Send message function
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Create new user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    // Update state with user message and set loading
    setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      // Extract search terms
      const { partNumber, modelNumber } = extractSearchTerms(content);
      
      // Prepare all messages for context
      const allMessages = state.messages.length > 0 
        ? [...state.messages, userMessage] 
        : [SYSTEM_MESSAGE, userMessage];

      // Send request to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: allMessages,
          partNumber,
          modelNumber,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Update state with response
      setState(prevState => ({
        ...prevState,
        messages: [...prevState.messages, data.message],
        isLoading: false,
        productResults: data.productResults || [],
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }));
    }
  }, [state.messages]);

  // Reset chat function
  const resetChat = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
      productResults: [],
    });
    localStorage.removeItem('partselect-chat-messages');
  }, []);

  return {
    ...state,
    sendMessage,
    resetChat,
  };
}