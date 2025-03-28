import React from 'react';
import { Message, ProductResult } from '@/lib/types';
import ProductCard from './ProductCard';
import { marked } from 'marked';

interface ChatMessageProps {
  message: Message;
  isLastMessage?: boolean;
  productResults?: ProductResult[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isLastMessage = false,
  productResults = [] 
}) => {
  const isUser = message.role === 'user';
  
  // Convert markdown to HTML
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
      {/* User avatar for assistant messages */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-teal-100 mr-2 flex-shrink-0 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      
      <div className={`
        max-w-3xl rounded-lg p-4 shadow-sm
        ${isUser 
          ? 'glass-dark text-white rounded-br-none' 
          : 'glass border border-gray-100 rounded-bl-none'
        }
        ${isLastMessage && !isUser ? 'ring-2 ring-yellow-200 ring-opacity-50' : ''}
      `}>
        {/* Message sender */}
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
        
        {/* Message content */}
        <div 
          className={`prose ${isUser ? 'prose-invert' : ''} max-w-none`}
          dangerouslySetInnerHTML={renderMarkdown(message.content)}
        />
        
        {/* Product results */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* User avatar for user messages */}
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