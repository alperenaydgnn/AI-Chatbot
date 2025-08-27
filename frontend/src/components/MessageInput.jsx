import React, { useState, useRef } from 'react'

const MessageInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)

  // Mesaj gönderme fonksiyonu
  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message)
      setMessage('')
      // Textarea yüksekliğini sıfırla
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  // Enter tuşu ile gönderme
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Textarea otomatik yükseklik ayarı
  const handleInputChange = (e) => {
    setMessage(e.target.value)
    
    // Otomatik yükseklik ayarı
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          
          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={disabled ? "AI yanıt yazıyor..." : "Mesajınızı yazın... (Enter ile gönderin)"}
              disabled={disabled}
              rows={1}
              className="w-full resize-none border-0 outline-none bg-transparent text-gray-900 placeholder-gray-500 text-sm sm:text-base leading-6 max-h-32 overflow-y-auto"
              style={{ minHeight: '24px' }}
            />
            
            {/* Karakter sayacı */}
            {message.length > 100 && (
              <div className="absolute bottom-0 right-0 text-xs text-gray-400">
                {message.length}/1000
              </div>
            )}
          </div>

          {/* Gönder Butonu */}
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              message.trim() && !disabled
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title={disabled ? "Lütfen bekleyin..." : "Mesaj gönder (Enter)"}
          >
            {disabled ? (
              // Loading spinner
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              // Send icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
          <span>
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Enter</kbd>
            {' '}ile gönder, 
            <kbd className="ml-1 px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Shift+Enter</kbd>
            {' '}ile yeni satır
          </span>
          
          {disabled && (
            <span className="text-blue-600 flex items-center">
              <svg className="animate-spin w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              AI düşünüyor...
            </span>
          )}
        </div>
      </form>
    </div>
  )
}

export default MessageInput
