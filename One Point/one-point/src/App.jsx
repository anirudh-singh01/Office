import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, useCallback } from 'react';
import TopHeader from './TopHeader';
import ToolRouter from './ToolRouter';
import ErrorBoundary from './ErrorBoundary';
import analytics from './utils/analytics';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen]);

  // Track initial page load
  useEffect(() => {
    analytics.trackPageView('home');
    
    // Track performance metrics after page load
    const trackPerformance = () => {
      setTimeout(() => {
        analytics.trackPerformance();
      }, 1000);
    };
    
    if (document.readyState === 'complete') {
      trackPerformance();
    } else {
      window.addEventListener('load', trackPerformance);
      return () => window.removeEventListener('load', trackPerformance);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Close sidebar with Escape key
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
        analytics.trackInteraction('sidebar_close', 'keyboard_escape');
      }
      
      // Toggle sidebar with Ctrl/Cmd + B
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
        analytics.trackInteraction('sidebar_toggle', 'keyboard_shortcut');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isSidebarOpen, toggleSidebar]);

  return (
    <ErrorBoundary>
      <Router>
        <div className="h-screen bg-gray-50">
          {/* TopHeader - Fixed at very top */}
          <TopHeader onMenuToggle={toggleSidebar} />
          
          {/* Main Content with Tool Routing */}
          <Routes>
            <Route path="/" element={<ToolRouter isSidebarOpen={isSidebarOpen} onToggle={toggleSidebar} />} />
            <Route path="/tool/:toolId" element={<ToolRouter isSidebarOpen={isSidebarOpen} onToggle={toggleSidebar} />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App
