# 🎯 CommsItumo - YouTube Comment Analysis Platform | YouTube Yorum Analizi Platformu

<div align="center">

![CommsItumo Logo](frontend/public/Resources/Logo.png)

**AI-powered YouTube comment analysis platform with sentiment analysis.**  
**AI destekli YouTube yorum analizi platformu ile duygu analizi.**

[![GitHub Stars](https://img.shields.io/github/stars/huseyineneserturk/CommsItumo?style=for-the-badge)](https://github.com/huseyineneserturk/CommsItumo/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/huseyineneserturk/CommsItumo?style=for-the-badge)](https://github.com/huseyineneserturk/CommsItumo/network)
[![GitHub Issues](https://img.shields.io/github/issues/huseyineneserturk/CommsItumo?style=for-the-badge)](https://github.com/huseyineneserturk/CommsItumo/issues)
[![License](https://img.shields.io/github/license/huseyineneserturk/CommsItumo?style=for-the-badge)](LICENSE)

[🇬🇧 English Version](#english-version) • [🇹🇷 Türkçe Versiyon](#türkçe-versiyon)

</div>

---

## 🌐 Language / Dil

- [🇬🇧 **English Version**](#-english-version) - Complete documentation
- [🇹🇷 **Türkçe Versiyon**](#-türkçe-versiyon) - Türkçe dökümantasyon

---

# 🇬🇧 English Version

## 📋 Table of Contents

- [🎯 About the Project](#-about-the-project)
- [✨ Features](#-features)
- [🎨 Modern UI Design](#-modern-ui-design)
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

CommsItumo is a cutting-edge web application that analyzes YouTube video comments using AI-powered sentiment analysis and theme detection, featuring a modern glassmorphism design system that provides an exceptional user experience for content creators and marketing specialists.

### 🎯 Target Audience
- **Content Creators**: YouTube channel owners seeking deep audience insights
- **Marketing Specialists**: Social media analysts tracking brand sentiment across platforms
- **Researchers**: Academic and industry professionals studying social media trends and engagement
- **Brands & Agencies**: Companies analyzing customer feedback and improving engagement strategies

### 🌟 Why CommsItumo?
- **⚡ Lightning-Fast Analysis**: Real-time progress tracking with WebSocket technology
- **🧠 Intelligent Caching**: 40-50% faster processing with smart 3-tier cache system
- **🔄 Asynchronous Processing**: Non-blocking background analysis with real-time updates
- **🌐 Multi-language Support**: Advanced Turkish and English comment analysis
- **📊 Interactive Visualizations**: Dynamic charts with modern design aesthetics
- **🎨 Modern Glassmorphism UI**: Cutting-edge design with backdrop blur effects
- **🔒 Enterprise Security**: Firebase-powered authentication and secure data storage
- **📱 Responsive PWA**: Mobile-first progressive web application

---

## ✨ Features

### 🎬 Advanced YouTube Analysis
- **One-Click Comment Extraction**: Seamless integration with YouTube Data API v3
- **⚡ Real-time Processing**: Live progress updates via WebSocket connections
- **📊 Intelligent Batching**: Optimized processing with smart comment grouping
- **🔄 Background Tasks**: Non-blocking analysis with FastAPI async capabilities
- **📈 Predictive Analytics**: Machine learning-powered completion time estimation
- **🎯 Progressive Loading**: Multi-stage analysis with visual progress indicators
- **📱 Mobile-Optimized**: Responsive interface for all device sizes

### 🧠 AI-Powered Sentiment Analysis
- **Transformer Models**: State-of-the-art NLP with Hugging Face integration
- **Multi-Dimensional Classification**: Positive, Negative, Neutral sentiment detection
- **Confidence Metrics**: Reliability scoring for each analysis result
- **Auto Language Detection**: Smart model selection based on content language
- **Temporal Analysis**: Sentiment trend tracking over time periods
- **Real-time Inference**: Asynchronous model processing for optimal performance

### 🏷️ Smart Theme Detection
- **NLP-Powered Topics**: Automatic theme identification in comment sections
- **Advanced Keyword Extraction**: Intelligent word frequency and relevance analysis
- **Content Categorization**: Quality, style, and technical aspect classification
- **Trend Visualization**: Theme evolution tracking with interactive charts
- **Word Cloud Generation**: Beautiful visualizations with @visx/wordcloud

### 📈 Modern Data Visualization
- **Interactive Charts**: Dynamic visualizations powered by Recharts library
- **Real-time Data Binding**: Live updates with React state management
- **Responsive Design**: Mobile-first visualization approach
- **Export Capabilities**: High-quality PNG/PDF report generation
- **Smooth Animations**: Fluid transitions and engaging hover effects

### 📁 Flexible File Processing
- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **Smart Validation**: Automatic CSV structure detection and error handling
- **Batch Processing**: Efficient handling of large comment datasets
- **Format Flexibility**: Support for various CSV delimiters and encodings
- **Error Recovery**: Comprehensive validation with user-friendly feedback

### 💾 Advanced Caching System
- **3-Tier Architecture**:
  - Analysis Cache: 1 hour TTL, 30MB capacity
  - Video Cache: 30 minutes TTL, 20MB capacity  
  - Quick Cache: 5 minutes TTL, 10MB capacity
- **LRU Eviction**: Intelligent memory management algorithms
- **Performance Monitoring**: Real-time cache hit/miss ratio tracking
- **Auto-Optimization**: Self-managing memory cleanup
- **High Efficiency**: 70-80% average hit rate

### 🌐 Real-time Communication
- **WebSocket Architecture**: Singleton connection manager for optimal performance
- **Health Monitoring**: Advanced ping-pong heartbeat system
- **Auto-Recovery**: Robust reconnection mechanisms with exponential backoff
- **User Sessions**: Isolated progress tracking per authenticated user
- **Priority Queuing**: Intelligent task ordering and resource allocation

### 🤖 AI Chat Assistant
- **Google Gemini Integration**: Cutting-edge conversational AI capabilities
- **Context-Aware Intelligence**: Analysis data-driven intelligent responses
- **Natural Conversations**: Intuitive multi-turn dialogue management
- **Actionable Insights**: Smart recommendations and strategy suggestions
- **Modern Chat UI**: Glassmorphism design with smooth animations

---

## 🎨 Modern UI Design

### ✨ Glassmorphism Design System
- **Backdrop Blur Effects**: Modern `backdrop-blur-xl` throughout the interface
- **Transparent Backgrounds**: `bg-white/10` with subtle transparency
- **Enhanced Shadows**: `shadow-2xl` with custom color glows
- **Gradient Accents**: Beautiful color gradients for visual hierarchy

### 🎨 Color-Coded Pages
- **Dashboard**: Elegant slate color scheme
- **My Comments**: Vibrant red theme with modern cards
- **YouTube Analysis**: Professional blue theme
- **Video Analysis**: Fresh green theme  
- **CSV Upload**: Energetic orange theme
- **Profile**: Sophisticated purple theme
- **Pricing**: Premium purple-pink gradients

### 🔄 Smooth Animations
- **Hover Effects**: `hover:-translate-y-2` lift animations
- **Transitions**: `transition-all duration-300` for smooth interactions
- **Scale Effects**: `hover:scale-105` for interactive elements
- **Glow Effects**: Custom shadow animations on hover

### 📱 Responsive Excellence
- **Mobile-First**: Optimized for all screen sizes
- **Flexible Grids**: Adaptive layouts with Tailwind CSS
- **Touch-Friendly**: Large interactive areas for mobile users
- **Performance**: Optimized rendering for smooth scrolling

---

## 🛠️ Technologies

### 🎨 Frontend Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.2.0 | Modern component-based UI framework |
| **TypeScript** | 5.0.2 | Type-safe development environment |
| **Vite** | 4.4.5 | Lightning-fast build tool and dev server |
| **Tailwind CSS** | 3.3.0 | Utility-first CSS framework |
| **Lucide React** | Latest | Modern icon library for React |
| **Recharts** | 2.7.2 | Powerful charting library |
| **@visx/wordcloud** | 3.0.0 | Advanced data visualization |
| **Firebase SDK** | 10.1.0 | Authentication and real-time database |
| **React Markdown** | Latest | Markdown rendering for AI chat |

### ⚙️ Backend Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| **FastAPI** | 0.104.1 | High-performance async web framework |
| **Python** | 3.8+ | Core programming language |
| **Transformers** | 4.51.3 | Pre-trained AI models |
| **NLTK** | 3.8.1 | Natural language processing toolkit |
| **Pandas** | 2.2.1 | Data manipulation and analysis |
| **NumPy** | 1.26.4 | Numerical computing library |
| **Scikit-learn** | 1.4.1 | Machine learning algorithms |
| **Uvicorn** | 0.23.2 | ASGI server implementation |
| **AsyncIO** | Built-in | Asynchronous programming support |

### 🗄️ Services & APIs
- **Firebase Firestore**: Scalable NoSQL document database
- **Firebase Authentication**: Secure Google OAuth integration
- **YouTube Data API v3**: Video and comment data access
- **Google Gemini AI**: Advanced conversational AI
- **Hugging Face Hub**: Pre-trained model repository
- **WebSocket**: Real-time bidirectional communication

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
# Configure your API keys in .env
```

#### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
# Configure Firebase settings in .env
```

#### 4️⃣ Start Development Servers
```bash
# Terminal 1 - Backend
cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### 🌐 Access Points
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

---

## 🚀 Usage

### 📊 YouTube Video Analysis
1. **Authenticate** with your Google account via Firebase
2. **Input** YouTube video URL in the analysis form
3. **Configure** analysis parameters (comment limit, language preferences)
4. **Monitor** real-time progress via WebSocket connection
5. **Explore** interactive results with modern visualizations

### 📁 CSV File Analysis
1. **Upload** CSV files using the drag-and-drop interface
2. **Map** your data columns to required analysis fields
3. **Execute** batch analysis with progress monitoring
4. **Export** comprehensive results and visualizations

### 🤖 AI Chat Assistant
1. **Click** the floating chat icon in the bottom-right corner
2. **Ask** questions about your analysis results and trends
3. **Receive** actionable insights and strategic recommendations

---

## 📁 Project Structure

```
CommsItumo/
├── 📁 frontend/                    # React TypeScript Application
│   ├── 📁 src/
│   │   ├── 📁 components/         # Reusable UI Components
│   │   │   ├── 📄 AIChatPopup.tsx        # Modern AI Chat Interface
│   │   │   ├── 📄 Layout/               # Layout Components
│   │   │   └── 📄 ui/                   # Base UI Components
│   │   ├── 📁 pages/              # Page Components
│   │   │   ├── 📄 Dashboard.tsx         # Main Dashboard
│   │   │   ├── 📄 MyComments.tsx        # User Comments Analysis
│   │   │   ├── 📄 YouTubeAnalysis.tsx   # YouTube Video Analysis
│   │   │   ├── 📄 VideoAnalysis.tsx     # Video-specific Analysis
│   │   │   ├── 📄 UploadCSV.tsx         # CSV Upload Interface
│   │   │   ├── 📄 Profile.tsx           # User Profile
│   │   │   └── 📄 Pricing.tsx           # Pricing Plans
│   │   ├── 📁 services/           # API Integration Layer
│   │   │   ├── 📄 analysisService.ts    # Analysis API calls
│   │   │   ├── 📄 youtubeService.ts     # YouTube API integration
│   │   │   ├── 📄 sentimentService.ts   # Sentiment analysis
│   │   │   └── 📄 intelligentCache.ts   # Caching system
│   │   ├── 📁 contexts/           # React Context Providers
│   │   │   ├── 📄 AIContext.tsx         # AI Chat Context
│   │   │   └── 📄 CacheContext.tsx      # Cache Management
│   │   ├── 📁 types/              # TypeScript Definitions
│   │   │   ├── 📄 analysis.ts           # Analysis type definitions
│   │   │   └── 📄 sentiment.ts          # Sentiment type definitions
│   │   ├── 📄 App.tsx             # Main Application Component
│   │   └── 📄 main.tsx            # Application Entry Point
│   ├── 📁 public/                 # Static Assets
│   │   └── 📁 Resources/          # Brand Assets
│   ├── 📄 package.json            # Dependencies & Scripts
│   ├── 📄 tailwind.config.js      # Tailwind CSS Configuration
│   ├── 📄 vite.config.ts          # Vite Build Configuration
│   └── 📄 README.md               # Frontend Documentation
├── 📁 backend/                     # FastAPI Python Application
│   ├── 📁 app/                    # Core Application
│   │   ├── 📁 api/endpoints/      # API Endpoint Definitions
│   │   ├── 📁 models/             # Pydantic Data Models
│   │   │   └── 📄 comment.py             # Comment data structures
│   │   ├── 📁 routers/            # API Route Handlers
│   │   │   ├── 📄 csv_router.py          # CSV processing routes
│   │   │   └── 📄 gemini.py              # Gemini AI routes
│   │   └── 📁 services/           # Business Logic Services
│   │       └── 📄 gemini.py              # Gemini AI service
│   ├── 📁 services/               # External Service Integrations
│   │   ├── 📄 csv_analyzer.py            # CSV analysis service
│   │   ├── 📄 firestore_service.py      # Firebase integration
│   │   ├── 📄 sentiment_service.py      # Sentiment analysis
│   │   └── 📄 youtube_service.py        # YouTube API service
│   ├── 📄 main.py                 # FastAPI Application Entry
│   ├── 📄 requirements.txt        # Python Dependencies
│   └── 📄 README.md               # Backend Documentation
├── 📁 models/                      # AI Model Files
│   ├── 📁 en-sentiment/           # English Sentiment Models
│   ├── 📁 tr-sentiment/           # Turkish Sentiment Models
│   └── 📁 theme-analysis/         # Theme Analysis Models
├── 📁 Resources/                   # Project Resources
│   ├── 📄 Brand.png               # Brand Assets
│   ├── 📄 Logo.png                # Logo Files
│   └── 📄 *.pdf                   # Documentation Files
├── 📄 firebase.json               # Firebase Configuration
├── 📄 firestore.rules             # Firestore Security Rules
├── 📄 start.bat                   # Windows Start Script
└── 📄 README.md                   # Main Project Documentation
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

# Application Settings
DEBUG=False
CORS_ORIGINS=http://localhost:3000,https://your-domain.com
MAX_COMMENTS_PER_REQUEST=100
CACHE_TTL_HOURS=1
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

# Feature Flags
VITE_ENABLE_AI_CHAT=true
VITE_ENABLE_ANALYTICS=true
```

---

## 📊 API Documentation

### WebSocket Real-time Connection
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/{user_id}');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log(`Progress: ${update.progress}%`);
  console.log(`Status: ${update.status}`);
  console.log(`ETA: ${update.estimated_completion}`);
};

ws.onopen = () => console.log('Connected to analysis updates');
ws.onerror = (error) => console.error('WebSocket error:', error);
```

### REST API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/youtube/analyze-video-async` | Start asynchronous video analysis |
| GET | `/api/youtube/analysis-status/{task_id}` | Check analysis progress |
| GET | `/api/youtube/analysis-result/{task_id}` | Retrieve analysis results |
| POST | `/api/csv/upload` | Upload and analyze CSV files |
| POST | `/api/gemini/chat` | AI chat interaction |
| GET | `/api/user/profile` | Get user profile data |
| GET | `/api/cache/stats` | Cache performance statistics |

### Error Handling
```json
{
  "error": "INVALID_VIDEO_URL",
  "message": "The provided YouTube URL is not valid",
  "details": {
    "url": "invalid-url",
    "expected_format": "https://youtube.com/watch?v=VIDEO_ID"
  }
}
```

For complete API documentation with examples: http://localhost:8000/docs

---

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) for detailed information.

### Development Workflow
1. **Fork** the repository to your GitHub account
2. **Clone** your fork locally: `git clone https://github.com/your-username/CommsItumo.git`
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Develop** your feature with tests and documentation
5. **Commit** changes: `git commit -m 'feat: Add amazing feature'`
6. **Push** to your branch: `git push origin feature/amazing-feature`
7. **Submit** a Pull Request with detailed description

### Code Standards
- **Frontend**: ESLint + Prettier configuration
- **Backend**: Black + isort for Python code formatting
- **TypeScript**: Strict type checking enabled
- **Testing**: Jest for frontend, pytest for backend
- **Documentation**: JSDoc for functions and components

### Commit Convention
We follow [Conventional Commits](https://conventionalcommits.org/) specification:
- `feat:` New features and enhancements
- `fix:` Bug fixes and patches
- `docs:` Documentation updates
- `style:` Code formatting and style changes
- `refactor:` Code refactoring without feature changes
- `test:` Test additions and improvements
- `chore:` Maintenance and build tasks

---

## 📄 License

This project is licensed under the [GNU General Public License v3.0](LICENSE) - see the LICENSE file for details.

---

# 🇹🇷 Türkçe Versiyon

## 📋 İçindekiler

- [🎯 Proje Hakkında](#-proje-hakkında)
- [✨ Özellikler](#-özellikler)
- [🎨 Modern UI Tasarımı](#-modern-ui-tasarımı)
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

Bu proje [GNU General Public License v3.0](LICENSE) altında lisanslanmıştır.

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

*Türkiye'de yapıldı 🇹🇷*  
*Son Güncelleme: Temmuz 2025*  
*Versiyon: 3.0.0*

</div> 
