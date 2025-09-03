import React from 'react';

const Content = ({ children, activeUrl }) => {
  return (
    <main className="fixed left-0 md:left-64 top-32 right-0 bottom-0 bg-gray-50 overflow-auto z-0">
      <div className="h-full w-full pt-4">
        {activeUrl ? (
          <iframe 
            src={activeUrl} 
            className="h-full w-full border-none rounded-md"
            title="Tool Content"
            sandbox="allow-same-origin allow-scripts allow-popups"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-600 mb-2">Select a tool to view</h2>
              <p className="text-gray-500">Choose a tool from the sidebar to display its content</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Content;
