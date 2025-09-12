import React from 'react';

function DropIndicator({ isVisible, text = 'Drop here' }) {
  if (!isVisible) return null;
  
  return (
    <div className="flex-shrink-0 flex items-center justify-center border-2 border-dashed border-blue-400 bg-blue-50 rounded-md p-4 h-full min-w-[200px]">
      <div className="text-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-10 w-10 text-blue-400 mx-auto mb-2"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
        <p className="text-blue-600 font-medium">{text}</p>
      </div>
    </div>
  );
}

export default DropIndicator;