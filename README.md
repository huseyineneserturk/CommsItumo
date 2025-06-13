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

- [🇬🇧 **English Version**](#english-version) - Complete documentation in English
- [🇹🇷 **Türkçe Versiyon**](#türkçe-versiyon) - Türkçe dokumentasyon (technical terimler İngilizce)

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

CommsItumo, YouTube video comment'larını AI destekli sentiment analysis ve theme detection ile analyze ederek content creator'lara ve marketing specialist'lerine değerli insight'lar sunan modern bir web application'dır.

### 🎯 Hedef Kitle
- **Content Creator'lar**: Audience insight'ları arayan YouTube channel sahipleri
- **Marketing Specialist'leri**: Brand sentiment track eden social media analyst'leri  
- **Researcher'lar**: Social media trend'leri study eden academic ve industry professional'ları
- **Brand'lar**: Customer feedback ve engagement analyze eden company'ler

### 🌟 Neden CommsItumo?
- **⚡ Ultra Hızlı Analysis**: WebSocket technology ile real-time progress tracking
- **🧠 Smart Caching**: Intelligent 3-tier cache system ile %40-50 daha fast processing
- **🔄 Asynchronous Processing**: UI freezing olmadan background task processing
- **🌐 Multi-language Support**: Türkçe ve İngilizce comment'ler için advanced support
- **📊 Visual Report'lar**: Interactive chart'lar ve comprehensive statistics
- **🎨 Modern UI/UX**: Ant Design ile intuitive ve responsive design
- **🔒 Secure**: Firebase-powered authentication ve data storage
- **📱 PWA Ready**: Mobile experience için Progressive Web App support

---

## ✨ Özellikler

### 🎬 YouTube Video Analysis
- **Automatic Comment Fetching**: YouTube Data API v3 ile one-click comment collection
- **⚡ Asynchronous Analysis**: WebSocket connection'lar via real-time progress update'ler
- **📊 Batch Processing**: 20-comment batch'ler ile efficient processing
- **🔄 Background Task'lar**: FastAPI background task'ları ile non-blocking analysis
- **📈 Time Estimation**: Accurate completion time prediction'ları
- **🎯 Progressive Loading**: 7-stage analysis progress visualization
- **📱 Responsive Progress**: Mobile-optimized progress tracking interface

### 📊 Advanced Sentiment Analysis
- **AI-Powered Analysis**: Hugging Face integration ile Transformer-based model'ler
- **Multi-Category Classification**: Positive, Negative, Neutral sentiment detection
- **Confidence Scoring**: Her analysis result için reliability metric'leri
- **Language Detection**: Automatic language identification ve model selection
- **Trend Analysis**: Time-series sentiment change tracking
- **Real-time Processing**: Fast result'lar için asynchronous model inference

### 🏷️ Intelligent Theme Analysis
- **Automatic Theme Detection**: Comment'larda NLP-powered topic identification
- **Keyword Extraction**: Advanced word frequency ve importance analysis
- **Category Classification**: Content quality, presentation style, technical aspect'ler
- **Trend Visualization**: Zaman içinde theme evolution tracking
- **Word Cloud Generation**: @visx/wordcloud ile visual representation

### 📈 Modern Data Visualization
- **Interactive Chart'lar**: Recharts powered dynamic visualization'lar
- **Real-time Update'ler**: React state management ile live data binding
- **Responsive Design**: Mobile-first visualization approach
- **Export Capability'leri**: Report'lar için PNG/PDF export functionality
- **Custom Animation'lar**: Smooth transition'lar ve hover effect'leri

### 📁 Flexible CSV Support
- **Drag & Drop Upload**: Intuitive file upload interface
- **Format Validation**: Automatic CSV structure detection ve validation
- **Batch Processing**: Binlerce comment'i efficiently handle etme
- **Custom Delimiter'lar**: Çeşitli CSV format'ları için support
- **Error Handling**: User feedback ile comprehensive validation

### 💾 Smart Caching System
- **3-Tier Cache Architecture**:
  - Analysis Cache: 1 hour TTL, 30MB limit
  - Video Cache: 30 minute TTL, 20MB limit
  - Quick Cache: 5 minute TTL, 10MB limit
- **LRU Eviction Policy**: Intelligent memory management
- **Cache Statistics**: Hit/miss ratio'ları ile performance monitoring
- **Auto Cleanup**: Automatic memory optimization
- **%70-80 Hit Rate**: Performance için optimized

### 🌐 Real-time WebSocket System
- **Singleton Connection Manager**: Efficient connection pooling
- **Heartbeat Monitoring**: Ping-pong based connection health check'leri
- **Auto Reconnection**: Robust error recovery mechanism'ları
- **User-based Session'lar**: Per user isolated progress tracking
- **Task Queue Management**: Priority ile ordered task processing

### 🤖 AI Chat Assistant
- **Google Gemini Integration**: Advanced conversational AI capability'leri
- **Context-Aware Response'lar**: Analysis data-driven intelligent answer'lar
- **Natural Language Processing**: Intuitive user interaction
- **Suggestion Engine**: Actionable insight'lar ve recommendation'lar
- **Multi-turn Conversation'lar**: Contextual dialogue management

---

## 🛠️ Teknolojiler

### 🎨 Frontend Stack
| Technology | Version | Amaç |
|-----------|---------|------|
| **React** | 18.2.0 | Component-based UI framework |
| **TypeScript** | 5.0.2 | Type-safe JavaScript development |
| **Vite** | 4.4.5 | Fast build tool ve dev server |
| **Ant Design** | 5.8.4 | Enterprise-class UI component'leri |
| **Tailwind CSS** | 3.3.0 | Utility-first CSS framework |
| **Recharts** | 2.7.2 | Declarative chart library |
| **@visx/wordcloud** | 3.0.0 | Advanced word cloud visualization |
| **Firebase SDK** | 10.1.0 | Authentication ve real-time database |

### ⚙️ Backend Stack
| Technology | Version | Amaç |
|-----------|---------|------|
| **FastAPI** | 0.104.1 | High-performance async web framework |
| **Python** | 3.8+ | Core programming language |
| **Transformers** | 4.51.3 | Pre-trained NLP model'leri |
| **NLTK** | 3.8.1 | Natural language toolkit |
| **Pandas** | 2.2.1 | Data manipulation ve analysis |
| **NumPy** | 1.26.4 | Numerical computing library |
| **Scikit-learn** | 1.4.1 | Machine learning algorithm'ları |
| **Uvicorn** | 0.23.2 | ASGI server implementation |

### 🗄️ Service'ler ve API'ler
- **Firebase Firestore**: NoSQL document database
- **Firebase Authentication**: Google OAuth integration
- **YouTube Data API v3**: Video ve comment data access
- **Google Gemini AI**: Advanced conversational AI
- **Hugging Face Hub**: Pre-trained model repository

---

## 📦 Kurulum

### 📋 Ön Gereksinimler

Aşağıdakilerin installed olduğundan emin olun:
- **Node.js** (v18.0.0+) - [İndir](https://nodejs.org/)
- **Python** (v3.8+) - [İndir](https://python.org/)
- **Git** - [İndir](https://git-scm.com/)

### 🔧 Hızlı Başlangıç

#### 1️⃣ Repository Clone
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
# .env'i API key'lerinizle configure edin
```

#### 3️⃣ Frontend Setup
   ```bash
cd ../frontend
npm install
cp .env.example .env
# .env'i Firebase config ile configure edin
```

#### 4️⃣ Development Server'ları Start Edin
```bash
# Terminal 1 - Backend
cd backend && uvicorn main:app --reload

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### 🌐 Access Point'leri
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🚀 Kullanım

### 📊 YouTube Analysis
1. Google account'unuzla **Login** olun
2. YouTube video URL'ini **girin**
3. Analysis parameter'larını **configure** edin (comment limit, language)
4. WebSocket via real-time progress'i **watch** edin
5. Interactive visualization'larla result'ları **explore** edin

### 📁 CSV Analysis
1. CSV file'ınızı drag-and-drop ile **upload** edin
2. Required field'lara column'ları **map** edin
3. Batch analysis'i **start** edin
4. Result'ları ve visualization'ları **download** edin

### 🤖 AI Assistant
1. Bottom-right'taki chat icon'una **click** edin
2. Analysis result'larınız hakkında **question** sorun
3. Actionable insight'lar ve recommendation'lar **alın**

---

## 📁 Proje Yapısı

```
CommsItumo/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI component'leri
│   │   ├── pages/          # Page component'leri
│   │   ├── services/       # API integration
│   │   ├── contexts/       # React context'leri
│   │   └── types/          # TypeScript definition'ları
│   └── public/             # Static asset'ler
├── backend/                 # FastAPI application
│   ├── app/                # Core application
│   │   ├── routers/        # API endpoint'leri
│   │   ├── models/         # Data model'leri
│   │   └── services/       # Business logic
│   ├── services/           # External integration'lar
│   └── main.py            # Application entry point
└── docs/                   # Documentation
```

---

## 🔧 Konfigürasyon

### Backend Environment (.env)
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com

# API Key'ler
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

## 📊 API Dokümantasyonu

### WebSocket Connection
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/{user_id}');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log(`Progress: ${update.progress}%`);
  console.log(`Status: ${update.status}`);
};
```

### REST Endpoint'ler
- `POST /api/youtube/analyze-video-async` - Async video analysis start et
- `GET /api/youtube/analysis-status/{task_id}` - Analysis status check et
- `POST /api/csv/upload` - CSV upload ve analyze et
- `POST /api/gemini/chat` - AI chat interaction

Complete API documentation için visit edin: http://localhost:8000/docs

---

## 🤝 Katkıda Bulunma

Contribution'larınızı welcome ediyoruz! Detail'ler için [Contributing Guidelines](CONTRIBUTING.md)'ı read edin.

### Development Workflow
1. Repository'yi fork edin
2. Feature branch create edin: `git checkout -b feature/amazing-feature`
3. Change'leri commit edin: `git commit -m 'feat: Add amazing feature'`
4. Branch'e push edin: `git push origin feature/amazing-feature`
5. Pull Request open edin

### Commit Convention
[Conventional Commits](https://conventionalcommits.org/) follow ediyoruz:
- `feat:` New feature'lar
- `fix:` Bug fix'leri
- `docs:` Documentation update'leri
- `style:` Code formatting
- `refactor:` Code refactoring
- `test:` Test addition'ları
- `chore:` Maintenance task'ları

---

## 📄 Lisans

Bu project [MIT License](LICENSE) altında licensed'dır.

---

<div align="center">

### 🌟 Project'i Beğendiyseniz Star Vermeyi Unutmayın!

[![GitHub Stars](https://img.shields.io/github/stars/huseyineneserturk/CommsItumo?style=social)](https://github.com/huseyineneserturk/CommsItumo/stargazers)

**CommsItumo ile YouTube comment'larınızı analyze edin ve content'inizi improve edin! 🚀**

### 👨‍💻 Geliştirici | Developer

**Hüseyin Enes Ertürk**

[![GitHub](https://img.shields.io/badge/GitHub-huseyineneserturk-black?style=for-the-badge&logo=github)](https://github.com/huseyineneserturk)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/huseyineneserturk)
[![Email](https://img.shields.io/badge/Email-Contact-red?style=for-the-badge&logo=gmail)](mailto:huseyinenes.erturk@gmail.com)

**Backend Developer ve Data Analyst Adayı | Backend Developer and Data Analyst Candidate**

### 📊 Project Performance Statistics

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/huseyineneserturk/CommsItumo)
![GitHub last commit](https://img.shields.io/github/last-commit/huseyineneserturk/CommsItumo)
![GitHub repo size](https://img.shields.io/github/repo-size/huseyineneserturk/CommsItumo)
![GitHub language count](https://img.shields.io/github/languages/count/huseyineneserturk/CommsItumo)

### ⚡ Performance Metrics | Performans Metrikleri

- **Analysis Speed | Analysis Hızı**: %40-50 faster than previous | öncekinden daha fast
- **UI Responsiveness | UI Duyarlılığı**: %100 freeze-free | donmama
- **Cache Hit Rate | Cache Hit Oranı**: Average %70-80 | ortalama
- **Memory Usage | Memory Kullanımı**: Controlled 60MB limit | kontrollü limit
- **WebSocket Uptime | WebSocket Çalışma Süresi**: %99.9 connection stability | bağlantı kararlılığı

---

*Made with ❤️ in Turkey 🇹🇷 | Türkiye'de ❤️ ile yapıldı*  
*Last Update | Son Güncelleme: Aralık 2024*  
*Version | Versiyon: 2.1.0*

</div> 
