# CommsItumo - YouTube Yorum Analizi Platformu

YouTube videolarının yorumlarını analiz eden, duygu analizi ve tema tespiti yapan modern web uygulaması.

## 🚀 Özellikler

- **YouTube Video Analizi**: Video URL'si ile otomatik yorum çekme
- **CSV Upload**: Kendi yorum verilerinizi yükleyerek analiz
- **Duygu Analizi**: Türkçe ve İngilizce yorumlar için AI destekli duygu analizi
- **Tema Analizi**: Yorumların hangi konularda odaklandığını tespit etme
- **Kelime Bulutu**: En sık kullanılan kelimelerin görselleştirilmesi
- **Kullanıcı Profili**: Analiz geçmişi ve istatistikler
- **Firebase Entegrasyonu**: Güvenli kullanıcı yönetimi ve veri saklama

## 🛠️ Teknolojiler

### Frontend
- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **Ant Design** (UI Framework)
- **Tailwind CSS** (Styling)
- **Recharts** (Data visualization)
- **Firebase** (Authentication & Database)

### Backend
- **FastAPI** (Python)
- **Transformers** (AI/ML models)
- **NLTK** (Natural Language Processing)
- **Firebase Admin** (Database)

## 🌐 Deploy

### Netlify (Frontend)

1. **Repository'yi GitHub'a push edin**
2. **Netlify Dashboard'a gidin**: https://app.netlify.com
3. **"New site from Git"** seçin
4. **GitHub repository'nizi seçin**
5. **Build ayarları**:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`
   - Node version: `18`

6. **Environment Variables** (Netlify Dashboard > Site Settings > Environment Variables):
   ```
   VITE_API_URL=https://your-backend-url.com
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

### Backend Deploy Seçenekleri

1. **Railway**: https://railway.app
2. **Render**: https://render.com
3. **Heroku**: https://heroku.com
4. **DigitalOcean App Platform**

## 📁 Proje Yapısı

```
CommsItumo/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   └── types/          # TypeScript types
│   ├── public/             # Static assets
│   └── dist/               # Build output
├── backend/                 # FastAPI backend
│   ├── app/                # FastAPI app
│   ├── services/           # Business logic
│   └── models/             # AI models
├── netlify.toml            # Netlify configuration
└── README.md
```

## 🔧 Geliştirme

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

## 📊 Analiz Özellikleri

- **Duygu Kategorileri**: Pozitif, Negatif, Nötr
- **Tema Kategorileri**: İçerik kalitesi, Sunum tarzı, Video düzeni, vb.
- **Dil Desteği**: Türkçe ve İngilizce
- **Görselleştirme**: Pasta grafikleri, Bar grafikleri, Kelime bulutu

## 🔒 Güvenlik

- Firebase Authentication
- CORS koruması
- Input validation
- Rate limiting

## 📄 Lisans

MIT License

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun 