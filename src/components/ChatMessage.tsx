import React from 'react';
import { Message, ProductResult } from '@/lib/types';
import ProductCard from './ProductCard';
import { marked } from 'marked';

/**
 * Props for the ChatMessage component
 */
interface ChatMessageProps {
  message: Message;                      // The message to display
  isLastMessage?: boolean;               // Whether this is the most recent message
  productResults?: ProductResult[];      // Product data to show with the message
}

/**
 * Component that displays a single chat message
 * Handles both user and assistant messages with different styling
 */
const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isLastMessage = false,
  productResults = [] 
}) => {
  const isUser = message.role === 'user';
  
  /**
   * Converts markdown in message content to HTML
   * This allows for rich formatting in assistant messages
   */
  const renderMarkdown = (content: string) => {
    try {
      return { __html: marked(content) };
    } catch (error) {
      console.error('Failed to parse markdown:', error);
      return { __html: content };
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-in`}>
      {/* Assistant avatar (shown on the left for assistant messages) */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-teal-100 mr-2 flex-shrink-0 mt-1">
          <img 
            src="/robot-icon.svg" 
            alt="Assistant Icon" 
            className="h-8 w-10 text-teal-700" 
          />
        </div>
      )}
      
      {/* Message bubble with different styling for user vs assistant */}
      <div className={`
        max-w-3xl rounded-lg p-4 shadow-sm
        ${isUser 
          ? 'glass-dark text-white rounded-br-none' 
          : 'glass border border-gray-100 rounded-bl-none'
        }
        ${isLastMessage && !isUser ? 'ring-2 ring-yellow-200 ring-opacity-50' : ''}
      `}>
        {/* Message sender label */}
        <div className="font-medium text-sm mb-1 flex items-center">
          {isUser ? (
            <span>You</span>
          ) : (
            <span className="flex items-center">
              PartSelect Assistant
              <span className="ml-2 text-xs px-1.5 py-0.5 bg-teal-100 text-teal-800 rounded-full">AI</span>
            </span>
          )}
        </div>
        
        {/* Message content with markdown formatting */}
        <div 
          className={`prose ${isUser ? 'prose-invert' : ''} max-w-none`}
          dangerouslySetInnerHTML={renderMarkdown(message.content)}
        />
        
        {/* Product results section (only shown when products are found) */}
        {productResults && productResults.length > 0 && (
          <div className="mt-5 space-y-4 pt-4 border-t border-gray-200">
            <div className="font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {productResults.length === 1 
                ? 'I found this product that might help:' 
                : `I found ${productResults.length} products that might help:`}
            </div>
            {/* Grid of product cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* User avatar (shown on the right for user messages) */}
      {isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-teal-600 ml-2 flex-shrink-0 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;