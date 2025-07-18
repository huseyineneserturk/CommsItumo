from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from typing import List, Dict, Any, Optional
import os
import asyncio
import logging
from datetime import datetime, timedelta

class YouTubeService:
    def __init__(self, credentials: Credentials):
        self.youtube = build('youtube', 'v3', credentials=credentials)
        self.logger = logging.getLogger(__name__)
        
        # SentimentService global instance'ını kullan
        try:
            from services.sentiment_service import sentiment_service
            self.sentiment_service = sentiment_service
            self.sentiment_enabled = True
            print("SentimentService entegrasyonu aktif!")
        except Exception as e:
            self.logger.warning(f"SentimentService entegrasyonu başlatılamadı: {e}")
            self.sentiment_service = None
            self.sentiment_enabled = False

    async def get_channel_info(self) -> Dict[str, Any]:
        """Kullanıcının YouTube kanal bilgilerini getirir."""
        try:
            print("Kanal bilgileri alınıyor...")
            response = self.youtube.channels().list(
                part='snippet,statistics',
                mine=True
            ).execute()

            if not response['items']:
                print("Kanal bulunamadı")
                raise Exception("Kanal bulunamadı")

            channel = response['items'][0]
            snippet = channel['snippet']
            statistics = channel['statistics']
            
            # En yüksek kaliteli thumbnail'ı seç
            thumbnails = snippet.get('thumbnails', {})
            thumbnail_url = (
                thumbnails.get('high', {}).get('url') or
                thumbnails.get('medium', {}).get('url') or
                thumbnails.get('default', {}).get('url') or
                ''
            )
            
            print("Kanal bilgileri başarıyla alındı")
            return {
                'id': channel['id'],
                'title': snippet['title'],
                'description': snippet['description'],
                'thumbnail': thumbnail_url,
                'published_at': snippet['publishedAt'],  # Kanal oluşturulma tarihi
                'country': snippet.get('country', ''),
                'custom_url': snippet.get('customUrl', ''),
                'subscriber_count': statistics['subscriberCount'],
                'video_count': statistics['videoCount'],
                'view_count': statistics['viewCount']
            }
        except HttpError as e:
            print(f'YouTube API hatası: {e}')
            if e.resp.status == 401:
                print("Token süresi dolmuş veya geçersiz")
                raise Exception("Token süresi dolmuş veya geçersiz")
            raise Exception(f"YouTube API hatası: {str(e)}")
        except Exception as e:
            print(f'Beklenmeyen hata: {e}')
            import traceback
            print(f"Stack trace: {traceback.format_exc()}")
            raise Exception(f"Beklenmeyen hata: {str(e)}")

    async def get_channel_statistics(self) -> Dict[str, Any]:
        """Kanalın detaylı istatistiklerini getirir."""
        try:
            print("Kanal istatistikleri alınıyor...")
            
            # Temel kanal bilgilerini al
            channel_info = await self.get_channel_info()
            
            # Son videoları al
            videos = await self.get_channel_videos(50)
            
            # İstatistikleri hesapla
            total_likes = 0
            total_comments = 0
            recent_videos = 0
            
            for video in videos:
                total_likes += int(video.get('like_count', 0))
                total_comments += int(video.get('comment_count', 0))
                recent_videos += 1
            
            # Ortalama değerleri hesapla
            avg_views_per_video = 0
            avg_likes_per_video = 0
            avg_comments_per_video = 0
            
            if recent_videos > 0:
                total_views_recent = sum(int(video.get('view_count', 0)) for video in videos)
                avg_views_per_video = total_views_recent // recent_videos
                avg_likes_per_video = total_likes // recent_videos
                avg_comments_per_video = total_comments // recent_videos
            
            return {
                'subscribers': int(channel_info['subscriber_count']),
                'totalViews': int(channel_info['view_count']),
                'totalVideos': int(channel_info['video_count']),
                'totalLikes': total_likes,
                'totalComments': total_comments,
                'recentVideos': recent_videos,
                'averageViewsPerVideo': avg_views_per_video,
                'averageLikesPerVideo': avg_likes_per_video,
                'averageCommentsPerVideo': avg_comments_per_video,
                'channelTitle': channel_info['title'],
                'channelDescription': channel_info['description'],
                'channelThumbnail': channel_info['thumbnail']
            }
            
        except Exception as e:
            print(f'Kanal istatistikleri hatası: {e}')
            import traceback
            print(f"Stack trace: {traceback.format_exc()}")
            raise Exception(f"Kanal istatistikleri getirilemedi: {str(e)}")

    async def get_video_comments(self, video_id: str, max_results: int = 100) -> List[Dict[str, Any]]:
        """Belirli bir videonun yorumlarını getirir."""
        try:
            comments = []
            next_page_token = None

            while len(comments) < max_results:
                try:
                    response = self.youtube.commentThreads().list(
                        part='snippet',
                        videoId=video_id,
                        maxResults=min(100, max_results - len(comments)),
                        pageToken=next_page_token,
                        textFormat='plainText',
                        moderationStatus='published'  # Sadece onaylanmış yorumları al
                    ).execute()

                    if 'items' not in response:
                        print(f"Video için yorum bulunamadı: {video_id}")
                        break

                    for item in response['items']:
                        comment = item['snippet']['topLevelComment']['snippet']
                        comments.append({
                            'id': item['id'],
                            'author': comment['authorDisplayName'],
                            'text': comment['textDisplay'],
                            'like_count': comment['likeCount'],
                            'published_at': comment['publishedAt'],
                            'updated_at': comment['updatedAt']
                        })

                    next_page_token = response.get('nextPageToken')
                    if not next_page_token:
                        break
                except HttpError as e:
                    if e.resp.status == 403:
                        print(f"Yorumlara erişim engellendi: {video_id}")
                        break
                    elif e.resp.status == 404:
                        print(f"Video bulunamadı: {video_id}")
                        break
                    else:
                        print(f'YouTube API hatası: {e}')
                        break

            return comments
        except Exception as e:
            print(f'Beklenmeyen hata: {e}')
            import traceback
            print(f"Stack trace: {traceback.format_exc()}")
            return []

    async def get_channel_videos(self, max_results: int = 50) -> List[Dict[str, Any]]:
        """Kanalın son videolarını getirir."""
        try:
            videos = []
            next_page_token = None

            # Önce kanal ID'sini al
            channel_info = await self.get_channel_info()
            if not channel_info:
                return []

            while len(videos) < max_results:
                response = self.youtube.search().list(
                    part='snippet',
                    channelId=channel_info['id'],
                    maxResults=min(50, max_results - len(videos)),
                    order='date',
                    type='video',
                    pageToken=next_page_token
                ).execute()

                for item in response['items']:
                    video_id = item['id']['videoId']
                    video_details = self.youtube.videos().list(
                        part='statistics',
                        id=video_id
                    ).execute()

                    statistics = video_details['items'][0]['statistics']
                    videos.append({
                        'id': video_id,
                        'title': item['snippet']['title'],
                        'description': item['snippet']['description'],
                        'thumbnail': item['snippet']['thumbnails']['default']['url'],
                        'published_at': item['snippet']['publishedAt'],
                        'view_count': statistics.get('viewCount', 0),
                        'like_count': statistics.get('likeCount', 0),
                        'comment_count': statistics.get('commentCount', 0)
                    })

                next_page_token = response.get('nextPageToken')
                if not next_page_token:
                    break

            return videos
        except HttpError as e:
            print(f'YouTube API hatası: {e}')
            return []

    async def get_recent_comments(self, days: int = 30) -> List[Dict[str, Any]]:
        """Tüm videolardaki yorumları getirir."""
        try:
            print("Kanal videoları alınıyor...")
            videos = await self.get_channel_videos()
            if not videos:
                print("Hiç video bulunamadı")
                return []
            
            print(f"Toplam {len(videos)} video bulundu")
            all_comments = []
            
            for video in videos:
                print(f"Video yorumları alınıyor: {video['title']}")
                try:
                    # Video yorumları devre dışı bırakılmış mı kontrol et
                    if int(video.get('comment_count', 0)) == 0:
                        print(f"Video için yorumlar devre dışı bırakılmış: {video['title']}")
                        continue

                    comments = await self.get_video_comments(video['id'])
                    for comment in comments:
                        comment['video_title'] = video['title']
                        comment['video_id'] = video['id']
                        all_comments.append(comment)
                except Exception as e:
                    print(f"Video yorumları alınırken hata: {video['title']} - {str(e)}")
                    continue

            print(f"Toplam {len(all_comments)} yorum bulundu")
            return sorted(all_comments, key=lambda x: x['published_at'], reverse=True)
        except Exception as e:
            print(f"Yorumlar alınırken genel hata: {str(e)}")
            import traceback
            print(f"Stack trace: {traceback.format_exc()}")
            raise

    async def analyze_video_comments(self, video_id: str, user_id: str, max_comments: int = 100) -> Dict[str, Any]:
        """
        Belirli bir videonun yorumlarını analiz eder ve Firestore'a kaydeder
        
        Args:
            video_id: YouTube video ID'si
            user_id: Kullanıcı ID'si
            max_comments: Maksimum yorum sayısı
            
        Returns:
            Dict: Analiz sonuçları
        """
        try:
            if not self.sentiment_enabled or not self.sentiment_service:
                raise Exception("SentimentService aktif değil")
            
            print(f"Video yorumları analiz ediliyor: {video_id}")
            
            # Video bilgilerini al
            video_info = await self.get_video_info(video_id)
            if not video_info:
                raise Exception(f"Video bilgileri alınamadı: {video_id}")
            
            # Video yorumlarını al
            comments = await self.get_video_comments(video_id, max_comments)
            if not comments:
                print(f"Video için yorum bulunamadı: {video_id}")
                return {
                    'video_id': video_id,
                    'video_title': video_info.get('title', 'Bilinmeyen Video'),
                    'total_comments': 0,
                    'analysis_id': None,
                    'message': 'Analiz edilecek yorum bulunamadı'
                }
            
            # Yorumları analiz et ve kaydet
            result = await self.sentiment_service.analyze_and_save_comments(
                comments,
                user_id,
                video_id=video_id,
                video_title=video_info.get('title', 'Bilinmeyen Video')
            )
            
            print(f"Video analizi tamamlandı: {video_id} - {result['total_analyzed']} yorum analiz edildi")
            
            return {
                'video_id': video_id,
                'video_title': video_info.get('title'),
                'video_info': video_info,
                'analysis_id': result.get('analysis_id'),
                'total_comments': result['total_analyzed'],
                'sentiment_stats': result['sentiment_stats'],
                'word_cloud': result['word_cloud'][:10],  # İlk 10 kelime
                'theme_analysis': result.get('theme_analysis', []),
                'analysis_summary': {
                    'dominant_sentiment': self._get_dominant_sentiment(result['sentiment_stats']['categories']),
                    'average_polarity': result['sentiment_stats']['average_polarity'],
                    'language_distribution': result['sentiment_stats']['language_distribution'],
                    'top_themes': [theme['theme'] for theme in result.get('theme_analysis', [])[:3]]
                }
            }
            
        except Exception as e:
            self.logger.error(f"Video analizi hatası: {str(e)}")
            raise Exception(f"Video analizi başarısız: {str(e)}")

    async def analyze_channel_comments(self, user_id: str, max_videos: int = 10, max_comments_per_video: int = 50) -> Dict[str, Any]:
        """
        Kanalın son videolarının yorumlarını analiz eder
        
        Args:
            user_id: Kullanıcı ID'si
            max_videos: Maksimum video sayısı
            max_comments_per_video: Video başına maksimum yorum sayısı
            
        Returns:
            Dict: Kanal analiz sonuçları
        """
        try:
            if not self.sentiment_enabled or not self.sentiment_service:
                raise Exception("SentimentService aktif değil")
            
            print("Kanal yorumları analiz ediliyor...")
            
            # Kanal bilgilerini al
            channel_info = await self.get_channel_info()
            
            # Son videoları al
            videos = await self.get_channel_videos(max_videos)
            if not videos:
                return {
                    'channel_info': channel_info,
                    'total_videos': 0,
                    'total_comments': 0,
                    'analyses': [],
                    'message': 'Analiz edilecek video bulunamadı'
                }
            
            analyses = []
            total_comments = 0
            
            for video in videos:
                try:
                    print(f"Video analiz ediliyor: {video['title']}")
                    
                    # Video yorumlarını al
                    comments = await self.get_video_comments(video['id'], max_comments_per_video)
                    if not comments:
                        print(f"Video için yorum bulunamadı: {video['title']}")
                        continue
                    
                    # Yorumları analiz et ve kaydet
                    result = await self.sentiment_service.analyze_and_save_comments(
                        comments,
                        user_id,
                        video_id=video['id'],
                        video_title=video['title']
                    )
                    
                    analyses.append({
                        'video_id': video['id'],
                        'video_title': video['title'],
                        'analysis_id': result.get('analysis_id'),
                        'total_comments': result['total_analyzed'],
                        'sentiment_summary': {
                            'dominant_sentiment': self._get_dominant_sentiment(result['sentiment_stats']['categories']),
                            'average_polarity': result['sentiment_stats']['average_polarity']
                        }
                    })
                    
                    total_comments += result['total_analyzed']
                    print(f"Video analizi tamamlandı: {video['title']} - {result['total_analyzed']} yorum")
                    
                except Exception as e:
                    self.logger.error(f"Video analizi hatası ({video['title']}): {str(e)}")
                    continue
            
            return {
                'channel_info': channel_info,
                'total_videos': len(videos),
                'total_analyzed_videos': len(analyses),
                'total_comments': total_comments,
                'analyses': analyses,
                'channel_summary': self._create_channel_summary(analyses)
            }
            
        except Exception as e:
            self.logger.error(f"Kanal analizi hatası: {str(e)}")
            raise Exception(f"Kanal analizi başarısız: {str(e)}")

    async def get_video_info(self, video_id: str) -> Optional[Dict[str, Any]]:
        """
        Belirli bir videonun detaylı bilgilerini getirir
        
        Args:
            video_id: YouTube video ID'si
            
        Returns:
            Dict: Video bilgileri veya None
        """
        try:
            response = self.youtube.videos().list(
                part='snippet,statistics',
                id=video_id
            ).execute()
            
            if not response['items']:
                return None
            
            video = response['items'][0]
            snippet = video['snippet']
            statistics = video['statistics']
            
            return {
                'id': video_id,
                'title': snippet['title'],
                'description': snippet['description'],
                'channel_title': snippet['channelTitle'],
                'published_at': snippet['publishedAt'],
                'thumbnail': snippet['thumbnails']['default']['url'],
                'view_count': int(statistics.get('viewCount', 0)),
                'like_count': int(statistics.get('likeCount', 0)),
                'comment_count': int(statistics.get('commentCount', 0)),
                'duration': video.get('contentDetails', {}).get('duration', 'PT0S')
            }
            
        except HttpError as e:
            self.logger.error(f"Video bilgisi alma hatası: {str(e)}")
            return None
        except Exception as e:
            self.logger.error(f"Beklenmeyen hata: {str(e)}")
            return None

    async def get_user_analysis_history(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Kullanıcının YouTube analiz geçmişini getirir
        
        Args:
            user_id: Kullanıcı ID'si
            limit: Maksimum sonuç sayısı
            
        Returns:
            List[Dict]: Analiz geçmişi
        """
        if not self.sentiment_enabled or not self.sentiment_service:
            return []
        
        try:
            return await self.sentiment_service.get_user_analysis_history(user_id, limit)
        except Exception as e:
            self.logger.error(f"Analiz geçmişi getirme hatası: {str(e)}")
            return []

    def _get_dominant_sentiment(self, categories: Dict[str, int]) -> str:
        """Dominant sentiment kategorisini belirler"""
        if not categories:
            return 'neutral'
        
        max_category = max(categories, key=categories.get)
        return max_category

    def _create_channel_summary(self, analyses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Kanal analizi özeti oluşturur"""
        if not analyses:
            return {
                'total_videos': 0,
                'total_comments': 0,
                'sentiment_distribution': {'positive': 0, 'neutral': 0, 'negative': 0},
                'average_polarity': 0
            }
        
        total_comments = sum(analysis['total_comments'] for analysis in analyses)
        sentiment_counts = {'positive': 0, 'neutral': 0, 'negative': 0}
        total_polarity = 0
        
        for analysis in analyses:
            sentiment = analysis['sentiment_summary']['dominant_sentiment']
            if sentiment in sentiment_counts:
                sentiment_counts[sentiment] += 1
            total_polarity += analysis['sentiment_summary']['average_polarity']
        
        return {
            'total_videos': len(analyses),
            'total_comments': total_comments,
            'sentiment_distribution': sentiment_counts,
            'average_polarity': total_polarity / len(analyses) if analyses else 0,
            'most_positive_video': max(analyses, key=lambda x: x['sentiment_summary']['average_polarity'])['video_title'] if analyses else None,
            'most_negative_video': min(analyses, key=lambda x: x['sentiment_summary']['average_polarity'])['video_title'] if analyses else None
        } 