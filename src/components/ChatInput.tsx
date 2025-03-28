import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-adjust height of textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 100); // Cap at 100px height
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const placeholderOptions = [
    "Ask about refrigerator parts...",
    "Need help finding dishwasher parts?",
    "Ask me about part compatibility...",
    "How can I help with your appliance repair?",
  ];
  
  // Get random placeholder text
  const getRandomPlaceholder = () => {
    const randomIndex = Math.floor(Math.random() * placeholderOptions.length);
    return placeholderOptions[randomIndex];
  };
  
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
        
        {/* Button with animated effect */}
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