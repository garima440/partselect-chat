import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ProductResult, ChatState } from '@/lib/types';

/**
 * Default system message that tells the AI assistant how to behave
 * This defines the assistant's capabilities and response style
 */
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

/**
 * Custom hook that manages the chat state and provides functions
 * for sending messages and resetting the chat
 */
export function useChat(): ChatState & {
  sendMessage: (content: string) => Promise<void>;
  resetChat: () => void;
} {
  // Initialize state for messages, loading status, errors, and product results
  const [state, setState] = useState<ChatState>({
    messages: [],          // Chat conversation history
    isLoading: false,      // Whether we're waiting for a response
    error: null,           // Any error that occurred
    productResults: [],    // Product data returned from searches
  });

  // Load saved chat messages from browser storage when the app starts
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

  // Save messages to browser storage whenever they change
  useEffect(() => {
    if (state.messages.length > 0) {
      localStorage.setItem('partselect-chat-messages', JSON.stringify(state.messages));
    }
  }, [state.messages]);

  /**
   * Looks for part numbers and model numbers in the user's message
   * This helps the assistant understand what specific products the user is asking about
   */
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

  /**
   * Sends a user message to the API and gets a response from the assistant
   * Also handles loading states and error handling
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

  // Create new user message
  const userMessage: Message = {
    id: uuidv4(),
    role: 'user',
    content,
    timestamp: Date.now(),
  };

  // Update state with user message and set loading status to true
  setState(prevState => ({
    ...prevState,
    messages: [...prevState.messages, userMessage],
    isLoading: true,
    error: null,
  }));

  try {
    // Extract part numbers and model numbers from the message
    const { partNumber, modelNumber } = extractSearchTerms(content);
    
    // Log extracted terms for debugging
    if (partNumber || modelNumber) {
      console.log('Extracted search terms:', { partNumber, modelNumber });
    }
    
    // Create a limited context window - only use recent messages
    // to keep the API request smaller and faster
    let messagesToSend = [];
    const allMessages = [...state.messages, userMessage];
    
    // Always include system message if it exists
    const systemMessage = allMessages.find(m => m.role === 'system');
    if (systemMessage) {
      messagesToSend.push(systemMessage);
    } else {
      messagesToSend.push(SYSTEM_MESSAGE);
    }
    
    // Get last 6 messages from conversation (or however many exist if fewer)
    // This keeps the context window manageable
    const recentMessages = allMessages.filter(m => m.role !== 'system')
                                     .slice(-6);
    
    // Combine system message with recent messages
    messagesToSend = [...messagesToSend, ...recentMessages];
    
    // Send request to the API with the messages and extracted search terms
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messagesToSend,
        partNumber,
        modelNumber,
      }),
    });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Update state with the assistant's response and any product results
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

  /**
   * Clears all chat messages and resets the state
   */
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