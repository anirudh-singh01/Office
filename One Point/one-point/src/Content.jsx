import React from 'react';

const Content = ({ children }) => {
  return (
    <main className="fixed left-0 md:left-64 top-32 right-0 bottom-0 bg-gray-50 overflow-auto z-0">
      <div className="h-full w-full pt-4">
        {children}
      </div>
    </main>
  );
};

export default Content;
