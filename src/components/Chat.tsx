import React, { useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Message} from '@/lib/types';

const Chat: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    resetChat,
    productResults
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* Simple header with clean styling */}
      <div className="bg-teal-600 flex items-center justify-between p-4 border-b border-teal-700 text-white">
        <div className="flex items-center">
          <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full mr-3">
            <img 
              src="https://partselectcom-gtcdcddbene3cpes.z01.azurefd.net/images/ps-25-year-crest.svg" 
              alt="PartSelect" 
              className="h-6 w-6" 
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold mb-1">PartSelect Assistant</h1>
            <p className="text-xs text-teal-100">Helping you find the right parts</p>
          </div>
        </div>
        
        <button 
          onClick={resetChat}
          className="bg-teal-700 hover:bg-teal-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <span className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New Chat
          </span>
        </button>
      </div>
      
      {/* Chat messages - simple scrollable container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-700">
            <div className="text-center max-w-md p-4 bg-white rounded-lg shadow-sm">
              <div className="mb-6">
                <img 
                  src="/robot-icon.svg" 
                  alt="Assistant" 
                  className="w-20 h-20 mx-auto mb-4 opacity-80"
                />
                <h2 className="text-xl font-medium mb-2 text-teal-800">Welcome to PartSelect Assistant</h2>
                <p className="mb-4 text-sm text-gray-600">
                  I can help you find the right refrigerator and dishwasher parts, 
                  check compatibility, and provide installation guidance.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3 text-sm">
                <h3 className="text-left text-teal-600 font-medium mb-1">Try asking about:</h3>
                <button
                  onClick={() => sendMessage("Is part PS11752778 compatible with my Whirlpool refrigerator?")}
                  className="p-3 bg-white border border-gray-200 text-left rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <span className="w-8 h-8 mr-2 flex items-center justify-center bg-teal-50 rounded-full text-teal-600 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span className="line-clamp-2">"Is part PS11752778 compatible with my Whirlpool refrigerator?"</span>
                </button>
                
                <button
                  onClick={() => sendMessage("My ice maker is not working. What part do I need?")}
                  className="p-3 bg-white border border-gray-200 text-left rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <span className="w-8 h-8 mr-2 flex items-center justify-center bg-teal-50 rounded-full text-teal-600 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </span>
                  <span className="line-clamp-2">"My ice maker is not working. What part do I need?"</span>
                </button>
                
                <button
                  onClick={() => sendMessage("How do I install a water filter for model WRS325SDHZ?")}
                  className="p-3 bg-white border border-gray-200 text-left rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <span className="w-8 h-8 mr-2 flex items-center justify-center bg-teal-50 rounded-full text-teal-600 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span className="line-clamp-2">"How do I install a water filter for model WRS325SDHZ?"</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message: Message, index: number) => (
            <ChatMessage 
              key={index} 
              message={message} 
              isLastMessage={index === messages.length - 1}
              productResults={
                message.role === "assistant" && message.id === messages[messages.length - 1].id 
                ? productResults : []
              }
            />
          ))
        )}
        {isLoading && (
          <div className="flex items-center text-gray-500">
            <div className="bg-white px-3 py-2 rounded-lg inline-flex items-center text-sm shadow-sm">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Thinking...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="p-3 text-red-500 bg-red-50 rounded-md text-sm border border-red-100">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Error: {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat input */}
      <div className="border-t border-gray-200 p-3 bg-white">
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </>
  );
};

export default Chat;