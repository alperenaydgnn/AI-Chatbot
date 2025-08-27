const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

// Environment değişkenlerini yükle - .env dosyasının tam yolunu belirt
dotenv.config({ path: path.join(__dirname, '.env') });

// Groq API konfigürasyonu
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

console.log('Environment variables loaded:');
console.log('GROQ_API_KEY from env exists:', !!process.env.GROQ_API_KEY);
console.log('GROQ_API_KEY final value exists:', !!GROQ_API_KEY);
console.log('GROQ_API_KEY starts with gsk_:', GROQ_API_KEY?.startsWith('gsk_'));
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware'ler
app.use(helmet()); // Güvenlik headers'ları
app.use(cors()); // CORS politikası
app.use(express.json({ limit: '10mb' })); // JSON parser

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Chatbot API çalışıyor',
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint - Ana AI sohbet fonksiyonu
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // Giriş validasyonu
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Geçerli bir mesaj göndermelisiniz.',
        code: 'INVALID_MESSAGE'
      });
    }

    // API key kontrolü
    if (!GROQ_API_KEY || GROQ_API_KEY === '') {
      return res.status(500).json({
        error: 'Groq API anahtarı yapılandırılmamış. Lütfen GROQ_API_KEY environment variable\'ını ayarlayın.',
        code: 'MISSING_API_KEY'
      });
    }

    // Sohbet geçmişini OpenAI uyumlu formata çevir
    const messages = [
      {
        role: 'system',
        content: 'Sen yardımsever, bilgili ve dostane bir AI asistanısın. Kullanıcılara Türkçe olarak net, anlaşılır ve faydalı yanıtlar veriyorsun. Sorularını nazikçe yanıtla ve gerektiğinde detaylı açıklamalar yap. Cevaplarını mümkün olduğunca kısa ve öz tut.'
      },
      // Geçmiş mesajları ekle (son 10 mesajı al)
      ...history.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      // Yeni mesajı ekle
      {
        role: 'user',
        content: message.trim()
      }
    ];

    console.log('Groq API\'ye istek gönderiliyor...', {
      url: GROQ_API_URL,
      keyStart: GROQ_API_KEY.substring(0, 10) + '...',
      messageCount: messages.length
    });

    // Groq API çağrısı
    const response = await axios.post(GROQ_API_URL, {
      model: 'llama-3.1-8b-instant',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'ChatbotApp/1.0'
      },
      timeout: 30000,
      validateStatus: function (status) {
        return status < 500; // 500'den küçük tüm status kodlarını başarılı say
      }
    });

    console.log('Groq API yanıtı:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });

    // Yanıt kontrolü
    if (response.status === 401) {
      console.error('401 Unauthorized - API key geçersiz:', GROQ_API_KEY.substring(0, 10) + '...');
      return res.status(401).json({
        error: 'Groq API anahtarı geçersiz. Lütfen yeni bir API key alın.',
        code: 'INVALID_API_KEY',
        details: 'API key format: gsk_...'
      });
    }

    if (response.status === 429) {
      return res.status(429).json({
        error: 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.',
        code: 'RATE_LIMIT'
      });
    }

    if (response.status >= 400) {
      console.error('Groq API hatası:', response.status, response.data);
      return res.status(response.status).json({
        error: `API hatası: ${response.data.error?.message || 'Bilinmeyen hata'}`,
        code: 'API_ERROR'
      });
    }

    // Yanıtı al
    const aiResponse = response.data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error('Groq\'tan geçersiz yanıt:', response.data);
      throw new Error('Groq\'tan geçerli bir yanıt alınamadı');
    }

    // Başarılı yanıt
    res.json({
      success: true,
      response: aiResponse.trim(),
      timestamp: new Date().toISOString(),
      usage: response.data.usage || {
        model: "llama-3.1-8b-instant",
        prompt_tokens: message.length,
        completion_tokens: aiResponse.length,
        total_tokens: message.length + aiResponse.length
      }
    });

  } catch (error) {
    console.error('Chat API Hatası:', error);

    // Hata türüne göre yanıt ver
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.status(408).json({
        error: 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.',
        code: 'TIMEOUT'
      });
    }

    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Groq API anahtarı geçersiz veya süresi dolmuş.',
        code: 'INVALID_API_KEY'
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        error: 'API kullanım limitiniz dolmuş. Lütfen daha sonra tekrar deneyin.',
        code: 'QUOTA_EXCEEDED'
      });
    }

    // Genel hata
    res.status(500).json({
      error: 'Chatbot\'ta bir hata oluştu. Lütfen tekrar deneyin.',
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint bulunamadı.',
    code: 'NOT_FOUND'
  });
});

// Global hata yakalayıcı
app.use((error, req, res, next) => {
  console.error('Beklenmeyen hata:', error);
  res.status(500).json({
    error: 'Sunucu hatası oluştu.',
    code: 'SERVER_ERROR'
  });
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`🚀 Chatbot API ${PORT} portunda çalışıyor`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
});
