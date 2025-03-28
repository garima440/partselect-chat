import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ProductResult, ChatState } from '@/lib/types';

// Enhanced system message with product accuracy instructions
const SYSTEM_MESSAGE: Message = {
    id: uuidv4(),
    role: 'system',
    content: `You are the PartSelect customer service assistant, specialized in helping customers with refrigerator and dishwasher parts and issues.

    YOUR CORE CAPABILITIES:
    1. Provide information about refrigerator and dishwasher parts, including compatibility, pricing, and availability
    2. Assist with troubleshooting common refrigerator and dishwasher problems
    3. Offer installation guidance for replacement parts
    4. Explain how different parts function within appliances
    5. Recommend appropriate parts based on symptoms or issues described
    
    RESPONSE GUIDELINES:
    1. Be DIRECT and CONCISE - Answer the user's specific question first before asking for additional information
    2. For product queries, provide the most relevant information IMMEDIATELY (price, compatibility, availability)
    3. Only ask for model numbers when NECESSARY for compatibility verification
    4. Use SIMPLE formatting with minimal bold text - only highlight the most important details
    5. Focus on ANSWERING THE QUESTION rather than demonstrating your knowledge
    
    PRODUCT INFORMATION ACCURACY:
    - When a specific part number is mentioned, ALWAYS describe it according to its EXACT product type from the database
    - NEVER change the product type or category from what is in the database
    - If you're uncertain about a specific part, acknowledge the limitation of your information rather than making assumptions
    
    GENERAL KNOWLEDGE ABOUT APPLIANCES:
    - You CAN provide general information about how refrigerators and dishwashers work
    - You CAN offer general troubleshooting steps for common issues
    - You CAN explain the function of different components within these appliances
    - You CAN suggest DIY fixes for simple problems that don't require replacement parts
    
    OUT OF SCOPE:
    - If a user asks about ANY other appliance like ovens, microwaves, washing machines, stoves, or topics completely unrelated to refrigerators and dishwashers, politely redirect:
      "I'm sorry, I'm specialized in refrigerator and dishwasher information. I'd be happy to help with any questions about those appliances."
    
    CONVERSATION STYLE:
    - Be helpful, friendly, and knowledgeable
    - Use everyday language, avoiding overly technical terms unless necessary
    - When explaining complex concepts, use analogies or simplified explanations
    - For troubleshooting, use step-by-step instructions
    - For part information, be precise and factual`,
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
    
    // Also try to extract bare part numbers that might be in the message
    const barePartNumberRegex = /\b([A-Z]{2,3}[0-9]{6,10})\b/i;
    
    const partNumberMatch = message.match(partNumberRegex) || message.match(barePartNumberRegex);
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
      
      // Log extracted terms for debugging
      if (partNumber || modelNumber) {
        console.log('Extracted search terms:', { partNumber, modelNumber });
      }
      
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