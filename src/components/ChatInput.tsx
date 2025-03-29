import React, { useState, useRef, useEffect } from 'react';

/**
 * Props for the ChatInput component
 */
interface ChatInputProps {
  onSendMessage: (message: string) => void;  // Function to send the message
  isLoading: boolean;                        // Whether the app is waiting for a response
}

/**
 * Component that handles user message input
 * Provides a textarea with auto-resizing and submit button
 */
const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');                  // Current text in the input field
  const [isFocused, setIsFocused] = useState(false);       // Whether the input is focused
  const textareaRef = useRef<HTMLTextAreaElement>(null);   // Reference to the textarea element

  // Auto-adjust height of textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 100); // Cap at 100px height
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  /**
   * Handles form submission when user clicks send button
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      
      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  /**
   * Handles keyboard events in the textarea
   * Allows sending with Enter key (without Shift)
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  /**
   * List of possible placeholder messages
   * Adds variety to the user interface
   */
  const placeholderOptions = [
    "Ask about refrigerator parts...",
    "Need help finding dishwasher parts?",
    "Ask me about part compatibility...",
    "How can I help with your appliance repair?",
  ];
  
  /**
   * Selects a random placeholder from the list
   */
  const getRandomPlaceholder = () => {
    const randomIndex = Math.floor(Math.random() * placeholderOptions.length);
    return placeholderOptions[randomIndex];
  };
  
  // Set a random placeholder once when component loads
  const [placeholder] = useState(getRandomPlaceholder());

  return (
    <form onSubmit={handleSubmit} className="flex items-end relative">
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full px-3 py-3 pr-12 resize-none overflow-hidden rounded-md border border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm max-h-24 glass"
          rows={1}
          disabled={isLoading}
        />
        
        {/* Send button with animated effect */}
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`absolute right-1.5 bottom-1.5 p-1.5 rounded-full transition-all duration-300 overflow-hidden
            ${input.trim() && !isLoading
              ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-4 h-4 sm:w-5 sm:h-5"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" 
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;