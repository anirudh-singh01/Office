import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import TopHeader from './TopHeader';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from './Content';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="h-screen bg-gray-50">
        {/* TopHeader - Fixed at very top */}
        <TopHeader />
        
        {/* Header - Below TopHeader */}
        <Header onMenuToggle={toggleSidebar} />
        
        {/* Sidebar - Below both headers */}
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        
        {/* Content Area - Below both headers, to the right of sidebar */}
        <Content>
          <Routes>
            <Route path="/" element={<div className="p-6">Welcome to Synopsys.ai Copilot 🚀</div>} />
            <Route path="/compiler" element={<div className="p-6">Custom Compiler Page</div>} />
            <Route path="/fusion" element={<div className="p-6">Fusion Compiler Page</div>} />
            <Route path="/primetime" element={<div className="p-6">PrimeTime Page</div>} />
            <Route path="/vcs" element={<div className="p-6">VCS Page</div>} />
            <Route path="/dso" element={<div className="p-6">DSO.ai Page</div>} />
            <Route path="/ic-validator" element={<div className="p-6">IC Validator Page</div>} />
            <Route path="/vc-formal" element={<div className="p-6">VC Formal Page</div>} />
            <Route path="/vc-low-power" element={<div className="p-6">VC Low Power Page</div>} />
            <Route path="/vc-spyglass" element={<div className="p-6">VC SpyGlass Page</div>} />
            <Route path="/verdi" element={<div className="p-6">Verdi Page</div>} />
            <Route path="/testmax" element={<div className="p-6">TestMAX ATPG Page</div>} />
            <Route path="/primesim" element={<div className="p-6">PrimeSim Pro Page</div>} />
          </Routes>
        </Content>
      </div>
    </Router>
  );
}

export default App
