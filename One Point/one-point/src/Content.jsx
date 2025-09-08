import React, { useState } from 'react';

const Content = ({ activeUrl, children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <main className="fixed left-0 md:left-64 top-16 right-0 bottom-0 bg-gray-50 overflow-auto z-0">
      <div className="h-full w-full pt-4">
        {activeUrl ? (
          <div className="relative h-full w-full">
            {/* Loading Spinner */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a2a82]"></div>
                  <p className="text-gray-600 font-medium">Loading Synopsys Tool...</p>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                <div className="text-center p-8">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Tool</h3>
                  <p className="text-gray-600 mb-4">There was an error loading the Synopsys tool.</p>
                  <button 
                    onClick={() => {
                      setHasError(false);
                      setIsLoading(true);
                      // Force iframe reload by changing src
                      const iframe = document.querySelector('iframe');
                      if (iframe) {
                        iframe.src = activeUrl;
                      }
                    }}
                    className="px-4 py-2 bg-[#5a2a82] text-white rounded-lg hover:bg-[#4a1f6b] transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
            
            <iframe 
              src={activeUrl} 
              className="h-full w-full border-none rounded-md"
              title="Synopsys Tool Content"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              allowFullScreen
              loading="lazy"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              onLoadStart={() => setIsLoading(true)}
            />
          </div>
        ) : (
          children
        )}
      </div>
    </main>
  );
};

export default Content;
