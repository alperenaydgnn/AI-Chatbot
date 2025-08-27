# 🤖 AI Destekli Chatbot

Modern ve kullanıcı dostu bir AI chatbot uygulaması. React frontend ve Node.js backend ile geliştirilmiştir.

## ✨ Özellikler

- 💬 **Gerçek zamanlı sohbet**: DeepSeek Chat modeli ile güçlendirilmiş
- 📱 **Responsive tasarım**: Mobil ve masaüstü uyumlu
- 💾 **Sohbet geçmişi**: LocalStorage ile otomatik kaydetme
- 🎨 **Modern UI**: TailwindCSS ile şık tasarım
- ⚡ **Hızlı yanıt**: Optimize edilmiş API entegrasyonu
- 🔄 **Loading animasyonları**: Kullanıcı deneyimi odaklı
- ⌨️ **Klavye kısayolları**: Enter ile gönder, Shift+Enter ile yeni satır
- 🧹 **Sohbet temizleme**: Tek tıkla geçmişi temizle

## 🚀 Kurulum

### Gereksinimler

- Node.js (v18+ önerilen)
- npm veya yarn
- DeepSeek API anahtarı (ücretsiz)

### 1. Projeyi İndirin

```bash
git clone <repository-url>
cd chatbot
```

### 2. Bağımlılıkları Yükleyin

```bash
# Tüm bağımlılıkları tek seferde yükle
npm run install:all

# Veya manuel olarak
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3. Environment Ayarları

Backend klasöründe `.env` dosyası oluşturun:

```bash
cd backend
cp ../env.example .env
```

`.env` dosyasını düzenleyin ve DeepSeek API anahtarınızı ekleyin:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
PORT=5000
NODE_ENV=development
```

> **DeepSeek API Anahtarı**: [platform.deepseek.com](https://platform.deepseek.com) adresinden ücretsiz olarak alabilirsiniz.

### 4. Uygulamayı Başlatın

#### Development (Geliştirme)

Hem frontend hem backend'i aynı anda başlatır:

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

#### Production (Prodüksiyon)

```bash
# Frontend'i build et
npm run build

# Backend'i başlat
npm start
```

## 📁 Proje Yapısı

```
chatbot/
├── backend/                 # Node.js + Express API
│   ├── server.js           # Ana server dosyası
│   ├── package.json        # Backend bağımlılıkları
│   └── .env               # Environment değişkenleri
├── frontend/               # React uygulaması
│   ├── src/
│   │   ├── components/     # React bileşenleri
│   │   │   ├── Header.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── LoadingMessage.jsx
│   │   ├── App.jsx        # Ana uygulama
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Global stiller
│   ├── index.html         # HTML template
│   ├── package.json       # Frontend bağımlılıkları
│   ├── vite.config.js     # Vite konfigürasyonu
│   └── tailwind.config.js # TailwindCSS ayarları
├── package.json            # Root package.json
├── env.example            # Environment örneği
└── README.md              # Bu dosya
```

## 🔧 API Endpoints

### POST `/api/chat`

Kullanıcı mesajını AI'ya gönderir ve yanıt alır.

**Request:**
```json
{
  "message": "Merhaba, nasılsın?",
  "history": []
}
```

**Response:**
```json
{
  "success": true,
  "response": "Merhaba! Ben iyiyim, teşekkür ederim. Size nasıl yardımcı olabilirim?",
  "timestamp": "2023-12-07T10:30:00.000Z"
}
```

### GET `/health`

API sağlık kontrolü.

**Response:**
```json
{
  "status": "OK",
  "message": "Chatbot API çalışıyor",
  "timestamp": "2023-12-07T10:30:00.000Z"
}
```

## 🌐 Deploy

### Vercel (Önerilen)

1. Vercel hesabınıza giriş yapın
2. Projeyi import edin
3. Environment variables ekleyin:
   - `DEEPSEEK_API_KEY`: DeepSeek API anahtarınız
4. Deploy edin

Frontend otomatik olarak build edilir ve statik dosyalar serve edilir.
Backend serverless function olarak çalışır.

### Render

1. Render hesabınıza giriş yapın
2. Backend için yeni Web Service oluşturun:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
3. Frontend için yeni Static Site oluşturun:
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
4. Environment variables:
   - `DEEPSEEK_API_KEY`: DeepSeek API anahtarınızı ekleyin

## 🛠️ Geliştirme

### Kod Yapısı

- **Backend**: Express.js ile RESTful API
- **Frontend**: React + Vite + TailwindCSS
- **State Management**: React useState/useEffect
- **Styling**: TailwindCSS utility classes
- **HTTP Client**: Axios

### Önemli Dosyalar

- `backend/server.js`: Ana API server
- `frontend/src/App.jsx`: Ana React bileşeni
- `frontend/src/components/`: UI bileşenleri
- `frontend/tailwind.config.js`: TailwindCSS konfigürasyonu

### Geliştirme İpuçları

1. **Hot Reload**: Development modunda hem frontend hem backend otomatik yenilenir
2. **Error Handling**: Hem client hem server tarafında kapsamlı hata yönetimi
3. **LocalStorage**: Sohbet geçmişi otomatik olarak kaydedilir
4. **Responsive**: Mobil-first tasarım yaklaşımı
5. **Free API**: DeepSeek ücretsiz API limiti oldukça cömert (günlük kullanım için yeterli)

## 🐛 Sorun Giderme

### Yaygın Sorunlar

1. **API Key Hatası**
   ```
   Error: DeepSeek API anahtarı yapılandırılmamış
   ```
   Çözüm: `.env` dosyasında `DEEPSEEK_API_KEY` değişkenini kontrol edin.

2. **Port Çakışması**
   ```
   Error: Port 5000 already in use
   ```
   Çözüm: `.env` dosyasında farklı bir port belirleyin.

3. **CORS Hatası**
   ```
   Error: CORS policy error
   ```
   Çözüm: Backend CORS ayarlarını kontrol edin.

### Log Kontrolü

Backend logları için:
```bash
cd backend
npm run dev
```

## 📝 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 Destek

Herhangi bir sorunuz veya öneriniz için issue oluşturabilirsiniz.

---

⭐ Bu projeyi beğendiyseniz star vermeyi unutmayın!
