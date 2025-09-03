import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-purple-800 text-white flex-shrink-0 hidden md:flex flex-col">
          <div className="p-4 text-lg font-bold border-b border-purple-700">
            Synopsys.ai
          </div>
          <nav className="flex-1 p-2 space-y-2">
            <Link to="/" className="block p-2 rounded hover:bg-purple-700">
              Synopsys.ai Copilot
            </Link>
            <Link to="/compiler" className="block p-2 rounded hover:bg-purple-700">
              Custom Compiler
            </Link>
            <Link to="/fusion" className="block p-2 rounded hover:bg-purple-700">
              Fusion Compiler
            </Link>
            <Link to="/primetime" className="block p-2 rounded hover:bg-purple-700">
              PrimeTime
            </Link>
            <Link to="/vcs" className="block p-2 rounded hover:bg-purple-700">
              VCS
            </Link>
            {/* Add other links here */}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow p-4">
            <h1 className="text-2xl font-bold text-purple-800">
              Synopsys.ai Copilot
            </h1>
          </header>

          {/* Page Content */}
          <main className="p-6 flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<h2>Welcome to Synopsys.ai Copilot 🚀</h2>} />
              <Route path="/compiler" element={<h2>Custom Compiler Page</h2>} />
              <Route path="/fusion" element={<h2>Fusion Compiler Page</h2>} />
              <Route path="/primetime" element={<h2>PrimeTime Page</h2>} />
              <Route path="/vcs" element={<h2>VCS Page</h2>} />
              {/* Add other routes here */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App
