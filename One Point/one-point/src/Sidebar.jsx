import React from 'react';

const Sidebar = ({ isOpen, onToggle, activeTool, setActiveTool, setActiveUrl }) => {
  const toolItems = [
    { id: 'fusion-compiler', label: 'Fusion Compiler *', url: 'https://snpsai-copilot-gtm/?product=fc' },
    { id: 'primetime', label: 'PrimeTime *', url: 'https://snpsai-copilot-gtm/?product=pt' },
    { id: 'custom-compiler', label: 'Custom Compiler *', url: 'https://snpsai-copilot-gtm/?product=cc' },
    { id: 'vcs', label: 'VCS', url: 'https://snpsai-copilot-gtm/?product=vcs' },
    { id: 'dso-ai', label: 'DSO.ai', url: 'https://snpsai-copilot-gtm/?product=dso' },
    { id: 'ic-validator', label: 'IC Validator', url: 'https://snpsai-copilot-gtm/?product=icv' },
    { id: 'primesim-pro', label: 'PrimeSim Pro', url: 'https://snpsai-copilot-gtm/?product=psim_pro' },
    { id: 'vc-formal', label: 'VC Formal', url: 'https://snpsai-copilot-gtm/?product=vcformal' },
    { id: 'vc-low-power', label: 'VC LP', url: 'https://snpsai-copilot-gtm/?product=vclp' },
    { id: 'vc-spyglass', label: 'VC SpyGlass', url: 'https://snpsai-copilot-gtm/?product=vcspyglass' },
    { id: 'verdi', label: 'Verdi', url: 'https://snpsai-copilot-gtm/?product=verdi' },
    { id: 'synopsys-copilot', label: 'Synopsys.ai Copilot **', url: 'https://snpsai-copilot-gtm/?product=copilot' }
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
                   block w-full text-left px-4 py-3 rounded-lg relative transition-all duration-200 ease-in-out
                   ${isActive 
                     ? 'bg-[#f3f0f7] text-[#5a2a82] font-bold border-l-4 border-[#5a2a82]' 
                     : 'text-gray-700 hover:bg-gray-100 hover:text-[#5a2a82] border-b-2 border-transparent hover:border-[#5a2a82]'
                   }
                 `}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
        
        {/* Legend/Explanation */}
        <div className="px-4 pb-4 border-t border-gray-200 pt-4 mt-4">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-start">
              <span className="text-gray-500 mr-1">*</span>
              <span>includes Workflow Assistant (WA) for TCL code generation (just start with /generate)</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-500 mr-1">**</span>
              <span>this is for query only</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
