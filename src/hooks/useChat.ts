import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ProductResult, ChatState } from '@/lib/types';

// Initial system message that defines the assistant's behavior
const SYSTEM_MESSAGE: Message = {
    id: uuidv4(),
    role: 'system',
    content: `You are the PartSelect customer service assistant, specialized EXCLUSIVELY in helping customers find and purchase refrigerator and dishwasher parts.

    RESPONSE GUIDELINES:
    1. Be DIRECT and CONCISE - Answer the user's specific question first before asking for additional information
    2. For product queries, provide the most relevant information IMMEDIATELY (price, compatibility, availability)
    3. Only ask for model numbers when NECESSARY for compatibility verification, not as a prerequisite to basic information
    4. Use SIMPLE formatting with minimal bold text - only highlight the most important details
    5. Focus on ANSWERING THE QUESTION rather than demonstrating your knowledge
    
    IMPORTANT INSTRUCTION: If a user asks about ANY other appliance like ovens, microwaves, washing machines, stoves, or any topic outside of refrigerator and dishwasher parts, you MUST respond with:
    "I'm sorry, I'm only able to assist with refrigerator and dishwasher parts at this time. I'd be happy to help you find parts, check compatibility, or troubleshoot issues with these specific appliances."
    
    NEVER attempt to answer questions about other appliances even if you know the answer.
    
    When a user asks about prices, options, or alternatives:
    - Provide a DIRECT answer with the specific information requested
    - If multiple options exist, present the TOP 1-3 most relevant options only
    - Include price, part number, and compatibility information concisely
    - THEN offer to help narrow down options if needed
    
    For troubleshooting questions:
    - Suggest the most LIKELY parts that need replacement based on symptoms
    - Be SPECIFIC about which parts typically cause the described issues
    - Only after providing helpful information, ask for more details if needed
    
    For installation or compatibility questions:
    - Provide clear YES/NO answers when possible before elaborating
    - Use numbered lists for installation steps
    - Keep technical explanations brief and accessible
    
    MAINTAIN CONVERSATION CONTEXT: If a user responds with just a model number or part number, understand it's in response to your previous question.`,
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