import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Synopsys.ai Copilot' },
    { path: '/compiler', label: 'Custom Compiler' },
    { path: '/fusion', label: 'Fusion Compiler' },
    { path: '/primetime', label: 'PrimeTime' },
    { path: '/vcs', label: 'VCS' },
    { path: '/dso', label: 'DSO.ai' },
    { path: '/ic-validator', label: 'IC Validator' },
    { path: '/vc-formal', label: 'VC Formal' },
    { path: '/vc-low-power', label: 'VC Low Power' },
    { path: '/vc-spyglass', label: 'VC SpyGlass' },
    { path: '/verdi', label: 'Verdi' },
    { path: '/testmax', label: 'TestMAX ATPG' },
    { path: '/primesim', label: 'PrimeSim Pro' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-32 h-full w-64 bg-white border-r border-gray-200 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:z-30 md:top-32
      `}>
        {/* Mobile Close Button */}
        <button 
          onClick={onToggle}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <nav className="flex flex-col p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  // Close mobile menu when item is clicked
                  if (window.innerWidth < 768) {
                    onToggle();
                  }
                }}
                className={`
                  block px-4 py-3 rounded-lg transition-all duration-200 relative
                  ${isActive 
                    ? 'bg-purple-100 text-purple-800 font-bold border-l-4 border-purple-800' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-purple-800'
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
