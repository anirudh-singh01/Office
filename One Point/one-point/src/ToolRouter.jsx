import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Content from './Content';
import analytics from './utils/analytics';

// Tool configuration with fallback
const getToolItems = () => {
  const baseUrl = window.ENV?.baseUrl || 'https://snpsai-copilot-gtm';
  
  return [
    { id: 'fusion-compiler', label: 'Fusion Compiler *', url: `${baseUrl}/?product=fc` },
    { id: 'primetime', label: 'PrimeTime *', url: `${baseUrl}/?product=pt` },
    { id: 'custom-compiler', label: 'Custom Compiler *', url: `${baseUrl}/?product=cc` },
    { id: 'vcs', label: 'VCS', url: `${baseUrl}/?product=vcs` },
    { id: 'dso-ai', label: 'DSO.ai', url: `${baseUrl}/?product=dso` },
    { id: 'ic-validator', label: 'IC Validator', url: `${baseUrl}/?product=icv` },
    { id: 'primesim-pro', label: 'PrimeSim Pro', url: `${baseUrl}/?product=psim_pro` },
    { id: 'vc-formal', label: 'VC Formal', url: `${baseUrl}/?product=vcformal` },
    { id: 'vc-low-power', label: 'VC LP', url: `${baseUrl}/?product=vclp` },
    { id: 'vc-spyglass', label: 'VC SpyGlass', url: `${baseUrl}/?product=vcspyglass` },
    { id: 'verdi', label: 'Verdi', url: `${baseUrl}/?product=verdi` },
    { id: 'synopsys-copilot', label: 'Synopsys.ai Copilot **', url: `${baseUrl}/?product=copilot` }
  ];
};

const ToolRouter = ({ isSidebarOpen, onToggle }) => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState('');
  const [activeUrl, setActiveUrl] = useState("");

  // Handle tool selection from URL
  useEffect(() => {
    if (toolId) {
      const toolItems = getToolItems();
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
        toolItems={getToolItems()}
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
              {getToolItems().map((tool) => (
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
