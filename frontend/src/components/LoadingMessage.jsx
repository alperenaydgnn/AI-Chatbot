import React from 'react'

const LoadingMessage = () => {
  return (
    <div className="flex justify-start message-appear">
      <div className="flex flex-row items-end space-x-2 max-w-xs sm:max-w-md">
        
        {/* AI Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>

        {/* Loading Bubble */}
        <div className="relative px-4 py-3 bg-gray-100 rounded-2xl rounded-bl-md">
          <div className="flex items-center space-x-2">
            
            {/* Loading text */}
            <span className="text-sm text-gray-600">AI düşünüyor</span>
            
            {/* Animated dots */}
            <div className="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingMessage
