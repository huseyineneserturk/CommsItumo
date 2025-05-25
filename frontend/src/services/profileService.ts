import { getAuth } from 'firebase/auth';

export interface UserProfileInfo {
  uid: string;
  email: string;
  displayName?: string;
  channelInfo: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    published_at: string;
    country?: string;
    custom_url?: string;
    subscriber_count: string;
    video_count: string;
    view_count: string;
  };
}

export interface ChannelStatistics {
  subscribers: number;
  totalViews: number;
  totalVideos: number;
  totalLikes: number;
  totalComments: number;
  recentVideos: number;
  averageViewsPerVideo: number;
  averageLikesPerVideo: number;
  averageCommentsPerVideo: number;
  channelTitle: string;
  channelDescription: string;
  channelThumbnail: string;
}

export interface AnalysisSummary {
  totalAnalyses: number;
  totalCommentsAnalyzed: number;
  averageSentimentScore: number;
  mostAnalyzedVideo: {
    title: string;
    analysisCount: number;
  };
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  recentAnalyses: Array<{
    id: string;
    videoTitle: string;
    createdAt: Date;
    totalComments: number;
    averagePolarity: number;
    dominantSentiment: string;
  }>;
}

class ProfileService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  private async getAuthToken(): Promise<string> {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('Kullanıcı oturum açmamış');
    }

    return await user.getIdToken();
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API çağrısı hatası (${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * Kullanıcının profil bilgilerini getirir
   */
  async getUserProfileInfo(): Promise<UserProfileInfo> {
    return this.makeRequest<UserProfileInfo>('/api/profile/user-info');
  }

  /**
   * Kanal istatistiklerini getirir
   */
  async getChannelStatistics(): Promise<ChannelStatistics> {
    return this.makeRequest<ChannelStatistics>('/api/profile/channel-stats');
  }

  /**
   * Kullanıcının analiz özetini getirir
   */
  async getAnalysisSummary(): Promise<AnalysisSummary> {
    return this.makeRequest<AnalysisSummary>('/api/profile/analysis-summary');
  }

  /**
   * Kullanıcının analiz geçmişini getirir
   */
  async getAnalysisHistory(limit: number = 10): Promise<any[]> {
    return this.makeRequest<any[]>(`/api/youtube/analysis-history?limit=${limit}`);
  }
}

export const profileService = new ProfileService(); 