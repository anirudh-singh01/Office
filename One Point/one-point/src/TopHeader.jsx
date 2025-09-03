import React from 'react';

const TopHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b-2 border-purple-500 z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Left side - Logo and title */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="font-bold text-purple-800 uppercase text-sm sm:text-lg">
            SYNOPSYS®
          </span>
          <span className="font-bold text-purple-800 uppercase text-sm sm:text-lg">
            SYNOPSYS.AI COPILOT
          </span>
        </div>
        
        {/* Right side - Help icon */}
        <div className="flex items-center">
          <button className="p-1 sm:p-2 text-blue-500 hover:text-blue-600 transition-colors">
            <svg 
              className="w-5 h-5 sm:w-6 sm:h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
