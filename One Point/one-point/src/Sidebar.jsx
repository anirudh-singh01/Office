import React from 'react';

const Sidebar = ({ isOpen, onToggle, activeTool, setActiveTool, setActiveUrl }) => {
  const toolItems = [
    { id: 'synopsys-copilot', label: 'Synopsys.ai Copilot', url: 'https://example.com/synopsys-copilot' },
    { id: 'custom-compiler', label: 'Custom Compiler', url: 'https://snpsai-copilot-gtm/?product=cc' },
    { id: 'dso-ai', label: 'DSO.ai', url: 'https://snpsai-copilot-gtm/?product=dso' },
    { id: 'fusion-compiler', label: 'Fusion Compiler', url: 'https://snpsai-copilot-gtm/?product=fc' },
    { id: 'ic-validator', label: 'IC Validator', url: 'https://snpsai-copilot-gtm/?product=icv' },
    { id: 'primesim-pro', label: 'PrimeSim Pro', url: 'https://snpsai-copilot-gtm/?product=psim_pro' },
    { id: 'primetime', label: 'PrimeTime', url: 'https://snpsai-copilot-gtm/?product=pt' },
    { id: 'vc-formal', label: 'VC Formal', url: 'https://snpsai-copilot-gtm/?product=vcformal' },
    { id: 'vc-low-power', label: 'VC LP', url: 'https://snpsai-copilot-gtm/?product=vclp' },
    { id: 'vc-spyglass', label: 'VC SpyGlass', url: 'https://snpsai-copilot-gtm/?product=vcspyglass' },
    { id: 'vcs', label: 'VCS', url: 'https://snpsai-copilot-gtm/?product=vcs' },
    { id: 'verdi', label: 'Verdi', url: 'https://snpsai-copilot-gtm/?product=verdi' },
    { id: 'testmax', label: 'TestMAX ATPG', url: 'https://snpsai-copilot-gtm/?product=testmax' }
  ];

  const handleToolClick = (toolId, url) => {
    setActiveTool(toolId);
    setActiveUrl(url);
    // Close mobile menu when item is clicked
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

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
        fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:z-30 md:top-16
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
          {toolItems.map((item) => {
            const isActive = activeTool === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleToolClick(item.id, item.url)}
                className={`
                  block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 relative
                  ${isActive 
                    ? 'bg-purple-100 text-purple-800 font-bold border-l-4 border-purple-800' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-purple-800'
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
