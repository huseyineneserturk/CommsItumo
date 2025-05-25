import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface ChannelInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriber_count: string;
  video_count: string;
  view_count: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  published_at: string;
  view_count: string;
  like_count: string;
  comment_count: string;
}

export interface CommentInfo {
  id: string;
  author: string;
  text: string;
  like_count: number;
  published_at: string;
  updated_at: string;
  video_title?: string;
  video_id?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

class YouTubeService {
  private getAuthHeader() {
    const token = localStorage.getItem('firebase_token');
    if (!token) {
      throw new Error('Firebase token bulunamadı');
    }
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async authenticateYouTube(credentials: { access_token: string; refresh_token: string }) {
    try {
      const response = await axios.post(`${API_URL}/auth/youtube`, credentials, {
        headers: this.getAuthHeader(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('YouTube kimlik doğrulama hatası:', error);
      throw error;
    }
  }

  async getChannelInfo(): Promise<ChannelInfo> {
    try {
      const response = await axios.get(`${API_URL}/youtube/channel`, {
        headers: this.getAuthHeader(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Kanal bilgileri alınamadı:', error);
      throw error;
    }
  }

  async getChannelVideos(maxResults: number = 50): Promise<VideoInfo[]> {
    try {
      const response = await axios.get(`${API_URL}/youtube/videos?max_results=${maxResults}`, {
        headers: this.getAuthHeader(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Video listesi alınamadı:', error);
      throw error;
    }
  }

  async getVideoComments(videoId: string, maxResults: number = 100): Promise<CommentInfo[]> {
    try {
      const response = await axios.get(`${API_URL}/youtube/comments/${videoId}?max_results=${maxResults}`, {
        headers: this.getAuthHeader(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Video yorumları alınamadı:', error);
      throw error;
    }
  }

  async getRecentComments(days: number = 30): Promise<CommentInfo[]> {
    try {
      const response = await axios.get(`${API_URL}/youtube/recent-comments?days=${days}`, {
        headers: this.getAuthHeader(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Son yorumlar alınamadı:', error);
      throw error;
    }
  }
}

export default new YouTubeService(); 