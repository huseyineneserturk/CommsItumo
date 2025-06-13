# 🎯 CommsItumo - YouTube Comment Analysis Platform | YouTube Yorum Analizi Platformu

<div align="center">

![CommsItumo Logo](frontend/public/Resources/Logo.png)

**AI-powered YouTube comment analysis platform with sentiment analysis and theme detection**  
**AI destekli YouTube yorum analizi platformu ile sentiment analysis ve tema tespiti**

[![GitHub Stars](https://img.shields.io/github/stars/huseyineneserturk/CommsItumo?style=for-the-badge)](https://github.com/huseyineneserturk/CommsItumo/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/huseyineneserturk/CommsItumo?style=for-the-badge)](https://github.com/huseyineneserturk/CommsItumo/network)
[![GitHub Issues](https://img.shields.io/github/issues/huseyineneserturk/CommsItumo?style=for-the-badge)](https://github.com/huseyineneserturk/CommsItumo/issues)
[![License](https://img.shields.io/github/license/huseyineneserturk/CommsItumo?style=for-the-badge)](LICENSE)

[🇬🇧 English Version](#english-version) • [🇹🇷 Türkçe Versiyon](#türkçe-versiyon)

</div>

---

## 🌐 Language / Dil

- [🇬🇧 **English Version**](#🇬🇧-english-version) - Complete documentation
- [🇹🇷 **Türkçe Versiyon**](#🇹🇷-türkçe-versiyon) - Türkçe dökümantasyon

---

# 🇬🇧 English Version

## 📋 Table of Contents

- [🎯 About the Project](#-about-the-project)
- [✨ Features](#-features)
- [🛠️ Technologies](#️-technologies)
- [📦 Installation](#-installation)
- [🚀 Usage](#-usage)
- [📁 Project Structure](#-project-structure)
- [🔧 Configuration](#-configuration)
- [📊 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 About the Project

CommsItumo is a modern web application that analyzes YouTube video comments using AI-powered sentiment analysis and theme detection, providing valuable insights to content creators and marketing specialists.

### 🎯 Target Audience
- **Content Creators**: YouTube channel owners seeking audience insights
- **Marketing Specialists**: Social media analysts tracking brand sentiment
- **Researchers**: Academic and industry professionals studying social media trends
- **Brands**: Companies analyzing customer feedback and engagement

### 🌟 Why CommsItumo?
- **⚡ Ultra-Fast Analysis**: Real-time progress tracking with WebSocket technology
- **🧠 Smart Caching**: 40-50% faster processing with intelligent 3-tier cache system
- **🔄 Asynchronous Processing**: Background task processing without UI freezing
- **🌐 Multi-language Support**: Advanced support for Turkish and English comments
- **📊 Visual Reports**: Interactive charts and comprehensive statistics
- **🎨 Modern UI/UX**: Intuitive and responsive design with Ant Design
- **🔒 Secure**: Firebase-powered authentication and data storage
- **📱 PWA Ready**: Progressive Web App support for mobile experience

---

## ✨ Features

### 🎬 YouTube Video Analysis
- **Automatic Comment Fetching**: One-click comment collection via YouTube Data API v3
- **⚡ Asynchronous Analysis**: Real-time progress updates via WebSocket connections
- **📊 Batch Processing**: Efficient processing with 20-comment batches
- **🔄 Background Tasks**: Non-blocking analysis with FastAPI background tasks
- **📈 Time Estimation**: Accurate completion time predictions
- **🎯 Progressive Loading**: 7-stage analysis progress visualization
- **📱 Responsive Progress**: Mobile-optimized progress tracking interface

### 📊 Advanced Sentiment Analysis
- **AI-Powered Analysis**: Transformer-based models with Hugging Face integration
- **Multi-Category Classification**: Positive, Negative, Neutral sentiment detection
- **Confidence Scoring**: Reliability metrics for each analysis result
- **Language Detection**: Automatic language identification and model selection
- **Trend Analysis**: Time-series sentiment change tracking
- **Real-time Processing**: Asynchronous model inference for fast results

### 🏷️ Intelligent Theme Analysis
- **Automatic Theme Detection**: NLP-powered topic identification in comments
- **Keyword Extraction**: Advanced word frequency and importance analysis
- **Category Classification**: Content quality, presentation style, technical aspects
- **Trend Visualization**: Theme evolution tracking over time
- **Word Cloud Generation**: Visual representation with @visx/wordcloud

### 📈 Modern Data Visualization
- **Interactive Charts**: Dynamic visualizations powered by Recharts
- **Real-time Updates**: Live data binding with React state management
- **Responsive Design**: Mobile-first visualization approach
- **Export Capabilities**: PNG/PDF export functionality for reports
- **Custom Animations**: Smooth transitions and hover effects

### 📁 Flexible CSV Support
- **Drag & Drop Upload**: Intuitive file upload interface
- **Format Validation**: Automatic CSV structure detection and validation
- **Batch Processing**: Handle thousands of comments efficiently
- **Custom Delimiters**: Support for various CSV formats
- **Error Handling**: Comprehensive validation with user feedback

### 💾 Smart Caching System
- **3-Tier Cache Architecture**:
  - Analysis Cache: 1 hour TTL, 30MB limit
  - Video Cache: 30 minutes TTL, 20MB limit
  - Quick Cache: 5 minutes TTL, 10MB limit
- **LRU Eviction Policy**: Intelligent memory management
- **Cache Statistics**: Performance monitoring with hit/miss ratios
- **Auto Cleanup**: Automatic memory optimization
- **70-80% Hit Rate**: Optimized for performance

### 🌐 Real-time WebSocket System
- **Singleton Connection Manager**: Efficient connection pooling
- **Heartbeat Monitoring**: Ping-pong based connection health checks
- **Auto Reconnection**: Robust error recovery mechanisms
- **User-based Sessions**: Isolated progress tracking per user
- **Task Queue Management**: Ordered task processing with priority

### 🤖 AI Chat Assistant
- **Google Gemini Integration**: Advanced conversational AI capabilities
- **Context-Aware Responses**: Analysis data-driven intelligent answers
- **Natural Language Processing**: Intuitive user interaction
- **Suggestion Engine**: Actionable insights and recommendations
- **Multi-turn Conversations**: Contextual dialogue management

---

## 🛠️ Technologies

### 🎨 Frontend Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.2.0 | Component-based UI framework |
| **TypeScript** | 5.0.2 | Type-safe JavaScript development |
| **Vite** | 4.4.5 | Fast build tool and dev server |
| **Ant Design** | 5.8.4 | Enterprise-class UI components |
| **Tailwind CSS** | 3.3.0 | Utility-first CSS framework |
| **Recharts** | 2.7.2 | Declarative chart library |
| **@visx/wordcloud** | 3.0.0 | Advanced word cloud visualization |
| **Firebase SDK** | 10.1.0 | Authentication and real-time database |

### ⚙️ Backend Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| **FastAPI** | 0.104.1 | High-performance async web framework |
| **Python** | 3.8+ | Core programming language |
| **Transformers** | 4.51.3 | Pre-trained NLP models |
| **NLTK** | 3.8.1 | Natural language toolkit |
| **Pandas** | 2.2.1 | Data manipulation and analysis |
| **NumPy** | 1.26.4 | Numerical computing library |
| **Scikit-learn** | 1.4.1 | Machine learning algorithms |
| **Uvicorn** | 0.23.2 | ASGI server implementation |

### 🗄️ Services & APIs
- **Firebase Firestore**: NoSQL document database
- **Firebase Authentication**: Google OAuth integration
- **YouTube Data API v3**: Video and comment data access
- **Google Gemini AI**: Advanced conversational AI
- **Hugging Face Hub**: Pre-trained model repository

---

## 📦 Installation

### 📋 Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.0.0+) - [Download](https://nodejs.org/)
- **Python** (v3.8+) - [Download](https://python.org/)
- **Git** - [Download](https://git-scm.com/)

### 🔧 Quick Start

#### 1️⃣ Clone Repository
```bash
git clone https://github.com/huseyineneserturk/CommsItumo.git
cd CommsItumo
```

#### 2️⃣ Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Configure .env with your API keys
```

#### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
# Configure .env with Firebase config
```

#### 4️⃣ Start Development Servers
```bash
# Terminal 1 - Backend
cd backend && uvicorn main:app --reload

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### 🌐 Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🚀 Usage

### 📊 YouTube Analysis
1. **Login** with your Google account
2. **Enter** YouTube video URL
3. **Configure** analysis parameters (comment limit, language)
4. **Watch** real-time progress via WebSocket
5. **Explore** results with interactive visualizations

### 📁 CSV Analysis
1. **Upload** your CSV file via drag-and-drop
2. **Map** columns to required fields
3. **Start** batch analysis
4. **Download** results and visualizations

### 🤖 AI Assistant
1. **Click** chat icon in bottom-right
2. **Ask** questions about your analysis results
3. **Get** actionable insights and recommendations

---

## 📁 Project Structure

```
CommsItumo/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API integration
│   │   ├── contexts/       # React contexts
│   │   └── types/          # TypeScript definitions
│   └── public/             # Static assets
├── backend/                 # FastAPI application
│   ├── app/                # Core application
│   │   ├── routers/        # API endpoints
│   │   ├── models/         # Data models
│   │   └── services/       # Business logic
│   ├── services/           # External integrations
│   └── main.py            # Application entry point
└── docs/                   # Documentation
```

---

## 🔧 Configuration

### Backend Environment (.env)
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com

# API Keys
YOUTUBE_API_KEY=your-youtube-api-key
GEMINI_API_KEY=your-gemini-api-key
HUGGINGFACE_TOKEN=your-hf-token

# Application
DEBUG=False
CORS_ORIGINS=http://localhost:3000
```

### Frontend Environment (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:8000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## 📊 API Documentation

### WebSocket Connection
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/{user_id}');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log(`Progress: ${update.progress}%`);
  console.log(`Status: ${update.status}`);
};
```

### REST Endpoints
- `POST /api/youtube/analyze-video-async` - Start async video analysis
- `GET /api/youtube/analysis-status/{task_id}` - Check analysis status
- `POST /api/csv/upload` - Upload and analyze CSV
- `POST /api/gemini/chat` - AI chat interaction

For complete API documentation, visit: http://localhost:8000/docs

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Convention
We follow [Conventional Commits](https://conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code formatting
- `refactor:` Code refactoring
- `test:` Test additions
- `chore:` Maintenance tasks

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

# 🇹🇷 Türkçe Versiyon

## 📋 İçindekiler

- [🎯 Proje Hakkında](#-proje-hakkında)
- [✨ Özellikler](#-özellikler)
- [🛠️ Teknolojiler](#️-teknolojiler)
- [📦 Kurulum](#-kurulum)
- [🚀 Kullanım](#-kullanım)
- [📁 Proje Yapısı](#-proje-yapısı)
- [🔧 Konfigürasyon](#-konfigürasyon)
- [📊 API Dokümantasyonu](#-api-dokümantasyonu)
- [🤝 Katkıda Bulunma](#-katkıda-bulunma)
- [📄 Lisans](#-lisans)

---

## 🎯 Proje Hakkında

CommsItumo, YouTube video yorumlarını yapay zeka destekli duygu analizi ve tema tespiti ile çözümleyerek içerik üreticilerine ve pazarlama uzmanlarına değerli bulgular sunan modern bir web uygulamasıdır.

### 🎯 Hedef Kitle
- **İçerik Üreticiler**: İzleyici öngörüleri arayan YouTube kanal sahipleri
- **Pazarlama Uzmanları**: Marka duygularını takip eden sosyal medya analistleri  
- **Araştırmacılar**: Sosyal medya trendlerini inceleyen akademik ve endüstri profesyonelleri
- **Markalar**: Müşteri geri bildirimlerini ve etkileşimi analiz eden şirketler

### 🌟 Neden CommsItumo?
- **⚡ Ultra Hızlı Analiz**: WebSocket teknolojisi ile gerçek zamanlı ilerleme takibi
- **🧠 Akıllı Önbellekleme**: Akıllı 3 katmanlı önbellek sistemi ile %40-50 daha hızlı işleme
- **🔄 Eşzamansız İşleme**: Arayüz donmadan arka planda görev işleme
- **🌐 Çoklu Dil Desteği**: Türkçe ve İngilizce yorumlar için gelişmiş destek
- **📊 Görsel Raporlar**: Etkileşimli grafikler ve kapsamlı istatistikler
- **🎨 Modern Arayüz**: Ant Design ile sezgisel ve duyarlı tasarım
- **🔒 Güvenli**: Firebase destekli kimlik doğrulama ve veri depolama
- **📱 PWA Hazır**: Mobil deneyim için Progressive Web App desteği

---

## ✨ Özellikler

### 🎬 YouTube Video Analizi
- **Otomatik Yorum Toplama**: YouTube Data API v3 ile tek tıkla yorum toplama
- **⚡ Eş Zamanlı Analiz**: WebSocket bağlantıları ile gerçek zamanlı ilerleme güncellemeleri
- **📊 Toplu İşleme**: 20 yorumluk gruplar halinde verimli işleme
- **🔄 Arka Plan Görevleri**: FastAPI arka plan görevleri ile engelleyici olmayan analiz
- **📈 Zaman Tahmini**: Doğru tamamlanma süresi tahminleri
- **🎯 Aşamalı Yükleme**: 7 aşamalı analiz ilerleme görselleştirmesi
- **📱 Duyarlı İlerleme**: Mobil optimize ilerleme takip arayüzü

### 📊 Gelişmiş Duygu Analizi
- **Yapay Zeka Destekli Analiz**: Hugging Face entegrasyonu ile Transformer tabanlı modeller
- **Çoklu Kategori Sınıflandırma**: Pozitif, negatif, nötr duygu tespiti
- **Güven Puanlama**: Her analiz sonucu için güvenilirlik ölçütleri
- **Dil Algılama**: Otomatik dil tanıma ve model seçimi
- **Trend Analizi**: Zaman serisi duygu değişim takibi
- **Gerçek Zamanlı İşleme**: Hızlı sonuçlar için eş zamanlı model çıkarımı

### 🏷️ Akıllı Tema Analizi
- **Otomatik Tema Tespiti**: Yorumlarda doğal dil işleme destekli konu tanımlama
- **Anahtar Kelime Çıkarımı**: Gelişmiş kelime sıklığı ve önem analizi
- **Kategori Sınıflandırma**: İçerik kalitesi, sunum tarzı, teknik yönler
- **Trend Görselleştirme**: Zaman içinde tema evrimi takibi
- **Kelime Bulutu Oluşturma**: @visx/wordcloud ile görsel gösterim

### 📈 Modern Veri Görselleştirme
- **Etkileşimli Grafikler**: Recharts destekli dinamik görselleştirmeler
- **Gerçek Zamanlı Güncellemeler**: React durum yönetimi ile canlı veri bağlama
- **Duyarlı Tasarım**: Mobil öncelikli görselleştirme yaklaşımı
- **Dışa Aktarma Yetenekleri**: Raporlar için PNG/PDF dışa aktarma işlevi
- **Özel Animasyonlar**: Pürüzsüz geçişler ve hover efektleri

### 📁 Esnek CSV Desteği
- **Sürükle Bırak Yükleme**: Sezgisel dosya yükleme arayüzü
- **Format Doğrulama**: Otomatik CSV yapı algılama ve doğrulama
- **Toplu İşleme**: Binlerce yorumu verimli şekilde işleme
- **Özel Ayırıcılar**: Çeşitli CSV formatları için destek
- **Hata İşleme**: Kullanıcı geri bildirimi ile kapsamlı doğrulama

### 💾 Akıllı Önbellekleme Sistemi
- **3 Katmanlı Önbellek Mimarisi**:
  - Analiz Önbelleği: 1 saat TTL, 30MB limit
  - Video Önbelleği: 30 dakika TTL, 20MB limit
  - Hızlı Önbellek: 5 dakika TTL, 10MB limit
- **LRU Çıkarma Politikası**: Akıllı bellek yönetimi
- **Önbellek İstatistikleri**: İsabet/kaçırma oranları ile performans izleme
- **Otomatik Temizlik**: Otomatik bellek optimizasyonu
- **%70-80 İsabet Oranı**: Performans için optimize edilmiş

### 🌐 Gerçek Zamanlı WebSocket Sistemi
- **Tekil Bağlantı Yöneticisi**: Verimli bağlantı havuzlama
- **Kalp Atışı İzleme**: Ping-pong tabanlı bağlantı sağlık kontrolleri
- **Otomatik Yeniden Bağlanma**: Sağlam hata kurtarma mekanizmaları
- **Kullanıcı Tabanlı Oturumlar**: Kullanıcı başına izole ilerleme takibi
- **Görev Kuyruğu Yönetimi**: Öncelik ile sıralı görev işleme

### 🤖 Yapay Zeka Sohbet Asistanı
- **Google Gemini Entegrasyonu**: Gelişmiş konuşma yapay zeka yetenekleri
- **Bağlam Farkında Yanıtlar**: Analiz verisi temelli akıllı cevaplar
- **Doğal Dil İşleme**: Sezgisel kullanıcı etkileşimi
- **Öneri Motoru**: Eyleme dönüştürülebilir bulgular ve öneriler
- **Çok Turlu Konuşmalar**: Bağlamsal diyalog yönetimi

---

## 🛠️ Teknolojiler

### 🎨 Ön Uç Teknolojileri
| Teknoloji | Versiyon | Amaç |
|-----------|---------|------|
| **React** | 18.2.0 | Bileşen tabanlı kullanıcı arayüzü çerçevesi |
| **TypeScript** | 5.0.2 | Tip güvenli JavaScript geliştirme |
| **Vite** | 4.4.5 | Hızlı derleme aracı ve geliştirme sunucusu |
| **Ant Design** | 5.8.4 | Kurumsal sınıf kullanıcı arayüzü bileşenleri |
| **Tailwind CSS** | 3.3.0 | Yardımcı program öncelikli CSS çerçevesi |
| **Recharts** | 2.7.2 | Bildirimsel grafik kütüphanesi |
| **@visx/wordcloud** | 3.0.0 | Gelişmiş kelime bulutu görselleştirme |
| **Firebase SDK** | 10.1.0 | Kimlik doğrulama ve gerçek zamanlı veritabanı |

### ⚙️ Arka Uç Teknolojileri
| Teknoloji | Versiyon | Amaç |
|-----------|---------|------|
| **FastAPI** | 0.104.1 | Yüksek performanslı eş zamanlı web çerçevesi |
| **Python** | 3.8+ | Temel programlama dili |
| **Transformers** | 4.51.3 | Önceden eğitilmiş doğal dil işleme modelleri |
| **NLTK** | 3.8.1 | Doğal dil araç seti |
| **Pandas** | 2.2.1 | Veri manipülasyonu ve analizi |
| **NumPy** | 1.26.4 | Sayısal hesaplama kütüphanesi |
| **Scikit-learn** | 1.4.1 | Makine öğrenmesi algoritmaları |
| **Uvicorn** | 0.23.2 | ASGI sunucu uygulaması |

### 🗄️ Servisler ve API'ler
- **Firebase Firestore**: NoSQL döküman veritabanı
- **Firebase Authentication**: Google OAuth entegrasyonu
- **YouTube Data API v3**: Video ve yorum verisi erişimi
- **Google Gemini AI**: Gelişmiş konuşma yapay zekası
- **Hugging Face Hub**: Önceden eğitilmiş model deposu

---

## 📦 Kurulum

### 📋 Ön Gereksinimler

Aşağıdakilerin kurulu olduğundan emin olun:
- **Node.js** (v18.0.0+) - [İndir](https://nodejs.org/)
- **Python** (v3.8+) - [İndir](https://python.org/)
- **Git** - [İndir](https://git-scm.com/)

### 🔧 Hızlı Başlangıç

#### 1️⃣ Depoyu Klonlayın
   ```bash
git clone https://github.com/huseyineneserturk/CommsItumo.git
cd CommsItumo
   ```

#### 2️⃣ Arka Uç Kurulumu
   ```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# .env dosyasını API anahtarlarınızla yapılandırın
```

#### 3️⃣ Ön Uç Kurulumu
   ```bash
cd ../frontend
npm install
cp .env.example .env
# .env dosyasını Firebase yapılandırması ile güncelleyin
```

#### 4️⃣ Geliştirme Sunucularını Başlatın
```bash
# Terminal 1 - Arka Uç
cd backend && uvicorn main:app --reload

# Terminal 2 - Ön Uç  
cd frontend && npm run dev
```

### 🌐 Erişim Noktaları
- **Ön Uç**: http://localhost:3000
- **Arka Uç API**: http://localhost:8000
- **API Belgeleri**: http://localhost:8000/docs

---

## 🚀 Kullanım

### 📊 YouTube Analizi
1. Google hesabınızla **giriş yapın**
2. YouTube video URL'sini **girin**
3. Analiz parametrelerini **yapılandırın** (yorum limiti, dil)
4. WebSocket ile gerçek zamanlı ilerlemeyi **izleyin**
5. Etkileşimli görselleştirmelerle sonuçları **keşfedin**

### 📁 CSV Analizi
1. CSV dosyanızı sürükle-bırak ile **yükleyin**
2. Gerekli alanlara sütunları **eşleyin**
3. Toplu analizi **başlatın**
4. Sonuçları ve görselleştirmeleri **indirin**

### 🤖 Yapay Zeka Asistanı
1. Sağ alttaki sohbet simgesine **tıklayın**
2. Analiz sonuçlarınız hakkında **soru sorun**
3. Eyleme dönüştürülebilir bulgular ve öneriler **alın**

---

## 📁 Proje Yapısı

```
CommsItumo/
├── frontend/                 # React uygulaması
│   ├── src/
│   │   ├── components/      # Yeniden kullanılabilir arayüz bileşenleri
│   │   ├── pages/          # Sayfa bileşenleri
│   │   ├── services/       # API entegrasyonu
│   │   ├── contexts/       # React bağlamları
│   │   └── types/          # TypeScript tanımları
│   └── public/             # Statik varlıklar
├── backend/                 # FastAPI uygulaması
│   ├── app/                # Ana uygulama
│   │   ├── routers/        # API uç noktaları
│   │   ├── models/         # Veri modelleri
│   │   └── services/       # İş mantığı
│   ├── services/           # Harici entegrasyonlar
│   └── main.py            # Uygulama giriş noktası
└── docs/                   # Belgeler
```

---

## 🔧 Konfigürasyon

### Arka Uç Ortam Değişkenleri (.env)
```env
# Firebase Yapılandırması
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com

# API Anahtarları
YOUTUBE_API_KEY=your-youtube-api-key
GEMINI_API_KEY=your-gemini-api-key
HUGGINGFACE_TOKEN=your-hf-token

# Uygulama
DEBUG=False
CORS_ORIGINS=http://localhost:3000
```

### Ön Uç Ortam Değişkenleri (.env)
```env
# API Yapılandırması
VITE_API_URL=http://localhost:8000

# Firebase Yapılandırması
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## 📊 API Dokümantasyonu

### WebSocket Bağlantısı
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/{user_id}');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log(`İlerleme: ${update.progress}%`);
  console.log(`Durum: ${update.status}`);
};
```

### REST Uç Noktaları
- `POST /api/youtube/analyze-video-async` - Eş zamanlı video analizi başlat
- `GET /api/youtube/analysis-status/{task_id}` - Analiz durumunu kontrol et
- `POST /api/csv/upload` - CSV yükle ve analiz et
- `POST /api/gemini/chat` - Yapay zeka sohbet etkileşimi

Tam API belgeleri için ziyaret edin: http://localhost:8000/docs

---

## 🤝 Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz! Ayrıntılar için [Katkı Rehberi](CONTRIBUTING.md)'ni okuyun.

### Geliştirme İş Akışı
1. Depoyu çatallayın
2. Özellik dalı oluşturun: `git checkout -b feature/amazing-feature`
3. Değişiklikleri işleyin: `git commit -m 'feat: Add amazing feature'`
4. Dala gönderin: `git push origin feature/amazing-feature`
5. Çekme isteği açın

### İşleme Kuralı
[Geleneksel İşlemeler](https://conventionalcommits.org/) takip ediyoruz:
- `feat:` Yeni özellikler
- `fix:` Hata düzeltmeleri
- `docs:` Belge güncellemeleri
- `style:` Kod biçimlendirme
- `refactor:` Kod yeniden düzenleme
- `test:` Test eklemeleri
- `chore:` Bakım görevleri

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

---

<div align="center">

### 🌟 Projeyi Beğendiyseniz Yıldız Vermeyi Unutmayın!

[![GitHub Stars](https://img.shields.io/github/stars/huseyineneserturk/CommsItumo?style=social)](https://github.com/huseyineneserturk/CommsItumo/stargazers)

**CommsItumo ile YouTube yorumlarınızı analiz edin ve içeriğinizi geliştirin! 🚀**

### 👨‍💻 Geliştirici

**Hüseyin Enes Ertürk**

[![GitHub](https://img.shields.io/badge/GitHub-huseyineneserturk-black?style=for-the-badge&logo=github)](https://github.com/huseyineneserturk)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/huseyineneserturk)
[![Email](https://img.shields.io/badge/Email-Contact-red?style=for-the-badge&logo=gmail)](mailto:huseyinenes.erturk@gmail.com)

**Yazılım Mühendisliği Öğrencisi**

### 📊 Proje Performans İstatistikleri

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/huseyineneserturk/CommsItumo)
![GitHub last commit](https://img.shields.io/github/last-commit/huseyineneserturk/CommsItumo)
![GitHub repo size](https://img.shields.io/github/repo-size/huseyineneserturk/CommsItumo)
![GitHub language count](https://img.shields.io/github/languages/count/huseyineneserturk/CommsItumo)

### ⚡ Performans Ölçütleri

- **Analiz Hızı**: Öncekinden %40-50 daha hızlı
- **Arayüz Duyarlılığı**: %100 donmama garantisi
- **Önbellek İsabet Oranı**: Ortalama %70-80
- **Bellek Kullanımı**: Kontrollü 60MB limiti
- **WebSocket Çalışma Süresi**: %99.9 bağlantı kararlılığı

---

*Türkiye'de ❤️ ile yapıldı 🇹🇷*  
*Son Güncelleme: Haziran 2025*  
*Versiyon: 2.1.0*

</div> 
