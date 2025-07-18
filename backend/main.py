from fastapi import FastAPI, HTTPException, Depends, Header, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from services.youtube_service import YouTubeService
from typing import List, Dict, Any
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import auth, credentials
from google.auth.transport.requests import Request
import json
from pathlib import Path
from services.sentiment_service import sentiment_service
from pydantic import BaseModel
from app.routers import csv_router, gemini
import asyncio
import uuid
from datetime import datetime

load_dotenv()

# Firebase Admin SDK'yı başlat
if not firebase_admin._apps:
    cred = credentials.Certificate('firebase-credentials.json')
    firebase_admin.initialize_app(cred)

app = FastAPI(title="CommsItumo API")

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        print(f"✅ WebSocket bağlantısı kuruldu: {user_id}")

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            print(f"❌ WebSocket bağlantısı kapandı: {user_id}")

    async def send_progress(self, user_id: str, message: dict):
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_text(json.dumps(message))
                print(f"📤 Progress gönderildi {user_id}: {message.get('message', '')}")
            except Exception as e:
                print(f"⚠️ Progress gönderilemedi {user_id}: {e}")
                self.disconnect(user_id)

# Global connection manager
manager = ConnectionManager()

# Background task storage
background_tasks_storage: Dict[str, Dict] = {}

# User modeli
class User(BaseModel):
    uid: str
    email: str
    display_name: str = None

class AsyncVideoAnalysisRequest(BaseModel):
    video_id: str
    max_comments: int = 100
    use_async: bool = True

# Kimlik doğrulama fonksiyonu
async def get_current_user(authorization: str = Header(None)) -> User:
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Kimlik doğrulama gerekli"
        )
    
    try:
        # Bearer token'dan token'ı ayıkla
        token = authorization.split("Bearer ")[1]
        
        # Firebase ile token'ı doğrula
        decoded_token = auth.verify_id_token(token)
        
        # Kullanıcı bilgilerini döndür
        return User(
            uid=decoded_token["uid"],
            email=decoded_token["email"],
            display_name=decoded_token.get("name")
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Geçersiz token: {str(e)}"
        )

# YouTube servisini başlat
youtube_service = None
youtube_credentials = None
CREDENTIALS_FILE = Path('youtube_credentials.json')

# Global SentimentService instance'ını kullan (modellerin tekrar yüklenmesini engeller)

def save_credentials(credentials):
    """Kimlik bilgilerini dosyaya kaydeder."""
    cred_dict = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }
    with open(CREDENTIALS_FILE, 'w') as f:
        json.dump(cred_dict, f)

def load_credentials():
    """Kaydedilmiş kimlik bilgilerini yükler."""
    if not CREDENTIALS_FILE.exists():
        return None
        
    with open(CREDENTIALS_FILE, 'r') as f:
        cred_dict = json.load(f)
        
    return Credentials(
        token=cred_dict['token'],
        refresh_token=cred_dict['refresh_token'],
        token_uri=cred_dict['token_uri'],
        client_id=cred_dict['client_id'],
        client_secret=cred_dict['client_secret'],
        scopes=cred_dict['scopes']
    )

# OAuth2 akışını başlat
flow = Flow.from_client_secrets_file(
    'client_secrets.json',
    scopes=[
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.force-ssl'
    ],
    redirect_uri='http://localhost:5173/callback'
)

async def verify_firebase_token(authorization: str = Header(...)):
    try:
        if not authorization.startswith('Bearer '):
            raise HTTPException(status_code=401, detail="Geçersiz token formatı")
            
        token = authorization.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(token)
        
        if not decoded_token:
            raise HTTPException(status_code=401, detail="Token doğrulanamadı")
            
        return decoded_token
    except Exception as e:
        print(f"Token doğrulama hatası: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Token doğrulama hatası: {str(e)}")

@app.get("/auth/google")
async def google_auth():
    """Google OAuth2 URL'ini döndürür."""
    try:
        print("Google OAuth2 URL'i oluşturuluyor...")
        auth_url, _ = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent'
        )
        print(f"Google OAuth2 URL'i: {auth_url}")
        return {"auth_url": auth_url}
    except Exception as e:
        print(f"Google auth URL oluşturma hatası: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/auth/google/callback")
async def google_auth_callback(code: str):
    """Google OAuth2 callback endpoint'i."""
    try:
        print("Google OAuth2 callback işleniyor...")
        print(f"Authorization code: {code}")
        
        flow.fetch_token(code=code)
        credentials = flow.credentials
        
        print("Google OAuth2 token'ları alındı")
        print(f"Access token: {credentials.token}")
        print(f"Refresh token: {credentials.refresh_token}")
        
        # Kimlik bilgilerini kaydet
        save_credentials(credentials)
        
        global youtube_service, youtube_credentials
        youtube_credentials = credentials
        youtube_service = YouTubeService(credentials)
        print("YouTube servisi başarıyla başlatıldı")
        
        return {"message": "YouTube kimlik doğrulaması başarılı"}
    except Exception as e:
        print(f"Google auth callback hatası: {str(e)}")
        import traceback
        print(f"Stack trace: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/youtube/channel")
async def get_channel_info():
    """Kullanıcının YouTube kanal bilgilerini döndürür."""
    try:
        global youtube_service, youtube_credentials
        
        # Eğer servis yoksa, kaydedilmiş kimlik bilgilerini yükle
        if not youtube_service or not youtube_credentials:
            credentials = load_credentials()
            if credentials:
                youtube_credentials = credentials
                youtube_service = YouTubeService(credentials)
            else:
                print("YouTube servisi veya kimlik bilgileri bulunamadı")
                raise HTTPException(status_code=401, detail="YouTube kimlik doğrulaması gerekli")
            
        # Token'ın geçerliliğini kontrol et
        if youtube_credentials.expired:
            print("Token süresi dolmuş, yeniliyor...")
            youtube_credentials.refresh(Request())
            save_credentials(youtube_credentials)  # Yenilenen token'ı kaydet
            youtube_service = YouTubeService(youtube_credentials)
            
        channel_info = await youtube_service.get_channel_info()
        return channel_info
    except Exception as e:
        print(f"Kanal bilgileri alınırken hata: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/youtube/videos", response_model=List[Dict[str, Any]])
async def get_channel_videos(max_results: int = 50):
    if not youtube_service:
        raise HTTPException(status_code=401, detail="YouTube kimlik doğrulaması gerekli")
    try:
        videos = await youtube_service.get_channel_videos(max_results)
        return videos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/youtube/comments/{video_id}", response_model=List[Dict[str, Any]])
async def get_video_comments(video_id: str, max_results: int = 100):
    if not youtube_service:
        raise HTTPException(status_code=401, detail="YouTube kimlik doğrulaması gerekli")
    try:
        comments = await youtube_service.get_video_comments(video_id, max_results)
        return comments
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/youtube/recent-comments", response_model=List[Dict[str, Any]])
async def get_recent_comments(days: int = 30):
    if not youtube_service:
        raise HTTPException(status_code=401, detail="YouTube kimlik doğrulaması gerekli")
    try:
        print("YouTube servisi başlatılıyor...")
        comments = await youtube_service.get_recent_comments(days)
        print(f"Toplam {len(comments)} yorum alındı")
        return comments
    except Exception as e:
        print(f"Yorumlar alınırken hata: {str(e)}")
        import traceback
        print(f"Stack trace: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sentiment/analysis")
async def get_sentiment_analysis():
    try:
        # YouTube yorumlarını al
        comments = await youtube_service.get_recent_comments()
        
        # Yorumları analiz et
        analyzed_comments = sentiment_service.analyze_comments(comments)
        
        # İstatistikleri hesapla
        sentiment_stats = sentiment_service.get_sentiment_stats(analyzed_comments)
        
        # Kelime bulutu oluştur
        word_cloud = sentiment_service.get_word_cloud(analyzed_comments)
        
        return {
            "comments": analyzed_comments,
            "sentiment_stats": sentiment_stats,
            "word_cloud": word_cloud
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# YouTube analiz endpoint'leri
class VideoAnalysisRequest(BaseModel):
    video_id: str
    max_comments: int = 100

class ChannelAnalysisRequest(BaseModel):
    max_videos: int = 10
    max_comments_per_video: int = 50

@app.post("/api/youtube/analyze-video")
async def analyze_video_comments(
    request: VideoAnalysisRequest,
    current_user: User = Depends(get_current_user)
):
    """Belirli bir YouTube videosunun yorumlarını analiz eder"""
    try:
        global youtube_service, youtube_credentials
        
        # YouTube servisini kontrol et
        if not youtube_service or not youtube_credentials:
            credentials = load_credentials()
            if credentials:
                youtube_credentials = credentials
                youtube_service = YouTubeService(credentials)
            else:
                raise HTTPException(status_code=401, detail="YouTube kimlik doğrulaması gerekli")
        
        # Token'ın geçerliliğini kontrol et
        if youtube_credentials.expired:
            youtube_credentials.refresh(Request())
            save_credentials(youtube_credentials)
            youtube_service = YouTubeService(youtube_credentials)
        
        # Video analizini yap
        result = await youtube_service.analyze_video_comments(
            request.video_id,
            current_user.uid,
            request.max_comments
        )
        
        return result
        
    except Exception as e:
        print(f"Video analizi hatası: {str(e)}")
        import traceback
        print(f"Stack trace: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/youtube/analyze-channel")
async def analyze_channel_comments(
    request: ChannelAnalysisRequest,
    current_user: User = Depends(get_current_user)
):
    """Kanalın son videolarının yorumlarını analiz eder"""
    try:
        global youtube_service, youtube_credentials
        
        # YouTube servisini kontrol et
        if not youtube_service or not youtube_credentials:
            credentials = load_credentials()
            if credentials:
                youtube_credentials = credentials
                youtube_service = YouTubeService(credentials)
            else:
                raise HTTPException(status_code=401, detail="YouTube kimlik doğrulaması gerekli")
        
        # Token'ın geçerliliğini kontrol et
        if youtube_credentials.expired:
            youtube_credentials.refresh(Request())
            save_credentials(youtube_credentials)
            youtube_service = YouTubeService(youtube_credentials)
        
        # Kanal analizini yap
        result = await youtube_service.analyze_channel_comments(
            current_user.uid,
            request.max_videos,
            request.max_comments_per_video
        )
        
        return result
        
    except Exception as e:
        print(f"Kanal analizi hatası: {str(e)}")
        import traceback
        print(f"Stack trace: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/youtube/analysis-history")
async def get_analysis_history(
    limit: int = 10,
    current_user: User = Depends(get_current_user)
):
    """Kullanıcının analiz geçmişini getirir"""
    try:
        global youtube_service
        
        if not youtube_service:
            # YouTube servisi olmasa bile analiz geçmişini getirebiliriz
            from services.firestore_service import firestore_service
            return await firestore_service.get_user_analyses(current_user.uid, limit)
        
        result = await youtube_service.get_user_analysis_history(current_user.uid, limit)
        return result
        
    except Exception as e:
        print(f"Analiz geçmişi hatası: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/youtube/analysis/{analysis_id}")
async def get_analysis_detail(
    analysis_id: str,
    current_user: User = Depends(get_current_user)
):
    """Belirli bir analizin detaylarını getirir"""
    try:
        from services.firestore_service import firestore_service
        
        # Analizi getir
        analysis = await firestore_service.get_analysis_by_id(analysis_id)
        
        if not analysis:
            raise HTTPException(status_code=404, detail="Analiz bulunamadı")
        
        # Kullanıcının analizine erişim kontrolü
        if analysis.get('userId') != current_user.uid:
            raise HTTPException(status_code=403, detail="Bu analiz size ait değil")
        
        return analysis
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Analiz detayı hatası: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/profile/user-info")
async def get_user_profile_info(
    current_user: User = Depends(get_current_user)
):
    """Kullanıcının profil bilgilerini getirir"""
    try:
        global youtube_service, youtube_credentials
        
        # YouTube servisini kontrol et
        if not youtube_service or not youtube_credentials:
            credentials = load_credentials()
            if credentials:
                youtube_credentials = credentials
                youtube_service = YouTubeService(credentials)
            else:
                raise HTTPException(status_code=401, detail="YouTube kimlik doğrulaması gerekli")
        
        # Token'ın geçerliliğini kontrol et
        if youtube_credentials.expired:
            youtube_credentials.refresh(Request())
            save_credentials(youtube_credentials)
            youtube_service = YouTubeService(youtube_credentials)
        
        # YouTube kanal bilgilerini getir
        channel_info = await youtube_service.get_channel_info()
        
        # Firebase kullanıcı bilgileri ile birleştir
        profile_info = {
            "uid": current_user.uid,
            "email": current_user.email,
            "displayName": current_user.display_name,
            "channelInfo": channel_info
        }
        
        return profile_info
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Profil bilgisi getirme hatası: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Profil bilgisi getirilemedi: {str(e)}")

@app.get("/api/profile/channel-stats")
async def get_channel_statistics(
    current_user: User = Depends(get_current_user)
):
    """Kullanıcının YouTube kanal istatistiklerini getirir"""
    try:
        global youtube_service, youtube_credentials
        
        # YouTube servisini kontrol et
        if not youtube_service or not youtube_credentials:
            credentials = load_credentials()
            if credentials:
                youtube_credentials = credentials
                youtube_service = YouTubeService(credentials)
            else:
                raise HTTPException(status_code=401, detail="YouTube kimlik doğrulaması gerekli")
        
        # Token'ın geçerliliğini kontrol et
        if youtube_credentials.expired:
            youtube_credentials.refresh(Request())
            save_credentials(youtube_credentials)
            youtube_service = YouTubeService(youtube_credentials)
        
        # Kanal istatistiklerini getir
        channel_stats = await youtube_service.get_channel_statistics()
        
        return channel_stats
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Kanal istatistikleri getirme hatası: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Kanal istatistikleri getirilemedi: {str(e)}")

@app.get("/api/profile/analysis-summary")
async def get_user_analysis_summary(
    current_user: User = Depends(get_current_user)
):
    """Kullanıcının analiz özetini getirir"""
    try:
        from services.firestore_service import firestore_service
        
        # Kullanıcı analiz özetini getir
        analysis_summary = await firestore_service.get_user_stats(current_user.uid)
        
        return analysis_summary
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Analiz özeti getirme hatası: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analiz özeti getirilemedi: {str(e)}")

@app.get("/")
async def root():
    return {"message": "CommsItumo API'ye Hoş Geldiniz!"}

# Router'ları ekle
app.include_router(csv_router.router, prefix="/api/csv", tags=["csv"])
app.include_router(gemini.router, prefix="/api/gemini", tags=["gemini"])

# WebSocket endpoint
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            # WebSocket mesajlarını dinle
            data = await websocket.receive_text()
            
            try:
                message = json.loads(data)
                if message.get('type') == 'ping':
                    # Ping mesajına pong ile yanıt ver
                    await websocket.send_text(json.dumps({'type': 'pong', 'timestamp': datetime.now().isoformat()}))
                    print(f"🏓 Ping-pong: {user_id}")
                else:
                    # Diğer mesajlar için echo
                    await websocket.send_text(f"Echo: {data}")
            except json.JSONDecodeError:
                # JSON olmayan mesajlar için echo
                await websocket.send_text(f"Echo: {data}")
                
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        print(f"🔌 WebSocket disconnected: {user_id}")

# Background task için async video analysis
async def background_video_analysis(
    video_id: str, 
    user_id: str, 
    max_comments: int,
    task_id: str
):
    """Background'da video analizi yapar ve progress bilgisi gönderir"""
    try:
        global youtube_service
        
        if not youtube_service:
            raise Exception("YouTube service bulunamadı")
        
        # İlk durum güncelleme
        await manager.send_progress(user_id, {
            "task_id": task_id,
            "status": "started",
            "progress": 0,
            "message": "Video analizi başlatıldı...",
            "step": "Başlatılıyor"
        })
        
        # Video bilgilerini al
        await manager.send_progress(user_id, {
            "task_id": task_id,
            "status": "fetching_video_info",
            "progress": 10,
            "message": "Video bilgileri alınıyor...",
            "step": "Video Bilgileri"
        })
        
        video_info = await youtube_service.get_video_info(video_id)
        if not video_info:
            raise Exception(f"Video bilgileri alınamadı: {video_id}")
        
        # Yorumları al
        await manager.send_progress(user_id, {
            "task_id": task_id,
            "status": "fetching_comments",
            "progress": 25,
            "message": f"Yorumlar alınıyor... (Max {max_comments})",
            "step": "Yorumlar",
            "video_info": {
                "title": video_info.get('title', 'Bilinmeyen Video'),
                "view_count": video_info.get('view_count', 0),
                "comment_count": video_info.get('comment_count', 0)
            }
        })
        
        comments = await youtube_service.get_video_comments(video_id, max_comments)
        if not comments:
            result = {
                'video_id': video_id,
                'video_title': video_info.get('title', 'Bilinmeyen Video'),
                'video_info': video_info,
                'total_comments': 0,
                'analysis_id': None,
                'message': 'Analiz edilecek yorum bulunamadı'
            }
            background_tasks_storage[task_id] = {"status": "completed", "result": result}
            await manager.send_progress(user_id, {
                "task_id": task_id,
                "status": "completed",
                "progress": 100,
                "message": "Analiz tamamlandı - Yorum bulunamadı",
                "step": "Tamamlandı",
                "result": result
            })
            return
        
        # Yorumları analiz et - Progress tracking ile
        await manager.send_progress(user_id, {
            "task_id": task_id,
            "status": "analyzing", 
            "progress": 40,
            "message": f"Yorumlar analiz ediliyor... ({len(comments)} yorum)",
            "step": "Sentiment Analizi",
            "comments_found": len(comments)
        })
        
        # Sentiment service kontrolü
        if not youtube_service.sentiment_enabled or not youtube_service.sentiment_service:
            raise Exception("Sentiment servis aktif değil")
        
        # Batch processing ile analiz
        chunk_size = 20
        analyzed_comments = []
        total_chunks = len(comments) // chunk_size + (1 if len(comments) % chunk_size else 0)
        
        for i in range(0, len(comments), chunk_size):
            chunk = comments[i:i + chunk_size]
            chunk_analyzed = youtube_service.sentiment_service.analyze_comments(chunk)
            analyzed_comments.extend(chunk_analyzed)
            
            # Progress update
            current_chunk = i // chunk_size + 1
            progress = 40 + (current_chunk / total_chunks) * 30
            await manager.send_progress(user_id, {
                "task_id": task_id,
                "status": "analyzing",
                "progress": int(progress),
                "message": f"Analiz ediliyor... ({current_chunk}/{total_chunks} batch) - {len(analyzed_comments)} yorum tamamlandı",
                "step": "Sentiment Analizi",
                "processed_comments": len(analyzed_comments),
                "total_comments": len(comments)
            })
            
            # Kısa bekleme
            await asyncio.sleep(0.1)
        
        # İstatistikleri hesapla
        await manager.send_progress(user_id, {
            "task_id": task_id,
            "status": "calculating_stats",
            "progress": 80,
            "message": "İstatistikler hesaplanıyor...",
            "step": "İstatistikler"
        })
        
        sentiment_stats = youtube_service.sentiment_service.get_sentiment_stats(analyzed_comments)
        word_cloud = youtube_service.sentiment_service.get_word_cloud(analyzed_comments)
        
        # Firestore'a kaydet
        await manager.send_progress(user_id, {
            "task_id": task_id,
            "status": "saving",
            "progress": 95,
            "message": "Sonuçlar kaydediliyor...",
            "step": "Kaydetme"
        })
        
        analysis_result = {
            'video_id': video_id,
            'video_title': video_info.get('title', 'Bilinmeyen Video'),
            'sentiment_stats': sentiment_stats,
            'word_cloud': word_cloud,
            'comments': analyzed_comments
        }
        
        analysis_id = None
        if youtube_service.sentiment_service.firestore_enabled and youtube_service.sentiment_service.firestore_service:
            analysis_id = await youtube_service.sentiment_service.firestore_service.save_analysis(
                analysis_result, user_id
            )
        
        # Sonucu hazırla
        result = {
            'video_id': video_id,
            'video_title': video_info.get('title'),
            'video_info': video_info,
            'analysis_id': analysis_id,
            'total_comments': len(analyzed_comments),
            'sentiment_stats': sentiment_stats,
            'word_cloud': word_cloud[:10],
            'comments': analyzed_comments,
            'analysis_summary': {
                'dominant_sentiment': youtube_service._get_dominant_sentiment(sentiment_stats['categories']),
                'average_polarity': sentiment_stats['average_polarity'],
                'language_distribution': sentiment_stats['language_distribution']
            }
        }
        
        background_tasks_storage[task_id] = {"status": "completed", "result": result}
        
        # Tamamlandı mesajı
        await manager.send_progress(user_id, {
            "task_id": task_id,
            "status": "completed",
            "progress": 100,
            "message": f"Analiz tamamlandı! {len(analyzed_comments)} yorum analiz edildi.",
            "step": "Tamamlandı",
            "result": result,
            "final_stats": {
                "positive": sentiment_stats['categories']['positive'],
                "negative": sentiment_stats['categories']['negative'],
                "neutral": sentiment_stats['categories']['neutral'],
                "average_polarity": sentiment_stats['average_polarity']
            }
        })
        
    except Exception as e:
        error_msg = f"Analiz hatası: {str(e)}"
        print(f"❌ Background analysis error: {error_msg}")
        background_tasks_storage[task_id] = {"status": "error", "error": error_msg}
        await manager.send_progress(user_id, {
            "task_id": task_id,
            "status": "error",
            "progress": 0,
            "message": error_msg,
            "step": "Hata"
        })

@app.post("/api/youtube/analyze-video-async")
async def analyze_video_async(
    request: AsyncVideoAnalysisRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """Asenkron video analizi başlatır"""
    try:
        global youtube_service, youtube_credentials
        
        if not youtube_service or not youtube_credentials:
            credentials = load_credentials()
            if credentials:
                youtube_credentials = credentials
                youtube_service = YouTubeService(credentials)
            else:
                raise HTTPException(status_code=401, detail="YouTube kimlik doğrulaması gerekli")
        
        if youtube_credentials.expired:
            youtube_credentials.refresh(Request())
            save_credentials(youtube_credentials)
            youtube_service = YouTubeService(youtube_credentials)
        
        # Task ID oluştur
        task_id = str(uuid.uuid4())
        
        # Background task başlat
        background_tasks.add_task(
            background_video_analysis,
            request.video_id,
            current_user.uid,
            request.max_comments,
            task_id
        )
        
        return {
            "task_id": task_id,
            "message": "Async analiz başlatıldı",
            "status": "started"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/youtube/analysis-status/{task_id}")
async def get_analysis_status(task_id: str):
    """Background task durumunu kontrol eder"""
    if task_id in background_tasks_storage:
        return background_tasks_storage[task_id]
    else:
        return {"status": "not_found", "message": "Task bulunamadı"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 