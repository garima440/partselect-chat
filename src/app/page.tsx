'use client';

import React from 'react';
import Chat from '@/components/Chat';

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center p-3 md:p-5 overflow-hidden bg-gray-100">
      <div className="flex w-full max-w-4xl mx-auto mb-4 justify-between items-center">
        <div className="flex items-center">
          <img 
            src="https://partselectcom-gtcdcddbene3cpes.z01.azurefd.net/images/ps-25-year-logo.svg" 
            alt="PartSelect" 
            className="h-8 w-auto mr-2 sm:h-10 sm:mr-3"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-teal-700 font-heading">
            PartSelect
          </h1>
        </div>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><a href="#" className="text-teal-600 hover:text-teal-800 font-medium transition">Home</a></li>
            <li><a href="#" className="text-teal-600 hover:text-teal-800 font-medium transition">Products</a></li>
            <li><a href="#" className="text-teal-600 hover:text-teal-800 font-medium transition">Support</a></li>
            <li>
              <a 
                href="#" 
                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-md font-medium hover:bg-yellow-400 transition"
              >
                Shop Parts
              </a>
            </li>
          </ul>
        </nav>
        
        <button className="md:hidden">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-teal-700" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        </button>
      </div>
      
      <div className="w-full max-w-4xl mx-auto flex flex-col flex-1 relative overflow-hidden">
        {/* Chat container with simple shadow */}
        <div className="flex flex-col h-full rounded-lg shadow-md overflow-hidden bg-white border border-gray-200">
          <Chat />
        </div>
      </div>
      
      <footer className="w-full max-w-4xl mx-auto mt-4 py-2 text-center text-xs sm:text-sm text-gray-500">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <span>© 2024 PartSelect. All rights reserved.</span>
          <a href="#" className="hover:text-teal-600 transition">Privacy</a>
          <a href="#" className="hover:text-teal-600 transition">Terms</a>
        </div>
      </footer>
    </main>
  );
}