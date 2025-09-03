import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import TopHeader from './TopHeader';
import Sidebar from './Sidebar';
import Content from './Content';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTool, setActiveTool] = useState('custom-compiler');
  const [activeUrl, setActiveUrl] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="h-screen bg-gray-50">
        {/* TopHeader - Fixed at very top */}
        <TopHeader />
        
        {/* Sidebar - Below TopHeader */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onToggle={toggleSidebar}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          setActiveUrl={setActiveUrl}
        />
        
        {/* Content Area - Below TopHeader, to the right of sidebar */}
        <Content activeUrl={activeUrl}>
          <Routes>
            <Route path="/" element={<div className="p-6">Welcome to Synopsys.ai Copilot 🚀</div>} />
            <Route path="/synopsys-copilot" element={<div className="p-6">Synopsys.ai Copilot Page</div>} />
            <Route path="/custom-compiler" element={<div className="p-6">Custom Compiler Page</div>} />
            <Route path="/fusion-compiler" element={<div className="p-6">Fusion Compiler Page</div>} />
            <Route path="/primetime" element={<div className="p-6">PrimeTime Page</div>} />
            <Route path="/vcs" element={<div className="p-6">VCS Page</div>} />
            <Route path="/dso-ai" element={<div className="p-6">DSO.ai Page</div>} />
            <Route path="/ic-validator" element={<div className="p-6">IC Validator Page</div>} />
            <Route path="/vc-formal" element={<div className="p-6">VC Formal Page</div>} />
            <Route path="/vc-low-power" element={<div className="p-6">VC Low Power Page</div>} />
            <Route path="/vc-spyglass" element={<div className="p-6">VC SpyGlass Page</div>} />
            <Route path="/verdi" element={<div className="p-6">Verdi Page</div>} />
            <Route path="/testmax" element={<div className="p-6">TestMAX ATPG Page</div>} />
            <Route path="/primesim-pro" element={<div className="p-6">PrimeSim Pro Page</div>} />
          </Routes>
        </Content>
      </div>
    </Router>
  );
}

export default App
