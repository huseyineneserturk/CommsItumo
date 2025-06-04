interface ProgressUpdate {
  task_id: string;
  status: 'started' | 'fetching_video_info' | 'fetching_comments' | 'analyzing' | 'calculating_stats' | 'saving' | 'completed' | 'error';
  progress: number;
  message: string;
  step?: string;
  result?: any;
  video_info?: {
    title: string;
    view_count: number;
    comment_count: number;
  };
  comments_found?: number;
  processed_comments?: number;
  total_comments?: number;
  final_stats?: {
    positive: number;
    negative: number;
    neutral: number;
    average_polarity: number;
  };
}

interface AsyncAnalysisResult {
  task_id: string;
  message: string;
  status: string;
}

class AsyncAnalysisService {
  private ws: WebSocket | null = null;
  private progressCallbacks: Map<string, (progress: ProgressUpdate) => void> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private currentUserId: string | null = null;
  private isConnecting = false;
  private connectionPromise: Promise<void> | null = null;
  private lastActivity = Date.now();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  // Global WebSocket connection durumu
  private static instance: AsyncAnalysisService | null = null;
  
  constructor() {
    if (AsyncAnalysisService.instance) {
      return AsyncAnalysisService.instance;
    }
    AsyncAnalysisService.instance = this;
    
    // Heartbeat başlat
    this.startHeartbeat();
  }

  // Singleton instance getter
  static getInstance(): AsyncAnalysisService {
    if (!AsyncAnalysisService.instance) {
      AsyncAnalysisService.instance = new AsyncAnalysisService();
    }
    return AsyncAnalysisService.instance;
  }

  // Heartbeat sistem - bağlantının canlı kalmasını sağlar
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected()) {
        // Son aktiviteden 5 dakika geçtiyse ping gönder
        if (Date.now() - this.lastActivity > 5 * 60 * 1000) {
          try {
            this.ws?.send(JSON.stringify({ type: 'ping' }));
            this.lastActivity = Date.now();
          } catch (error) {
            console.warn('Ping gönderilemedi:', error);
          }
        }
      }
    }, 30000); // 30 saniyede bir kontrol
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  async connectWebSocket(userId: string): Promise<void> {
    // Eğer aynı kullanıcı için zaten bağlantı varsa, yeniden bağlanma
    if (this.currentUserId === userId && this.isConnected()) {
      console.log('🌐 WebSocket zaten bu kullanıcı için bağlı:', userId);
      return;
    }

    // Eğer farklı kullanıcı ise, eski bağlantıyı kapat
    if (this.currentUserId && this.currentUserId !== userId) {
      console.log('🔄 Farklı kullanıcı, eski bağlantı kapatılıyor:', this.currentUserId, '→', userId);
      this.disconnect();
    }

    // Eğer zaten bağlanma işlemi devam ediyorsa, bekle
    if (this.isConnecting && this.connectionPromise) {
      console.log('⏳ Bağlantı işlemi zaten devam ediyor, bekleniyor...');
      await this.connectionPromise;
      return;
    }

    this.currentUserId = userId;
    this.isConnecting = true;

    this.connectionPromise = new Promise((resolve, reject) => {
      const wsUrl = `ws://${window.location.hostname}:8000/ws/${userId}`;
      console.log(`🔌 WebSocket bağlantısı kuruluyor: ${wsUrl}`);
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('✅ WebSocket bağlantısı kuruldu:', userId);
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        resolve();
      };
      
      this.ws.onmessage = (event) => {
        try {
          this.lastActivity = Date.now();
          const update: ProgressUpdate = JSON.parse(event.data);
          console.log('📤 Progress update alındı:', update);
          
          const callback = this.progressCallbacks.get(update.task_id);
          if (callback) {
            callback(update);
            
            // Task tamamlandığında veya hata durumunda callback'i temizle
            if (update.status === 'completed' || update.status === 'error') {
              this.progressCallbacks.delete(update.task_id);
            }
          }
        } catch (error) {
          console.error('❌ WebSocket mesaj parse hatası:', error);
        }
      };
      
      this.ws.onclose = (event) => {
        console.log('❌ WebSocket bağlantısı kapandı:', event.code, event.reason);
        this.ws = null;
        this.isConnecting = false;
        
        // Eğer normal kapatma değilse ve user hala aynıysa, yeniden bağlan
        if (event.code !== 1000 && this.currentUserId === userId && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`🔄 WebSocket yeniden bağlanma denemesi ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
          setTimeout(() => {
            if (this.currentUserId === userId) {
              this.connectWebSocket(userId);
            }
          }, this.reconnectDelay * this.reconnectAttempts);
        } else if (event.code !== 1000) {
          reject(new Error('WebSocket bağlantısı kurulamadı'));
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('❌ WebSocket hatası:', error);
        this.isConnecting = false;
        reject(error);
      };
    });

    return this.connectionPromise;
  }

  async startAsyncAnalysis(
    videoId: string, 
    maxComments: number = 100,
    onProgress: (progress: ProgressUpdate) => void
  ): Promise<string> {
    try {
      const auth = await import('firebase/auth');
      const user = auth.getAuth().currentUser;
      
      if (!user) {
        throw new Error('Kullanıcı oturum açmamış');
      }

      // WebSocket bağlantısını sağla
      await this.connectWebSocket(user.uid);

      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/youtube/analyze-video-async`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          video_id: videoId,
          max_comments: maxComments,
          use_async: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Async analiz başlatılamadı');
      }

      const data: AsyncAnalysisResult = await response.json();
      const taskId = data.task_id;
      
      console.log(`🚀 Async analiz başlatıldı - Task ID: ${taskId}`);
      
      // Progress callback'ini kaydet
      this.progressCallbacks.set(taskId, onProgress);
      
      return taskId;
    } catch (error) {
      console.error('❌ Async analiz başlatma hatası:', error);
      throw error;
    }
  }

  async getAnalysisStatus(taskId: string): Promise<any> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/youtube/analysis-status/${taskId}`);
      
      if (!response.ok) {
        throw new Error('Status kontrolü başarısız');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Status kontrol hatası:', error);
      throw error;
    }
  }

  // Belirli bir task için callback kaydet
  registerProgressCallback(taskId: string, callback: (progress: ProgressUpdate) => void) {
    this.progressCallbacks.set(taskId, callback);
  }

  // Task callback'ini temizle
  unregisterProgressCallback(taskId: string) {
    this.progressCallbacks.delete(taskId);
  }

  // WebSocket bağlantısını kontrol et
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Manuel reconnect
  async reconnect(userId: string) {
    this.disconnect();
    await this.connectWebSocket(userId);
  }

  disconnect() {
    if (this.ws) {
      console.log('🔌 WebSocket bağlantısı kapatılıyor...');
      this.ws.close(1000, 'Manual disconnect'); // Normal closure
      this.ws = null;
    }
    this.stopHeartbeat();
    this.progressCallbacks.clear();
    this.reconnectAttempts = 0;
    this.currentUserId = null;
    this.isConnecting = false;
    this.connectionPromise = null;
  }

  // Sadece aktif task'ları temizle, bağlantıyı koru
  clearActiveTasks() {
    this.progressCallbacks.clear();
    console.log('🧹 Aktif tasklar temizlendi, WebSocket baglantisi korundu');
  }

  // Belirli bir user için disconnect
  disconnectUser(userId: string) {
    if (this.currentUserId === userId) {
      this.disconnect();
    }
  }

  // Debug bilgileri
  getDebugInfo() {
    return {
      connected: this.isConnected(),
      currentUserId: this.currentUserId,
      activeCallbacks: this.progressCallbacks.size,
      reconnectAttempts: this.reconnectAttempts,
      isConnecting: this.isConnecting,
      websocketState: this.ws?.readyState || 'not_connected'
    };
  }
}

// Singleton instance export
export const asyncAnalysisService = AsyncAnalysisService.getInstance();
export type { ProgressUpdate, AsyncAnalysisResult }; 