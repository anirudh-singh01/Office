import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Content from './Content';
import analytics from './utils/analytics';

// Tool configuration
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

const ToolRouter = ({ isSidebarOpen, onToggle }) => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState('');
  const [activeUrl, setActiveUrl] = useState("");

  // Handle tool selection from URL
  useEffect(() => {
    if (toolId) {
      const tool = toolItems.find(item => item.id === toolId);
      if (tool) {
        setActiveTool(toolId);
        setActiveUrl(tool.url);
        // Track tool usage
        analytics.trackToolUsage(toolId, tool.label);
      } else {
        // Invalid tool ID, redirect to home
        navigate('/');
      }
    } else {
      // No tool selected, show welcome page
      setActiveTool('');
      setActiveUrl('');
    }
  }, [toolId, navigate]);

  const handleToolClick = (toolId) => {
    // Navigate to the tool URL
    navigate(`/tool/${toolId}`);
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={onToggle}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        setActiveUrl={setActiveUrl}
        onToolClick={handleToolClick}
        toolItems={toolItems}
      />
      
      {/* Content Area */}
      <Content activeUrl={activeUrl}>
        {!activeUrl && (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-[#5a2a82] mb-4">
              Welcome to GTM Copilot
            </h1>
            <p className="text-gray-600 mb-6">
              Select a tool from the sidebar to get started with your Synopsys workflow.
            </p>
            <h2 className="text-xl font-semibold text-[#5a2a82] mb-4">Available Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {toolItems.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool.id)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-[#5a2a82] hover:bg-[#f3f0f7] transition-all duration-200 text-left"
                >
                  <h3 className="font-semibold text-[#5a2a82] mb-2">{tool.label}</h3>
                  <p className="text-sm text-gray-600">Click to open {tool.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </Content>
    </>
  );
};

export default ToolRouter;
