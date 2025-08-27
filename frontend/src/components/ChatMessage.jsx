import React from 'react'

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user'
  const isError = message.isError || false
  
  // Zaman formatı
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} message-appear`}>
      <div className={`flex max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : isError 
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-600'
        }`}>
          {isUser ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          ) : isError ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          )}
        </div>

        {/* Message Bubble */}
        <div className={`relative px-4 py-2 rounded-2xl ${
          isUser 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : isError
              ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-md'
              : 'bg-gray-100 text-gray-800 rounded-bl-md'
        }`}>
          
          {/* Message Text */}
          <div className={`text-sm sm:text-base ${isUser ? 'text-white' : isError ? 'text-red-800' : 'text-gray-800'}`}>
            {message.text.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < message.text.split('\n').length - 1 && <br />}
              </span>
            ))}
          </div>

          {/* Timestamp */}
          <div className={`text-xs mt-1 ${
            isUser 
              ? 'text-blue-100' 
              : isError 
                ? 'text-red-500'
                : 'text-gray-500'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
