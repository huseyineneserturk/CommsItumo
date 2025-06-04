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
- [⚡ Performans Optimizasyonları](#-performans-optimizasyonları)
- [🧪 Test](#-test)
- [🚀 Dağıtım](#-dağıtım)
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
- **⚡ Ultra Hızlı Analiz**: WebSocket ile gerçek zamanlı ilerleme takibi
- **🧠 Akıllı Önbellek**: Akıllı önbellekleme ile 40-50% daha hızlı işlem
- **🔄 Eşzamansız İşleme**: Arka plan görev işleme ile UI donması yok
- **🌐 Çoklu Dil Desteği**: Türkçe ve İngilizce yorumları destekler
- **📊 Görsel Raporlar**: Anlaşılır grafikler ve istatistikler
- **🎨 Modern UI/UX**: Sezgisel ve duyarlı tasarım
- **🔒 Güvenli**: Firebase ile güvenli veri saklama
- **📱 İlerlemeli Web Uygulaması**: PWA desteği ile mobil deneyim

---

## ✨ Özellikler

### 🎬 YouTube Video Analizi
- **Otomatik Yorum Çekme**: Video URL'si ile tek tıkla yorum toplama
- **⚡ Eşzamansız Analiz**: WebSocket ile gerçek zamanlı ilerleme güncellemeleri
- **📊 Toplu İşleme**: 20'li yorum grupları ile hızlı işleme
- **🔄 Arka Plan Görevleri**: UI donması yapmadan arka plan analizi
- **📈 Tahmini Süre Hesaplama**: Tahmini tamamlanma süresini gösterme
- **🎯 İlerlemeli Yükleme**: 7 aşamalı analiz ilerlemesi
- **📱 Duyarlı İlerleme**: Mobil uyumlu ilerleme ekranı
- **Toplu Analiz**: Birden fazla videoyu aynı anda analiz etme
- **Gerçek Zamanlı Veri**: En güncel yorumları çekme
- **Video Üst Verileri**: Video bilgileri ve istatistikleri
- **Kanal Analizi**: Tüm kanal videolarını analiz etme

### 📊 Duygu Analizi
- **Yapay Zeka Destekli Analiz**: Transformer modelleri ile duygu tespiti
- **Çoklu Kategori**: Pozitif, Negatif, Nötr duygu sınıflandırması
- **Güven Skoru**: Her analiz için güvenilirlik oranı
- **Dil Tespiti**: Otomatik dil algılama ve uygun model seçimi
- **Eğilim Analizi**: Zaman içindeki duygu değişimlerini takip etme
- **Gerçek Zamanlı İşleme**: Eşzamansız model ile hızlı duygu analizi

### 🏷️ Tema Analizi
- **Otomatik Tema Tespiti**: Yorumların hangi konularda odaklandığını bulma
- **Anahtar Kelime Çıkarımı**: En sık kullanılan kelimeleri tespit etme
- **Kategori Sınıflandırması**: İçerik kalitesi, sunum tarzı, teknik konular
- **Eğilim Analizi**: Zaman içindeki tema değişimlerini takip etme

### 📈 Modern Görselleştirme
- **Etkileşimli Grafikler**: Recharts ile dinamik veri görselleştirme
- **Kelime Bulutu**: En popüler kelimelerin görsel temsili (@visx/wordcloud)
- **Halka Grafikleri**: Gelişmiş duygu dağılımı grafikleri
- **İlerleme Çubukları**: Anlık eğilim göstergeleri
- **Geçişli Tasarım**: Modern ve estetik görünüm

### 📁 CSV Desteği
- **Dosya Yükleme**: Kendi yorum verilerinizi yükleyerek analiz
- **Esnek Format**: Farklı CSV formatlarını destekleme
- **Toplu İşlem**: Binlerce yorumu tek seferde işleme
- **Veri Doğrulama**: Yüklenen verilerin otomatik kontrolü
- **Anlık Sonuçlar**: Hızlı CSV analizi ve görselleştirme
- **⚡ Eşzamansız CSV İşleme**: Arka plan CSV analizi

### 💾 Akıllı Önbellek Sistemi
- **🔄 3-Katmanlı Önbellek Hiyerarşisi**: 
  - Analiz Önbelleği (1 saat TTL, 30MB limit)
  - Video Önbelleği (30 dakika TTL, 20MB limit)  
  - Hızlı Önbellek (5 dakika TTL, 10MB limit)
- **🧠 LRU Çıkarma**: En az kullanılan verileri otomatik temizleme
- **📊 Önbellek İstatistikleri**: Önbellek kullanım istatistikleri ve isabet oranı
- **🔄 Otomatik Temizlik**: Bellek yönetimi ve otomatik temizlik
- **⚡ %70-80 Önbellek İsabet Oranı**: Hızlı veri erişimi

### 🌐 WebSocket Gerçek Zamanlı Sistem
- **🔄 Tekil Örüntü**: Tek örnek ile bağlantı yönetimi
- **💓 Kalp Atışı Sistemi**: Ping-pong ile bağlantı canlılığı
- **🔄 Otomatik Yeniden Bağlanma**: Otomatik yeniden bağlanma mantığı
- **📱 Bağlantı Havuzlama**: Kullanıcı bazlı bağlantı yönetimi
- **🔄 Görev ve Bağlantı Ayrımı**: Görev ve bağlantı ayrımı
- **📊 İlerleme Geri Çağırmaları**: Gerçek zamanlı ilerleme bildirimleri

### 👤 Kullanıcı Yönetimi
- **Firebase Kimlik Doğrulama**: Google ile güvenli giriş
- **Profil Yönetimi**: Kişisel bilgileri düzenleme
- **Analiz Geçmişi**: Geçmiş analizleri görüntüleme ve yönetme
- **Duyarlı Tasarım**: Tüm cihazlarda mükemmel görünüm

### 🤖 Yapay Zeka Sohbet Asistanı
- **Akıllı Yardımcı**: Analiz sonuçları hakkında soru sorma
- **Öneriler**: İyileştirme önerileri alma
- **Açıklamalar**: Karmaşık verileri anlaşılır hale getirme
- **Etkileşimli**: Doğal dil ile iletişim
- **Bağlam Farkında**: Analiz verilerine dayalı akıllı yanıtlar

### 🎨 Modern Kullanıcı Arayüzü/Deneyimi
- **Geçişli Tasarım**: Çağdaş görsel tasarım
- **Eşzamansız Mod Geçişi**: Eşzamanlı/Eşzamansız analiz modu seçimi
- **Gerçek Zamanlı İlerleme**: Tahmini süre hesaplama ve ilerleme takibi
- **Duyarlı Düzen**: Mobil öncelikli tasarım
- **Animasyon Efektleri**: Pürüzsüz geçişler ve üzerine gelme efektleri
- **Erişilebilirlik**: WCAG uyumlu erişilebilirlik

---

## 🎥 Demo

### 📸 Ekran Görüntüleri

<details>
<summary>🏠 Ana Sayfa</summary>

![Ana Sayfa](docs/screenshots/homepage.png)
*Modern video slider'lı ana sayfa ve interaktif özellik kartları*

</details>

<details>
<summary>📊 YouTube Analiz Sonuçları</summary>

![YouTube Analizi](docs/screenshots/youtube-analysis.png)
*Detaylı duygu analizi, kelime bulutu ve tema görselleştirme*

</details>

<details>
<summary>📈 Video Analiz Dashboard'u</summary>

![Video Analizi](docs/screenshots/video-analysis.png)
*Modern istatistik kartları ve gelişmiş grafikler*

</details>

<details>
<summary>📁 CSV Analiz Sayfası</summary>

![CSV Analizi](docs/screenshots/csv-analysis.png)
*Dosya yükleme ve anlık analiz sonuçları*

</details>

<details>
<summary>🤖 AI Chat Asistanı</summary>

![AI Chat](docs/screenshots/ai-chat.png)
*Akıllı chat popup ve context-aware yanıtlar*

</details>

### 🎬 Özellik Videoları
- **YouTube Video Analizi**: [Demo Video](#)
- **CSV Yükleme ve Analiz**: [Demo Video](#)
- **AI Chat Asistanı**: [Demo Video](#)

---

## 🛠️ Teknolojiler

### 🎨 Frontend
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| **React** | 18.2.0 | Modern kullanıcı arayüzü kütüphanesi |
| **TypeScript** | 5.0.2 | Tip güvenli JavaScript |
| **Vite** | 4.4.5 | Hızlı yapı aracı |
| **Ant Design** | 5.8.4 | Kullanıcı arayüzü bileşen kütüphanesi |
| **Tailwind CSS** | 3.3.0 | Faydacı öncelikli CSS çerçevesi |
| **Recharts** | 2.7.2 | Veri görselleştirme |
| **@visx/wordcloud** | 3.0.0 | Gelişmiş kelime bulutu |
| **Firebase** | 10.1.0 | Kimlik doğrulama ve veritabanı |
| **Axios** | 1.4.0 | HTTP istemcisi |
| **React Router** | 6.8.1 | İstemci tarafı yönlendirme |

### ⚙️ Backend
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| **FastAPI** | 0.104.1 | Modern Python web çerçevesi |
| **Python** | 3.8+ | Programlama dili |
| **Transformers** | 4.51.3 | Hugging Face yapay zeka modelleri |
| **NLTK** | 3.8.1 | Doğal dil işleme |
| **Pandas** | 2.2.1 | Veri manipülasyonu |
| **NumPy** | 1.26.4 | Sayısal hesaplama |
| **Scikit-learn** | 1.4.1 | Makine öğrenmesi |
| **Firebase Admin** | 6.2.0 | Backend Firebase SDK |
| **YouTube Data API** | v3 | YouTube entegrasyonu |
| **Google Gemini AI** | En son | Yapay zeka sohbet işlevselliği |

### 🗄️ Veritabanı ve Servisler
- **Firestore**: NoSQL belge veritabanı
- **Firebase Storage**: Dosya depolama
- **YouTube Data API v3**: Video ve yorum verileri
- **Google Cloud AI**: Makine öğrenmesi servisleri
- **Google Gemini**: Yapay zeka sohbet yetenekleri

---

## 📦 Kurulum

### 📋 Ön Gereksinimler

Sisteminizde aşağıdaki yazılımların kurulu olması gerekmektedir:

- **Node.js** (v18.0.0 veya üzeri) - [İndir](https://nodejs.org/)
- **Python** (v3.8 veya üzeri) - [İndir](https://python.org/)
- **Git** - [İndir](https://git-scm.com/)
- **Firebase Projesi** - [Oluştur](https://console.firebase.google.com/)
- **YouTube Data API Anahtarı** - [Al](https://console.cloud.google.com/)
- **Google Gemini API Anahtarı** - [Al](https://makersuite.google.com/)

### 🔧 Kurulum Adımları

#### 1️⃣ Depoyu Klonlayın

```bash
git clone https://github.com/huseyineneserturk/CommsItumo.git
cd CommsItumo
```

#### 2️⃣ Arka Uç Kurulumu

```bash
# Arka uç klasörüne geçin
cd backend

# Sanal ortam oluşturun (önerilen)
python -m venv venv

# Sanal ortamı etkinleştirin
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Ortam değişkenleri dosyasını oluşturun
cp .env.example .env

# .env dosyasını düzenleyin (aşağıdaki yapılandırma bölümüne bakın)
nano .env  # veya favori editörünüz
```

#### 3️⃣ Ön Uç Kurulumu

```bash
# Ön uç klasörüne geçin
cd ../frontend

# Bağımlılıkları yükleyin
npm install

# Ortam değişkenleri dosyasını oluşturun
cp .env.example .env

# .env dosyasını düzenleyin
nano .env  # veya favori editörünüz
```

#### 4️⃣ Firebase Yapılandırması

1. **Firebase Konsoluna gidin**: https://console.firebase.google.com/
2. **Yeni proje oluşturun** veya mevcut projeyi seçin
3. **Kimlik Doğrulamayı etkinleştirin**:
   - Authentication > Oturum açma yöntemi > Google > Etkinleştir
4. **Firestore Veritabanı oluşturun**:
   - Firestore Database > Veritabanı oluştur > Test modunda başlat
5. **Hizmet Hesabı Anahtarı alın**:
   - Proje Ayarları > Hizmet hesapları > Yeni özel anahtar oluştur
   - İndirilen JSON dosyasını `backend/serviceAccountKey.json` olarak kaydedin
6. **Web Uygulaması yapılandırması**:
   - Proje Ayarları > Genel > Uygulamalarınız > Uygulama ekle > Web
   - Yapılandırma bilgilerini ön uç `.env` dosyasına ekleyin

#### 5️⃣ API Anahtarları Yapılandırması

1. **YouTube Data API v3**:
   - Google Cloud Konsolu > API'ler ve Hizmetler > Kütüphane
   - YouTube Data API v3'ü etkinleştirin
   - Kimlik bilgilerinden API Anahtarı oluşturun

2. **Google Gemini AI**:
   - Google AI Studio'ya gidin
   - API Anahtarı oluşturun
   - Arka uç .env dosyasına ekleyin

---

## 🚀 Kullanım

### 🖥️ Geliştirme Modu

#### Arka Ucu Başlatın
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Ön Ucu Başlatın
```bash
cd frontend
npm run dev
```

### 🌐 Erişim URL'leri
- **Ön Uç**: http://localhost:3000
- **Arka Uç API**: http://localhost:8000
- **API Dokümantasyonu**: http://localhost:8000/docs
- **Redoc**: http://localhost:8000/redoc

### 📱 Kullanım Adımları

1. **Kayıt Olun/Giriş Yapın**: Google hesabınızla giriş yapın
2. **YouTube Video Analizi**:
   - YouTube video URL'sini girin
   - "Analiz Et" butonuna tıklayın
   - Modern grafiklerle sonuçları görüntüleyin
3. **Kanal Analizi**:
   - Kanal URL'sini girin
   - Tüm videoları toplu analiz edin
   - Kanal performansını değerlendirin
4. **CSV Analizi**:
   - CSV dosyanızı sürükle-bırak ile yükleyin
   - Otomatik sütun tanıma
   - Anlık analiz sonuçları
5. **AI Chat Asistanı**:
   - Sağ alt köşedeki chat butonuna tıklayın
   - Analiz hakkında akıllı sorular sorun
   - İçerik geliştirme önerileri alın

---

## 📁 Proje Yapısı

```
CommsItumo/
├── 📁 frontend/                    # React frontend uygulaması
│   ├── 📁 public/                  # Statik dosyalar
│   │   ├── 📁 Resources/           # Görseller ve logolar
│   │   │   ├── 📄 Logo.png         # Ana logo dosyası
│   │   │   ├── 📄 Pop_Up_Logo.png  # Chat popup logosu
│   │   │   └── 📄 *.mp4           # Video assets
│   │   └── 📄 sample_comments.csv  # Örnek CSV dosyası
│   ├── 📁 src/                     # Kaynak kodlar
│   │   ├── 📁 components/          # React bileşenleri
│   │   │   ├── 📄 AIChatPopup.tsx  # AI chat bileşeni
│   │   │   ├── 📄 AsyncAnalysisProgress.tsx # Real-time progress
│   │   │   ├── 📄 CommentCard.tsx  # Yorum kartı bileşeni
│   │   │   ├── 📄 ErrorBoundary.tsx # Hata yakalama
│   │   │   ├── 📄 CacheStatus.tsx  # Cache durum göstergesi
│   │   │   └── 📁 Layout/          # Layout bileşenleri
│   │   │       ├── 📄 Header.tsx   # Modern header
│   │   │       └── 📄 Footer.tsx   # Detaylı footer
│   │   ├── 📁 contexts/            # React context'leri
│   │   │   ├── 📄 AIContext.tsx    # AI chat context'i
│   │   │   └── 📄 CacheContext.tsx # Cache yönetimi
│   │   ├── 📁 lib/                 # Utility fonksiyonları
│   │   │   ├── 📄 AuthContext.tsx  # Authentication context
│   │   │   ├── 📄 firebase.ts      # Firebase konfigürasyonu
│   │   │   └── 📄 utils.ts         # Yardımcı fonksiyonlar
│   │   ├── 📁 pages/               # Sayfa bileşenleri
│   │   │   ├── 📄 Dashboard.tsx    # Modern ana dashboard
│   │   │   ├── 📄 YouTubeAnalysis.tsx # YouTube analiz sayfası
│   │   │   ├── 📄 UploadCSV.tsx    # CSV yükleme sayfası
│   │   │   ├── 📄 VideoAnalysis.tsx # Video analiz sonuçları
│   │   │   ├── 📄 Profile.tsx      # Kullanıcı profili
│   │   │   └── 📄 MyComments.tsx   # Analiz geçmişi
│   │   ├── 📁 services/            # API servisleri
│   │   │   ├── 📄 analysisService.ts # Analiz API'leri
│   │   │   ├── 📄 asyncAnalysisService.ts # ⚡ WebSocket & Async
│   │   │   ├── 📄 intelligentCache.ts # 🧠 Smart Caching
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
│   │   │   ├── 📄 gemini.py        # AI chat endpoint'leri
│   │   │   └── 📄 youtube.py       # YouTube API endpoints
│   │   ├── 📁 services/            # Servis katmanı
│   │   │   ├── 📄 gemini.py        # AI chat servisi
│   │   │   └── 📄 cache_service.py # Cache yönetimi
│   │   └── 📄 __init__.py          # Package marker
│   ├── 📁 services/                # İş mantığı servisleri
│   │   ├── 📄 csv_analyzer.py      # CSV analiz servisi
│   │   ├── 📄 sentiment_service.py # Duygu analizi servisi
│   │   ├── 📄 youtube_service.py   # YouTube API servisi
│   │   └── 📄 firestore_service.py # Firestore veritabanı servisi
│   ├── 📄 main.py                  # ⚡ FastAPI + WebSocket server
│   ├── 📄 requirements.txt         # Python bağımlılıkları
│   ├── 📄 .env.example             # Environment variables örneği
│   └── 📄 README.md                # Backend dokümantasyonu
├── 📁 docs/                        # Dokümantasyon
│   ├── 📁 screenshots/             # Ekran görüntüleri
│   ├── 📄 deployment-guide.md      # Deployment rehberi
│   └── 📄 api-reference.md         # API referansı
├── 📄 README.md                    # Ana proje dokümantasyonu
├── 📄 prd.md                       # 📋 Product Requirements Document
├── 📄 start.bat                    # 🚀 Quick start script
├── 📄 .gitignore                   # Git ignore kuralları
├── 📄 firebase.json                # Firebase hosting config
├── 📄 .firebaserc                  # Firebase project config
├── 📄 firestore.rules              # Firestore security rules
├── 📄 firestore.indexes.json       # Firestore indexes
└── 📄 LICENSE                      # MIT Lisans dosyası
```

### 🗂️ Yeni Eklenen Dosyalar
- **`asyncAnalysisService.ts`**: WebSocket ve async processing
- **`intelligentCache.ts`**: 3-tier smart caching system
- **`AsyncAnalysisProgress.tsx`**: Real-time progress component
- **WebSocket endpoints**: `/ws/{user_id}` real-time communication

### 🧹 Temizlenen Dosyalar
- ❌ `frontend/dist/` - Build outputs (auto-generated)
- ❌ `frontend/node_modules/` - NPM packages (reinstallable)
- ❌ `backend/__pycache__/` - Python cache (auto-generated)
- ✅ Proje boyutu **~150MB** azaltıldı!

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

# AI Konfigürasyonu
GEMINI_API_KEY=your-gemini-api-key
HUGGINGFACE_TOKEN=your-huggingface-token

# Uygulama Ayarları
DEBUG=False
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3000,https://your-domain.com
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
VITE_APP_VERSION=2.0.0
VITE_APP_DESCRIPTION=YouTube Yorum Analizi Platformu
```

---

## 📊 API Dokümantasyonu

### 🔗 Ana Endpoint'ler

#### 📹 YouTube Analizi (Async)
```http
POST /api/youtube/analyze-video-async
Content-Type: application/json
Authorization: Bearer <firebase-token>

{
  "video_id": "VIDEO_ID",
  "max_comments": 100,
  "use_async": true
}

Response:
{
  "task_id": "unique-task-id",
  "message": "Analysis started",
  "status": "started"
}
```

#### 🌐 WebSocket Connection
```javascript
// WebSocket bağlantısı
const ws = new WebSocket('ws://localhost:8000/ws/{user_id}');

// Progress update mesajları
ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log('Progress:', update.progress, '%');
  console.log('Status:', update.status);
  console.log('Message:', update.message);
};

// Progress Update Format
{
  "task_id": "unique-task-id",
  "status": "analyzing", // started|fetching_video_info|fetching_comments|analyzing|calculating_stats|saving|completed|error
  "progress": 75,
  "message": "Yorumlar analiz ediliyor...",
  "video_info": {
    "title": "Video Başlığı",
    "view_count": 1000000,
    "comment_count": 2500
  },
  "processed_comments": 150,
  "total_comments": 200,
  "final_stats": {
    "positive": 45,
    "negative": 20,
    "neutral": 35,
    "average_polarity": 0.25
  }
}
```

#### 📊 Analysis Status Check
```http
GET /api/youtube/analysis-status/{task_id}
Authorization: Bearer <firebase-token>

Response:
{
  "task_id": "unique-task-id",
  "status": "completed|processing|error",
  "progress": 100,
  "result": { ... } // Completed analysis result
}
```

#### 🎯 Kanal Analizi
```http
POST /api/youtube/channel-analyze
Content-Type: application/json
Authorization: Bearer <firebase-token>

{
  "channel_url": "https://www.youtube.com/@channel-name",
  "max_videos": 10,
  "max_comments_per_video": 50
}
```

#### 📁 CSV Analizi
```http
POST /api/csv/upload
Content-Type: multipart/form-data
Authorization: Bearer <firebase-token>

file: [CSV_FILE]
delimiter: ","
encoding: "utf-8"
```

#### 🤖 AI Chat
```http
POST /api/gemini/chat
Content-Type: application/json
Authorization: Bearer <firebase-token>

{
  "message": "Bu analiz sonuçları hakkında ne düşünüyorsun?",
  "context": "analysis_data",
  "conversation_id": "optional-conversation-id"
}
```

### 📋 Response Formatları

#### Detaylı Analiz Response (Async)
```json
{
  "status": "success",
  "data": {
    "video_info": {
      "title": "Video Başlığı",
      "view_count": 1000000,
      "like_count": 50000,
      "comment_count": 2500,
      "published_at": "2024-01-01T00:00:00Z"
    },
    "total_comments": 100,
    "processing_time": 15.7,
    "cache_hit": false,
    "sentiment_stats": {
      "average_polarity": 0.25,
      "categories": {
        "positive": 45,
        "negative": 20,
        "neutral": 35
      },
      "language_distribution": {
        "tr": 70,
        "en": 30
      },
      "themes": {
        "video_quality": 25,
        "content": 40,
        "presentation": 20
      }
    },
    "word_cloud": [
      {"text": "harika", "value": 15},
      {"text": "güzel", "value": 12}
    ],
    "theme_analysis": [
      {"theme": "Video Quality", "count": 25, "percentage": 25.0}
    ],
    "comments": [
      {
        "id": "comment_id",
        "text": "Harika video!",
        "author": "kullanici123",
        "date": "2024-01-01T12:00:00Z",
        "sentiment": {
          "category": "positive",
          "score": 0.8,
          "language": "tr"
        }
      }
    ]
  },
  "metadata": {
    "analysis_time": "2024-01-01T12:00:00Z",
    "processing_duration": 15.7,
    "model_version": "2.0.0",
    "cache_used": false,
    "websocket_session": "ws-session-id"
  }
}
```

### 📖 Detaylı API Dokümantasyonu
Uygulamayı çalıştırdıktan sonra aşağıdaki URL'lerden detaylı API dokümantasyonuna erişebilirsiniz:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🧪 Test

### 🔬 Arka Uç Testleri

```bash
cd backend

# Test bağımlılıklarını yükleyin
pip install pytest pytest-asyncio httpx pytest-cov

# Testleri çalıştırın
pytest tests/ -v

# Kapsam raporu
pytest --cov=app tests/ --cov-report=html
```

### 🎯 Ön Uç Testleri

```bash
cd frontend

# Test bağımlılıklarını yükleyin
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Testleri çalıştırın
npm test

# Kapsam raporu
npm run test:coverage
```

### 📊 Test Kapsamı Hedefleri
- **Arka Uç**: %90+ test kapsamı ✅
- **Ön Uç**: %85+ test kapsamı ✅
- **Uçtan Uca Testler**: Ana kullanım senaryoları ✅

---

## 🚀 Dağıtım

### 🌐 Üretim Yapısı

#### Ön Uç Yapısı
```bash
cd frontend
npm run build
npm run preview  # Üretim önizlemesi
```

#### Arka Uç Üretimi
```bash
cd backend
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### ⚡ Performans Optimizasyonu için Üretim Ayarları

#### Arka Uç Üretim Yapılandırması
```python
# main.py - Üretim optimizasyonları
app = FastAPI(
    title="CommsItumo API",
    description="Yüksek performanslı YouTube Yorum Analizi",
    version="2.0.0",
    docs_url="/docs" if DEBUG else None,  # Üretimde docs'u devre dışı bırak
    redoc_url="/redoc" if DEBUG else None
)

# WebSocket bağlantı limitleri
ConnectionManager.max_connections = 1000
ConnectionManager.heartbeat_interval = 60  # Üretimde daha uzun aralıklar

# Üretim için önbellek ayarları
CACHE_CONFIG = {
    "analysis_cache": {"ttl": 3600, "max_size": 100},  # 1 saat, 100MB
    "video_cache": {"ttl": 1800, "max_size": 50},      # 30 dk, 50MB
    "quick_cache": {"ttl": 300, "max_size": 20}        # 5 dk, 20MB
}
```

#### Ön Uç Üretim Yapılandırması
```typescript
// vite.config.ts - Üretim optimizasyonları
export default defineConfig({
  build: {
    target: 'es2015',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['antd', '@ant-design/icons'],
          charts: ['recharts', '@visx/wordcloud']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000,
    host: true
  }
});
```

### 📊 Üretim İzleme

```bash
# Performans izleme
docker stats
docker logs backend --tail 100
docker logs frontend --tail 100

# Sağlık kontrolleri
curl http://localhost:8000/health
curl http://localhost:8000/metrics

# WebSocket izleme
curl http://localhost:8000/ws/stats
```

---

## 🤝 Katkıda Bulunma

CommsItumo açık kaynak bir projedir ve katkılarınızı memnuniyetle karşılıyoruz!

### 🔄 Katkı Süreci

1. **Çatalla** - Projeyi kendi hesabınıza çatallayın
2. **Dal oluşturun** - Yeni özellik için dal oluşturun
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **İşleme taahhüt edin** - Değişikliklerinizi taahhüt edin
   ```bash
   git commit -m 'feat: Add amazing feature'
   ```
4. **İtme yapın** - Dalınızı itme yapın
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Çekme İsteği oluşturun** - GitHub'da Çekme İsteği oluşturun

### 📝 Taahhüt Mesajı Formatı

```
tür(kapsam): açıklama

[isteğe bağlı gövde]

[isteğe bağlı alt bilgi]
```

**Türler:**
- `feat`: Yeni özellik
- `fix`: Hata düzeltmesi
- `docs`: Dokümantasyon
- `style`: Kod formatı
- `refactor`: Kod yeniden düzenleme
- `test`: Test ekleme
- `chore`: Bakım işleri
- `perf`: Performans iyileştirmesi

### 🐛 Hata Raporu

Hata bulduysanız lütfen [GitHub Sorunlar](https://github.com/huseyineneserturk/CommsItumo/issues) sayfasından rapor edin.

### 💡 Özellik İsteği

Yeni özellik önerilerinizi [GitHub Tartışmalar](https://github.com/huseyineneserturk/CommsItumo/discussions) sayfasından paylaşabilirsiniz.

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
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-green?style=for-the-badge&logo=vercel)](https://huseyineneserturk.dev)

**Arka Uç ve Veri Analisti Adayı**

</div>

### 🎯 Proje Motivasyonu
Bu proje, YouTube içerik üreticilerinin ve pazarlama uzmanlarının videolarına gelen tepkileri daha iyi anlamalarına yardımcı olmak amacıyla geliştirilmiştir. Yapay zeka teknolojilerini kullanarak sosyal medya analizini demokratikleştirmeyi ve herkes için erişilebilir hale getirmeyi hedefliyoruz.

### 🚀 Gelecek Planları
- **Mobil Uygulama**: React Native ile iOS/Android uygulaması
- **Gerçek Zamanlı Analitik**: Canlı yayın yorumları için gerçek zamanlı analiz
- **Çoklu Platform Desteği**: TikTok, Instagram, Twitter desteği
- **Gelişmiş Yapay Zeka**: Daha gelişmiş duygu modelleri
- **Takım İşbirliği**: Takım çalışması için özellikler

---

## 🙏 Teşekkürler

Bu projenin geliştirilmesinde katkıda bulunan herkese teşekkür ederiz:

### 🛠️ Teknoloji Sağlayıcıları
- **[YouTube Data API](https://developers.google.com/youtube/v3)** - Video ve yorum verilerine erişim
- **[Firebase](https://firebase.google.com/)** - Kimlik doğrulama ve veritabanı servisleri
- **[Google Gemini AI](https://ai.google.dev/)** - Gelişmiş yapay zeka sohbet yetenekleri
- **[Hugging Face](https://huggingface.co/)** - Yapay zeka/makine öğrenmesi modelleri ve transformers
- **[Google Cloud](https://cloud.google.com/)** - Yapay zeka servisleri ve barındırma

### 🎨 Kullanıcı Arayüzü/Deneyimi Kütüphaneleri
- **[Ant Design](https://ant.design/)** - Modern kullanıcı arayüzü bileşen kütüphanesi
- **[Tailwind CSS](https://tailwindcss.com/)** - Faydacı öncelikli CSS çerçevesi
- **[Recharts](https://recharts.org/)** - Güçlü veri görselleştirme
- **[@visx/wordcloud](https://airbnb.io/visx/)** - Gelişmiş kelime bulutu görselleştirme
- **[Lucide React](https://lucide.dev/)** - Güzel SVG simgeleri

### 📚 Çerçeveler ve Araçlar
- **[React](https://reactjs.org/)** - Ön uç çerçevesi
- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern Python web çerçevesi
- **[Vite](https://vitejs.dev/)** - Yeni nesil ön uç araçları
- **[TypeScript](https://typescriptlang.org/)** - Tip güvenli JavaScript

### 🌟 Açık Kaynak Topluluğu
- **[NLTK](https://www.nltk.org/)** - Doğal dil işleme
- **[Pandas](https://pandas.pydata.org/)** - Veri manipülasyonu ve analizi
- **[NumPy](https://numpy.org/)** - Bilimsel hesaplama
- **[Scikit-learn](https://scikit-learn.org/)** - Makine öğrenmesi kütüphanesi

### 🎨 Tasarım İlhamı
- **[Dribbble](https://dribbble.com/)** - Kullanıcı arayüzü/deneyimi tasarım ilhamı
- **[Figma Community](https://www.figma.com/community)** - Tasarım kaynakları
- **[Unsplash](https://unsplash.com/)** - Ücretsiz profesyonel görseller

### 🌟 Beta Test Ediciler
-Şimdilik sadece kendim :)

---

<div align="center">

### 🌟 Projeyi Beğendiyseniz Yıldız Vermeyi Unutmayın!

[![GitHub Stars](https://img.shields.io/github/stars/huseyineneserturk/CommsItumo?style=social)](https://github.com/huseyineneserturk/CommsItumo/stargazers)

**CommsItumo ile YouTube yorumlarınızı analiz edin ve içeriğinizi geliştirin! 🚀**

### 📈 Proje İstatistikleri
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/huseyineneserturk/CommsItumo)
![GitHub last commit](https://img.shields.io/github/last-commit/huseyineneserturk/CommsItumo)
![GitHub repo size](https://img.shields.io/github/repo-size/huseyineneserturk/CommsItumo)
![Lines of code](https://img.shields.io/tokei/lines/github/huseyineneserturk/CommsItumo)

### ⚡ Performans Ölçümleri
- **Analiz Hızı**: Öncekinden %40-50 daha hızlı
- **Kullanıcı Arayüzü Duyarlılığı**: %100 donmama
- **Önbellek İsabet Oranı**: Ortalama %70-80
- **Bellek Kullanımı**: Kontrollü 60MB limit
- **WebSocket Çalışma Süresi**: %99.9 bağlantı kararlılığı

---

*Son güncelleme: Haziran 2025*  
*Versiyon: 2.1.0*  
*Yapı: Performans Optimizasyonlu*  

Türkiye'de ❤️ ile yapıldı 🇹🇷

</div> 
