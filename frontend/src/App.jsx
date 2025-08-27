import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ChatMessage from './components/ChatMessage'
import MessageInput from './components/MessageInput'
import LoadingMessage from './components/LoadingMessage'
import Header from './components/Header'

// API base URL - production'da otomatik olarak ayarlanır
const API_BASE_URL = import.meta.env.PROD 
  ? window.location.origin 
  : 'http://localhost:5000'

function App() {
  // State tanımlamaları
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Chat alanı referansı (otomatik scroll için)
  const chatEndRef = useRef(null)

  // Sohbet geçmişini LocalStorage'dan yükle
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('chatbot-messages')
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages)
        setMessages(parsedMessages)
      }
    } catch (error) {
      console.error('Sohbet geçmişi yüklenirken hata:', error)
    }
  }, [])

  // Mesajlar değiştiğinde LocalStorage'ı güncelle
  useEffect(() => {
    try {
      localStorage.setItem('chatbot-messages', JSON.stringify(messages))
    } catch (error) {
      console.error('Sohbet geçmişi kaydedilirken hata:', error)
    }
  }, [messages])

  // Otomatik scroll - yeni mesaj geldiğinde
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Mesaj gönderme fonksiyonu
  const sendMessage = async (messageText) => {
    if (!messageText.trim() || loading) return

    // Kullanıcı mesajını ekle
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setLoading(true)
    setError(null)

    try {
      // API'ye istek gönder
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: messageText,
        history: messages // Sohbet geçmişini de gönder
      }, {
        timeout: 30000, // 30 saniye timeout
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // AI yanıtını ekle
      const aiMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'ai',
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, aiMessage])
      
    } catch (error) {
      console.error('Mesaj gönderilirken hata:', error)
      
      let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.'
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.'
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.'
      }

      // Hata mesajını göster
      const errorMsg = {
        id: Date.now() + 1,
        text: `❌ ${errorMessage}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        isError: true
      }

      setMessages(prev => [...prev, errorMsg])
      setError(errorMessage)
      
    } finally {
      setLoading(false)
    }
  }

  // Sohbet geçmişini temizle
  const clearHistory = () => {
    setMessages([])
    setError(null)
    localStorage.removeItem('chatbot-messages')
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <Header onClearHistory={clearHistory} messageCount={messages.length} />

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden px-4 pb-4">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto chat-scrollbar bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Merhaba! 👋
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Ben AI destekli asistanınızım. Size nasıl yardımcı olabilirim? 
                  Herhangi bir sorunuz varsa çekinmeden sorun!
                </p>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                />
              ))}
            </div>

            {/* Loading Indicator */}
            {loading && <LoadingMessage />}

            {/* Auto-scroll anchor */}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <MessageInput 
            onSendMessage={sendMessage} 
            disabled={loading}
          />
        </div>
      </div>
    </div>
  )
}

export default App
