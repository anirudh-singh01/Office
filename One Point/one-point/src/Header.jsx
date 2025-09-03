import React from 'react';

const Header = ({ onMenuToggle }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-16 left-0 right-0 z-20">
      <div className="flex items-center justify-between p-6">
        {/* Left side - SYNOPSYS® logo */}
        <div className="text-purple-800 font-bold text-xl">SYNOPSYS®</div>
        
        {/* Center - Title and subtitle */}
        <div className="flex-1 flex justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-purple-800">
              Synopsys.ai Copilot
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Knowledge Assistant X-2025.06 for Synopsys.ai Copilot X-2025.06
            </p>
          </div>
        </div>
        
        {/* Right side - Mobile Menu Button (hidden on desktop) */}
        <button 
          onClick={onMenuToggle}
          className="p-2 text-gray-500 hover:text-gray-700 md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Invisible spacer for desktop to maintain centering */}
        <div className="hidden md:block w-6"></div>
      </div>
    </header>
  );
};

export default Header;
