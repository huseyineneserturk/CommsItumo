import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { AnalysisResult, AnalysisData, AnalysisSummary, AnalysisFilter } from '../types/analysis';

class AnalysisService {
  private db = getFirestore();
  private collectionName = 'analyses';

  /**
   * Yeni analiz sonucunu Firestore'a kaydeder
   */
  async saveAnalysis(analysisData: AnalysisData): Promise<string> {
    try {
      const docData = {
        ...analysisData,
        createdAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(this.db, this.collectionName), docData);
      console.log('Analiz kaydedildi:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Analiz kaydetme hatası:', error);
      throw new Error('Analiz kaydedilemedi');
    }
  }

  /**
   * Kullanıcının analiz geçmişini getirir
   */
  async getUserAnalyses(userId: string, limitCount: number = 10): Promise<AnalysisSummary[]> {
    try {
      const q = query(
        collection(this.db, this.collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const analyses: AnalysisSummary[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        analyses.push({
          id: doc.id,
          userId: data.userId,
          videoId: data.videoId,
          videoTitle: data.videoTitle,
          createdAt: data.createdAt.toDate(),
          totalComments: data.sentimentStats.total,
          averagePolarity: data.sentimentStats.averagePolarity,
          dominantSentiment: this.getDominantSentiment(data.sentimentStats.categories)
        });
      });

      return analyses;
    } catch (error) {
      console.error('Analiz geçmişi getirme hatası:', error);
      throw new Error('Analiz geçmişi getirilemedi');
    }
  }

  /**
   * Belirli bir analizi detaylı olarak getirir
   */
  async getAnalysisById(analysisId: string): Promise<AnalysisResult | null> {
    try {
      const docRef = doc(this.db, this.collectionName, analysisId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: data.userId,
          videoId: data.videoId,
          videoTitle: data.videoTitle,
          createdAt: data.createdAt.toDate(),
          sentimentStats: data.sentimentStats,
          wordCloud: data.wordCloud,
          comments: data.comments
        };
      }

      return null;
    } catch (error) {
      console.error('Analiz getirme hatası:', error);
      throw new Error('Analiz getirilemedi');
    }
  }

  /**
   * Analizi günceller
   */
  async updateAnalysis(analysisId: string, updateData: Partial<AnalysisData>): Promise<void> {
    try {
      const docRef = doc(this.db, this.collectionName, analysisId);
      await updateDoc(docRef, updateData);
      console.log('Analiz güncellendi:', analysisId);
    } catch (error) {
      console.error('Analiz güncelleme hatası:', error);
      throw new Error('Analiz güncellenemedi');
    }
  }

  /**
   * Analizi siler
   */
  async deleteAnalysis(analysisId: string): Promise<void> {
    try {
      const docRef = doc(this.db, this.collectionName, analysisId);
      await deleteDoc(docRef);
      console.log('Analiz silindi:', analysisId);
    } catch (error) {
      console.error('Analiz silme hatası:', error);
      throw new Error('Analiz silinemedi');
    }
  }

  /**
   * Filtrelenmiş analiz listesi getirir
   */
  async getFilteredAnalyses(filter: AnalysisFilter): Promise<AnalysisSummary[]> {
    try {
      let q = collection(this.db, this.collectionName);
      const constraints = [];

      if (filter.userId) {
        constraints.push(where('userId', '==', filter.userId));
      }

      if (filter.videoId) {
        constraints.push(where('videoId', '==', filter.videoId));
      }

      // Tarih filtreleri için daha karmaşık sorgular gerekebilir
      constraints.push(orderBy('createdAt', 'desc'));

      if (filter.limit) {
        constraints.push(limit(filter.limit));
      }

      const filteredQuery = query(q, ...constraints);
      const querySnapshot = await getDocs(filteredQuery);
      const analyses: AnalysisSummary[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const analysis: AnalysisSummary = {
          id: doc.id,
          userId: data.userId,
          videoId: data.videoId,
          videoTitle: data.videoTitle,
          createdAt: data.createdAt.toDate(),
          totalComments: data.sentimentStats.total,
          averagePolarity: data.sentimentStats.averagePolarity,
          dominantSentiment: this.getDominantSentiment(data.sentimentStats.categories)
        };

        // Sentiment filtresi uygula
        if (!filter.sentiment || analysis.dominantSentiment === filter.sentiment) {
          analyses.push(analysis);
        }
      });

      return analyses;
    } catch (error) {
      console.error('Filtrelenmiş analiz getirme hatası:', error);
      throw new Error('Filtrelenmiş analizler getirilemedi');
    }
  }

  /**
   * Backend'den analiz geçmişini getirir
   */
  async getUserAnalysesFromAPI(userId: string, limit: number = 10): Promise<AnalysisSummary[]> {
    try {
      const auth = await import('firebase/auth');
      const user = auth.getAuth().currentUser;
      
      if (!user) {
        throw new Error('Kullanıcı oturum açmamış');
      }

      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/youtube/analysis-history?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analiz geçmişi getirilemedi');
      }

      const data = await response.json();
      
      // Backend'den gelen veriyi frontend formatına çevir
      return data.map((item: any) => ({
        id: item.id,
        userId: item.userId,
        videoId: item.videoId,
        videoTitle: item.videoTitle,
        createdAt: new Date(item.createdAt),
        totalComments: item.sentimentStats?.total || 0,
        averagePolarity: item.sentimentStats?.averagePolarity || 0,
        dominantSentiment: this.getDominantSentiment(item.sentimentStats?.categories || { positive: 0, neutral: 0, negative: 0 })
      }));
    } catch (error) {
      console.error('API analiz geçmişi hatası:', error);
      throw error;
    }
  }

  /**
   * Backend'den belirli analizi getirir
   */
  async getAnalysisByIdFromAPI(analysisId: string): Promise<AnalysisResult | null> {
    try {
      const auth = await import('firebase/auth');
      const user = auth.getAuth().currentUser;
      
      if (!user) {
        throw new Error('Kullanıcı oturum açmamış');
      }

      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/youtube/analysis/${analysisId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analiz getirilemedi');
      }

      const data = await response.json();
      
      return {
        id: data.id,
        userId: data.userId,
        videoId: data.videoId,
        videoTitle: data.videoTitle,
        createdAt: new Date(data.createdAt),
        sentimentStats: data.sentimentStats,
        wordCloud: data.wordCloud,
        comments: data.comments
      };
    } catch (error) {
      console.error('API analiz getirme hatası:', error);
      throw error;
    }
  }

  /**
   * YouTube video analizi yapar
   */
  async analyzeVideo(videoId: string, maxComments: number = 100): Promise<any> {
    try {
      const auth = await import('firebase/auth');
      const user = auth.getAuth().currentUser;
      
      if (!user) {
        throw new Error('Kullanıcı oturum açmamış');
      }

      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/youtube/analyze-video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          video_id: videoId,
          max_comments: maxComments
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Video analizi başarısız oldu');
      }

      return await response.json();
    } catch (error) {
      console.error('Video analizi hatası:', error);
      throw error;
    }
  }

  /**
   * YouTube kanal analizi yapar
   */
  async analyzeChannel(maxVideos: number = 10, maxCommentsPerVideo: number = 50): Promise<any> {
    try {
      const auth = await import('firebase/auth');
      const user = auth.getAuth().currentUser;
      
      if (!user) {
        throw new Error('Kullanıcı oturum açmamış');
      }

      const token = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/youtube/analyze-channel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          max_videos: maxVideos,
          max_comments_per_video: maxCommentsPerVideo
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Kanal analizi başarısız oldu');
      }

      return await response.json();
    } catch (error) {
      console.error('Kanal analizi hatası:', error);
      throw error;
    }
  }

  /**
   * Dominant sentiment kategorisini belirler
   */
  private getDominantSentiment(categories: { positive: number; neutral: number; negative: number }): 'positive' | 'neutral' | 'negative' {
    const { positive, neutral, negative } = categories;
    
    if (positive >= neutral && positive >= negative) {
      return 'positive';
    } else if (negative >= neutral && negative >= positive) {
      return 'negative';
    } else {
      return 'neutral';
    }
  }
}

export const analysisService = new AnalysisService(); 