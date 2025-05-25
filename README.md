# 🎯 CommsItumo - YouTube Yorum Analizi Platformu

<div align="center">

![CommsItumo Logo](frontend/public/Resources/Logo.png)

**YouTube videolarının yorumlarını analiz eden, duygu analizi ve tema tespiti yapan modern web uygulaması**

[![GitHub Stars](https://img.shields.io/github/stars/huseyineneserturk/CommsItumo?style=for-the-badge)](https://github.com/huseyineneserturk/CommsItumo/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/huseyineneserturk/CommsItumo?style=for-the-badge)](https://github.com/huseyineneserturk/CommsItumo/network)
[![GitHub Issues](https://img.shields.io/github/issues/huseyineneserturk/CommsItumo?style=for-the-badge)](https://github.com/huseyineneserturk/CommsItumo/issues)
[![License](https://img.shields.io/github/license/huseyineneserturk/CommsItumo?style=for-the-badge)](LICENSE)

[🚀 Demo](#-demo) • [📖 Dokümantasyon](#-dokümantasyon) • [🛠️ Kurulum](#️-kurulum) • [🤝 Katkıda Bulunma](#-katkıda-bulunma)

</div>

---

## 📋 İçindekiler

- [🎯 Proje Hakkında](#-proje-hakkında)
- [✨ Özellikler](#-özellikler)
- [🎥 Demo](#-demo)
- [🛠️ Teknolojiler](#️-teknolojiler)
- [📦 Kurulum](#-kurulum)
- [🚀 Kullanım](#-kullanım)
- [📁 Proje Yapısı](#-proje-yapısı)
- [🔧 Konfigürasyon](#-konfigürasyon)
- [📊 API Dokümantasyonu](#-api-dokümantasyonu)
- [🧪 Test](#-test)
- [🚀 Deployment](#-deployment)
- [🤝 Katkıda Bulunma](#-katkıda-bulunma)
- [📄 Lisans](#-lisans)
- [👨‍💻 Geliştirici](#-geliştirici)
- [🙏 Teşekkürler](#-teşekkürler)

---

## 🎯 Proje Hakkında

CommsItumo, YouTube videolarının yorumlarını analiz ederek içerik üreticilerine ve pazarlama uzmanlarına değerli içgörüler sunan modern bir web uygulamasıdır. Yapay zeka destekli duygu analizi ve tema tespiti ile kullanıcıların videolarına gelen tepkileri derinlemesine anlayabilirler.

### 🎯 Hedef Kitle
- **İçerik Üreticileri**: YouTube kanalı sahipleri
- **Pazarlama Uzmanları**: Sosyal medya analisti
- **Araştırmacılar**: Sosyal medya araştırması yapanlar
- **Markalar**: Müşteri geri bildirimlerini analiz etmek isteyenler

### 🌟 Neden CommsItumo?
- **Hızlı Analiz**: Binlerce yorumu saniyeler içinde analiz eder
- **Çoklu Dil Desteği**: Türkçe ve İngilizce yorumları destekler
- **Görsel Raporlar**: Anlaşılır grafikler ve istatistikler
- **Kullanıcı Dostu**: Sezgisel ve modern arayüz
- **Güvenli**: Firebase ile güvenli veri saklama

---

## ✨ Özellikler

### 🎬 YouTube Video Analizi
- **Otomatik Yorum Çekme**: Video URL'si ile tek tıkla yorum toplama
- **Toplu Analiz**: Birden fazla videoyu aynı anda analiz etme
- **Gerçek Zamanlı Veri**: En güncel yorumları çekme
- **Video Metadata**: Video bilgileri ve istatistikleri

### 📊 Duygu Analizi
- **AI Destekli Analiz**: Transformer modelleri ile duygu tespiti
- **Çoklu Kategori**: Pozitif, Negatif, Nötr duygu sınıflandırması
- **Güven Skoru**: Her analiz için güvenilirlik oranı
- **Dil Tespiti**: Otomatik dil algılama ve uygun model seçimi

### 🏷️ Tema Analizi
- **Otomatik Tema Tespiti**: Yorumların hangi konularda odaklandığını bulma
- **Anahtar Kelime Çıkarımı**: En sık kullanılan kelimeleri tespit etme
- **Kategori Sınıflandırması**: İçerik kalitesi, sunum tarzı, teknik konular
- **Trend Analizi**: Zaman içindeki tema değişimlerini takip etme

### 📈 Görselleştirme
- **İnteraktif Grafikler**: Recharts ile dinamik veri görselleştirme
- **Kelime Bulutu**: En popüler kelimelerin görsel temsili
- **Pasta Grafikleri**: Duygu dağılımının oransal gösterimi
- **Zaman Serisi**: Yorumların zaman içindeki dağılımı

### 📁 CSV Desteği
- **Dosya Yükleme**: Kendi yorum verilerinizi yükleyerek analiz
- **Esnek Format**: Farklı CSV formatlarını destekleme
- **Toplu İşlem**: Binlerce yorumu tek seferde işleme
- **Veri Doğrulama**: Yüklenen verilerin otomatik kontrolü

### 👤 Kullanıcı Yönetimi
- **Firebase Auth**: Google ile güvenli giriş
- **Profil Yönetimi**: Kişisel bilgileri düzenleme
- **Analiz Geçmişi**: Geçmiş analizleri görüntüleme ve yönetme
- **Favoriler**: Önemli analizleri kaydetme

### 🤖 AI Chat Asistanı
- **Akıllı Yardımcı**: Analiz sonuçları hakkında soru sorma
- **Öneriler**: İyileştirme önerileri alma
- **Açıklamalar**: Karmaşık verileri anlaşılır hale getirme
- **Etkileşimli**: Doğal dil ile iletişim

---

## 🎥 Demo

### 📸 Ekran Görüntüleri

<details>
<summary>🏠 Ana Sayfa</summary>

![Ana Sayfa](docs/screenshots/homepage.png)
*Modern ve kullanıcı dostu ana sayfa tasarımı*

</details>

<details>
<summary>📊 Analiz Sonuçları</summary>

![Analiz Sonuçları](docs/screenshots/analysis.png)
*Detaylı duygu analizi ve görselleştirme*

</details>

<details>
<summary>📈 Dashboard</summary>

![Dashboard](docs/screenshots/dashboard.png)
*Kapsamlı analiz dashboard'u*

</details>

### 🎬 Video Demo
> **Not**: Demo videosu yakında eklenecektir.

---

## 🛠️ Teknolojiler

### 🎨 Frontend
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| **React** | 18.2.0 | Modern UI kütüphanesi |
| **TypeScript** | 5.0.2 | Type-safe JavaScript |
| **Vite** | 4.4.5 | Hızlı build tool |
| **Ant Design** | 5.8.4 | UI component kütüphanesi |
| **Tailwind CSS** | 3.3.0 | Utility-first CSS framework |
| **Recharts** | 2.7.2 | Data visualization |
| **Firebase** | 10.1.0 | Authentication & Database |
| **Axios** | 1.4.0 | HTTP client |

### ⚙️ Backend
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| **FastAPI** | 0.104.1 | Modern Python web framework |
| **Python** | 3.8+ | Programming language |
| **Transformers** | 4.51.3 | Hugging Face AI models |
| **NLTK** | 3.8.1 | Natural language processing |
| **Pandas** | 2.2.1 | Data manipulation |
| **NumPy** | 1.26.4 | Numerical computing |
| **Scikit-learn** | 1.4.1 | Machine learning |
| **Firebase Admin** | 6.2.0 | Backend Firebase SDK |
| **YouTube Data API** | v3 | YouTube integration |

### 🗄️ Veritabanı & Servisler
- **Firestore**: NoSQL document database
- **Firebase Storage**: File storage
- **YouTube Data API v3**: Video ve yorum verileri
- **Google Cloud**: AI/ML servisleri

---

## 📦 Kurulum

### 📋 Ön Gereksinimler

Sisteminizde aşağıdaki yazılımların kurulu olması gerekmektedir:

- **Node.js** (v18.0.0 veya üzeri) - [İndir](https://nodejs.org/)
- **Python** (v3.8 veya üzeri) - [İndir](https://python.org/)
- **Git** - [İndir](https://git-scm.com/)
- **Firebase Projesi** - [Oluştur](https://console.firebase.google.com/)
- **YouTube Data API Key** - [Al](https://console.cloud.google.com/)

### 🔧 Kurulum Adımları

#### 1️⃣ Repository'yi Klonlayın

```bash
git clone https://github.com/huseyineneserturk/CommsItumo.git
cd CommsItumo
```

#### 2️⃣ Backend Kurulumu

```bash
# Backend klasörüne geçin
cd backend

# Virtual environment oluşturun (önerilen)
python -m venv venv

# Virtual environment'ı aktifleştirin
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Environment variables dosyasını oluşturun
cp .env.example .env

# .env dosyasını düzenleyin (aşağıdaki konfigürasyon bölümüne bakın)
nano .env  # veya favori editörünüz
```

#### 3️⃣ Frontend Kurulumu

```bash
# Frontend klasörüne geçin
cd ../frontend

# Bağımlılıkları yükleyin
npm install

# Environment variables dosyasını oluşturun
cp .env.example .env

# .env dosyasını düzenleyin
nano .env  # veya favori editörünüz
```

#### 4️⃣ Firebase Konfigürasyonu

1. **Firebase Console'a gidin**: https://console.firebase.google.com/
2. **Yeni proje oluşturun** veya mevcut projeyi seçin
3. **Authentication'ı etkinleştirin**:
   - Authentication > Sign-in method > Google > Enable
4. **Firestore Database oluşturun**:
   - Firestore Database > Create database > Start in test mode
5. **Service Account Key alın**:
   - Project Settings > Service accounts > Generate new private key
   - İndirilen JSON dosyasını `backend/serviceAccountKey.json` olarak kaydedin
6. **Web App konfigürasyonu**:
   - Project Settings > General > Your apps > Add app > Web
   - Config bilgilerini frontend `.env` dosyasına ekleyin

#### 5️⃣ YouTube API Konfigürasyonu

1. **Google Cloud Console'a gidin**: https://console.cloud.google.com/
2. **Yeni proje oluşturun** veya mevcut projeyi seçin
3. **YouTube Data API v3'ü etkinleştirin**:
   - APIs & Services > Library > YouTube Data API v3 > Enable
4. **API Key oluşturun**:
   - APIs & Services > Credentials > Create Credentials > API Key
5. **OAuth 2.0 Client ID oluşturun**:
   - APIs & Services > Credentials > Create Credentials > OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/callback`

---

## 🚀 Kullanım

### 🖥️ Development Mode

#### Backend'i Başlatın
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend'i Başlatın
```bash
cd frontend
npm run dev
```

### 🌐 Erişim URL'leri
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Dokümantasyonu**: http://localhost:8000/docs
- **Redoc**: http://localhost:8000/redoc

### 📱 Kullanım Adımları

1. **Kayıt Olun/Giriş Yapın**: Google hesabınızla giriş yapın
2. **YouTube Video Analizi**:
   - YouTube video URL'sini girin
   - "Analiz Et" butonuna tıklayın
   - Sonuçları görüntüleyin
3. **CSV Analizi**:
   - CSV dosyanızı yükleyin
   - Sütun eşleştirmelerini yapın
   - Analizi başlatın
4. **Sonuçları İnceleyin**:
   - Duygu analizi grafiklerini görüntüleyin
   - Tema analizini inceleyin
   - Kelime bulutunu kontrol edin
5. **AI Asistanı**:
   - Sağ alt köşedeki chat butonuna tıklayın
   - Analiz hakkında sorular sorun

---

## 📁 Proje Yapısı

```
CommsItumo/
├── 📁 frontend/                    # React frontend uygulaması
│   ├── 📁 public/                  # Statik dosyalar
│   │   ├── 📁 Resources/           # Görseller ve logolar
│   │   └── 📄 sample_comments.csv  # Örnek CSV dosyası
│   ├── 📁 src/                     # Kaynak kodlar
│   │   ├── 📁 components/          # React bileşenleri
│   │   │   ├── 📄 AIChatPopup.tsx  # AI chat bileşeni
│   │   │   ├── 📄 CommentCard.tsx  # Yorum kartı bileşeni
│   │   │   ├── 📄 ErrorBoundary.tsx # Hata yakalama
│   │   │   └── 📁 Layout/          # Layout bileşenleri
│   │   ├── 📁 contexts/            # React context'leri
│   │   │   └── 📄 AIContext.tsx    # AI chat context'i
│   │   ├── 📁 lib/                 # Utility fonksiyonları
│   │   │   ├── 📄 AuthContext.tsx  # Authentication context
│   │   │   ├── 📄 firebase.ts      # Firebase konfigürasyonu
│   │   │   └── 📄 utils.ts         # Yardımcı fonksiyonlar
│   │   ├── 📁 pages/               # Sayfa bileşenleri
│   │   │   ├── 📄 Dashboard.tsx    # Ana dashboard
│   │   │   ├── 📄 YouTubeAnalysis.tsx # YouTube analiz sayfası
│   │   │   ├── 📄 UploadCSV.tsx    # CSV yükleme sayfası
│   │   │   ├── 📄 VideoAnalysis.tsx # Video analiz sonuçları
│   │   │   ├── 📄 Profile.tsx      # Kullanıcı profili
│   │   │   └── 📄 MyComments.tsx   # Analiz geçmişi
│   │   ├── 📁 services/            # API servisleri
│   │   │   ├── 📄 analysisService.ts # Analiz API'leri
│   │   │   ├── 📄 youtubeService.ts # YouTube API'leri
│   │   │   ├── 📄 sentimentService.ts # Duygu analizi API'leri
│   │   │   └── 📄 profileService.ts # Profil API'leri
│   │   ├── 📁 types/               # TypeScript tip tanımları
│   │   │   ├── 📄 analysis.ts      # Analiz tipleri
│   │   │   └── 📄 sentiment.ts     # Duygu analizi tipleri
│   │   ├── 📄 App.tsx              # Ana uygulama bileşeni
│   │   ├── 📄 main.tsx             # Uygulama giriş noktası
│   │   └── 📄 index.css            # Global stiller
│   ├── 📄 package.json             # Frontend bağımlılıkları
│   ├── 📄 vite.config.ts           # Vite konfigürasyonu
│   ├── 📄 tailwind.config.js       # Tailwind CSS konfigürasyonu
│   └── 📄 tsconfig.json            # TypeScript konfigürasyonu
├── 📁 backend/                     # FastAPI backend uygulaması
│   ├── 📁 app/                     # FastAPI uygulaması
│   │   ├── 📁 models/              # Veri modelleri
│   │   │   └── 📄 comment.py       # Yorum modeli
│   │   ├── 📁 routers/             # API route'ları
│   │   │   ├── 📄 csv_router.py    # CSV analiz endpoint'leri
│   │   │   └── 📄 gemini.py        # AI chat endpoint'leri
│   │   ├── 📁 services/            # Servis katmanı
│   │   │   └── 📄 gemini.py        # AI chat servisi
│   │   └── 📄 __init__.py          # Package marker
│   ├── 📁 services/                # İş mantığı servisleri
│   │   ├── 📄 csv_analyzer.py      # CSV analiz servisi
│   │   ├── 📄 sentiment_service.py # Duygu analizi servisi
│   │   ├── 📄 youtube_service.py   # YouTube API servisi
│   │   └── 📄 firestore_service.py # Firestore veritabanı servisi
│   ├── 📄 main.py                  # FastAPI ana dosyası
│   ├── 📄 requirements.txt         # Python bağımlılıkları
│   ├── 📄 .env.example             # Environment variables örneği
│   └── 📄 README.md                # Backend dokümantasyonu
├── 📄 README.md                    # Ana proje dokümantasyonu
├── 📄 .gitignore                   # Git ignore kuralları
├── 📄 deployment-guide.md          # Deployment rehberi
└── 📄 LICENSE                      # Lisans dosyası
```

---

## 🔧 Konfigürasyon

### 🔐 Backend Environment Variables (.env)

```env
# Firebase Konfigürasyonu
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# YouTube API Konfigürasyonu
YOUTUBE_API_KEY=your-youtube-api-key
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Uygulama Ayarları
DEBUG=False
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3000,https://your-domain.com

# AI Model Ayarları
HUGGINGFACE_TOKEN=your-huggingface-token
MODEL_CACHE_DIR=./models
```

### 🎨 Frontend Environment Variables (.env)

```env
# API Konfigürasyonu
VITE_API_URL=http://localhost:8000
VITE_BACKEND_URL=http://localhost:8000

# Firebase Konfigürasyonu (Frontend)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Uygulama Ayarları
VITE_APP_NAME=CommsItumo
VITE_APP_VERSION=1.0.0
```

---

## 📊 API Dokümantasyonu

### 🔗 Endpoint'ler

#### 📹 YouTube Analizi
```http
POST /api/youtube/analyze
Content-Type: application/json

{
  "video_url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "max_comments": 100
}
```

#### 📁 CSV Analizi
```http
POST /api/csv/upload
Content-Type: multipart/form-data

file: [CSV_FILE]
```

#### 🤖 AI Chat
```http
POST /api/chat/message
Content-Type: application/json

{
  "message": "Bu analiz sonuçları hakkında ne düşünüyorsun?",
  "context": "analysis_data"
}
```

### 📋 Response Formatları

#### Duygu Analizi Response
```json
{
  "sentiment_analysis": {
    "positive": 45.2,
    "negative": 23.8,
    "neutral": 31.0
  },
  "theme_analysis": [
    {
      "theme": "Video Quality",
      "percentage": 35.5,
      "keywords": ["quality", "resolution", "clear"]
    }
  ],
  "word_cloud": {
    "words": [
      {"text": "amazing", "value": 15},
      {"text": "great", "value": 12}
    ]
  }
}
```

### 📖 Detaylı API Dokümantasyonu
Uygulamayı çalıştırdıktan sonra aşağıdaki URL'lerden detaylı API dokümantasyonuna erişebilirsiniz:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🧪 Test

### 🔬 Backend Testleri

```bash
cd backend

# Test bağımlılıklarını yükleyin
pip install pytest pytest-asyncio httpx

# Testleri çalıştırın
pytest tests/ -v

# Coverage raporu
pytest --cov=app tests/
```

### 🎯 Frontend Testleri

```bash
cd frontend

# Test bağımlılıklarını yükleyin
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Testleri çalıştırın
npm test

# Coverage raporu
npm run test:coverage
```

### 📊 Test Coverage
- **Backend**: %85+ test coverage hedeflenmektedir
- **Frontend**: %80+ test coverage hedeflenmektedir

---

## 🚀 Deployment

### 🌐 Production Build

#### Frontend Build
```bash
cd frontend
npm run build
```

#### Backend Production
```bash
cd backend
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### ☁️ Cloud Deployment Seçenekleri

1. **Vercel** (Frontend) + **Railway** (Backend)
2. **Netlify** (Frontend) + **Heroku** (Backend)
3. **DigitalOcean App Platform** (Full-stack)
4. **AWS** (EC2 + S3 + RDS)

Detaylı deployment rehberi için: [deployment-guide.md](deployment-guide.md)

---

## 🤝 Katkıda Bulunma

CommsItumo açık kaynak bir projedir ve katkılarınızı memnuniyetle karşılıyoruz!

### 🔄 Katkı Süreci

1. **Fork edin** - Projeyi kendi hesabınıza fork edin
2. **Branch oluşturun** - Yeni özellik için branch oluşturun
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit edin** - Değişikliklerinizi commit edin
   ```bash
   git commit -m 'feat: Add amazing feature'
   ```
4. **Push edin** - Branch'inizi push edin
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Pull Request oluşturun** - GitHub'da PR oluşturun

### 📝 Commit Mesaj Formatı

```
type(scope): description

[optional body]

[optional footer]
```

**Tipler:**
- `feat`: Yeni özellik
- `fix`: Bug düzeltmesi
- `docs`: Dokümantasyon
- `style`: Kod formatı
- `refactor`: Kod refactoring
- `test`: Test ekleme
- `chore`: Bakım işleri

### 🐛 Bug Raporu

Bug bulduysanız lütfen [GitHub Issues](https://github.com/huseyineneserturk/CommsItumo/issues) sayfasından rapor edin.

**Bug raporu şablonu:**
- **Açıklama**: Bug'ın kısa açıklaması
- **Adımlar**: Bug'ı reproduce etme adımları
- **Beklenen**: Beklenen davranış
- **Gerçek**: Gerçek davranış
- **Ekran görüntüsü**: Varsa ekran görüntüsü
- **Ortam**: OS, browser, versiyon bilgileri

### 💡 Özellik İsteği

Yeni özellik önerilerinizi [GitHub Issues](https://github.com/huseyineneserturk/CommsItumo/issues) sayfasından paylaşabilirsiniz.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

```
MIT License

Copyright (c) 2024 Hüseyin Enes Ertürk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Geliştirici

<div align="center">

### **Hüseyin Enes Ertürk**

[![GitHub](https://img.shields.io/badge/GitHub-huseyineneserturk-black?style=for-the-badge&logo=github)](https://github.com/huseyineneserturk)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/huseyineneserturk)
[![Email](https://img.shields.io/badge/Email-Contact-red?style=for-the-badge&logo=gmail)](mailto:huseyinenes.erturk@gmail.com)

**Full-Stack Developer | AI Enthusiast | Open Source Contributor**

</div>

### 🎯 Proje Motivasyonu
Bu proje, YouTube içerik üreticilerinin ve pazarlama uzmanlarının videolarına gelen tepkileri daha iyi anlamalarına yardımcı olmak amacıyla geliştirilmiştir. Yapay zeka teknolojilerini kullanarak sosyal medya analizini demokratikleştirmeyi hedefliyoruz.

---

## 🙏 Teşekkürler

Bu projenin geliştirilmesinde katkıda bulunan herkese teşekkür ederiz:

### 🛠️ Teknoloji Sağlayıcıları
- **[YouTube Data API](https://developers.google.com/youtube/v3)** - Video ve yorum verilerine erişim
- **[Firebase](https://firebase.google.com/)** - Authentication ve database servisleri
- **[Hugging Face](https://huggingface.co/)** - AI/ML modelleri ve transformers
- **[Google Cloud](https://cloud.google.com/)** - AI servisleri ve hosting
- **[Ant Design](https://ant.design/)** - Modern UI component kütüphanesi
- **[React](https://reactjs.org/)** - Frontend framework
- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern Python web framework

### 📚 Açık Kaynak Kütüphaneler
- **[NLTK](https://www.nltk.org/)** - Natural language processing
- **[Pandas](https://pandas.pydata.org/)** - Data manipulation
- **[Recharts](https://recharts.org/)** - Data visualization
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling

### 🎨 Tasarım ve İlham
- **[Dribbble](https://dribbble.com/)** - UI/UX tasarım ilhamı
- **[Figma Community](https://www.figma.com/community)** - Tasarım kaynakları
- **[Unsplash](https://unsplash.com/)** - Ücretsiz görseller

### 🌟 Topluluk
- **[Stack Overflow](https://stackoverflow.com/)** - Teknik destek ve çözümler
- **[GitHub Community](https://github.com/)** - Açık kaynak işbirliği
- **[Reddit](https://reddit.com/r/webdev)** - Geliştirici topluluğu

---

<div align="center">

### 🌟 Projeyi Beğendiyseniz Yıldız Vermeyi Unutmayın!

[![GitHub Stars](https://img.shields.io/github/stars/huseyineneserturk/CommsItumo?style=social)](https://github.com/huseyineneserturk/CommsItumo/stargazers)

**CommsItumo ile YouTube yorumlarınızı analiz edin ve içeriğinizi geliştirin! 🚀**

---

*Son güncelleme: Aralık 2024*

</div> 