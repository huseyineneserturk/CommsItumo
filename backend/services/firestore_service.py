from firebase_admin import firestore
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging
from config.firebase_config import db

class FirestoreService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.db = db
        self.analyses_collection = 'analyses'
        
        if not self.db:
            raise Exception("Firestore veritabanı başlatılamadı")
        
        print("Firestore servisi başlatıldı!")

    async def save_analysis(self, analysis_data: Dict[str, Any], user_id: str) -> str:
        """
        Analiz sonucunu Firestore'a kaydeder
        
        Args:
            analysis_data: Analiz verileri
            user_id: Kullanıcı ID'si
            
        Returns:
            str: Oluşturulan doküman ID'si
        """
        try:
            # Analiz verilerini hazırla
            doc_data = {
                'userId': user_id,
                'videoId': analysis_data.get('video_id'),
                'videoTitle': analysis_data.get('video_title'),
                'createdAt': datetime.now(),
                'sentimentStats': {
                    'total': analysis_data.get('sentiment_stats', {}).get('total', 0),
                    'categories': {
                        'positive': analysis_data.get('sentiment_stats', {}).get('categories', {}).get('positive', 0),
                        'neutral': analysis_data.get('sentiment_stats', {}).get('categories', {}).get('neutral', 0),
                        'negative': analysis_data.get('sentiment_stats', {}).get('categories', {}).get('negative', 0)
                    },
                    'averagePolarity': analysis_data.get('sentiment_stats', {}).get('average_polarity', 0),
                    'languageDistribution': analysis_data.get('sentiment_stats', {}).get('language_distribution', {'tr': 0, 'en': 0}),
                    'themes': analysis_data.get('sentiment_stats', {}).get('themes', {})
                },
                'wordCloud': analysis_data.get('word_cloud', []),
                'comments': self._format_comments(analysis_data.get('comments', []))
            }
            
            # Firestore'a kaydet
            doc_ref = self.db.collection(self.analyses_collection).document()
            doc_ref.set(doc_data)
            
            self.logger.info(f"Analiz kaydedildi: {doc_ref.id}")
            return doc_ref.id
            
        except Exception as e:
            self.logger.error(f"Analiz kaydetme hatası: {str(e)}")
            raise Exception(f"Analiz kaydedilemedi: {str(e)}")

    async def get_user_analyses(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Kullanıcının analiz geçmişini getirir
        
        Args:
            user_id: Kullanıcı ID'si
            limit: Maksimum sonuç sayısı
            
        Returns:
            List[Dict]: Analiz listesi
        """
        try:
            # Kullanıcının analizlerini getir
            docs = self.db.collection(self.analyses_collection)\
                .where('userId', '==', user_id)\
                .order_by('createdAt', direction=firestore.Query.DESCENDING)\
                .limit(limit)\
                .stream()
            
            analyses = []
            for doc in docs:
                data = doc.to_dict()
                data['id'] = doc.id
                analyses.append(data)
            
            self.logger.info(f"Kullanıcı {user_id} için {len(analyses)} analiz getirildi")
            return analyses
            
        except Exception as e:
            self.logger.error(f"Analiz geçmişi getirme hatası: {str(e)}")
            raise Exception(f"Analiz geçmişi getirilemedi: {str(e)}")

    async def get_analysis_by_id(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        """
        Belirli bir analizi ID'ye göre getirir
        
        Args:
            analysis_id: Analiz ID'si
            
        Returns:
            Dict: Analiz verisi veya None
        """
        try:
            doc_ref = self.db.collection(self.analyses_collection).document(analysis_id)
            doc = doc_ref.get()
            
            if doc.exists:
                data = doc.to_dict()
                data['id'] = doc.id
                return data
            else:
                return None
                
        except Exception as e:
            self.logger.error(f"Analiz getirme hatası: {str(e)}")
            raise Exception(f"Analiz getirilemedi: {str(e)}")

    async def update_analysis(self, analysis_id: str, update_data: Dict[str, Any]) -> bool:
        """
        Analizi günceller
        
        Args:
            analysis_id: Analiz ID'si
            update_data: Güncellenecek veriler
            
        Returns:
            bool: Başarı durumu
        """
        try:
            doc_ref = self.db.collection(self.analyses_collection).document(analysis_id)
            doc_ref.update(update_data)
            
            self.logger.info(f"Analiz güncellendi: {analysis_id}")
            return True
            
        except Exception as e:
            self.logger.error(f"Analiz güncelleme hatası: {str(e)}")
            raise Exception(f"Analiz güncellenemedi: {str(e)}")

    async def delete_analysis(self, analysis_id: str) -> bool:
        """
        Analizi siler
        
        Args:
            analysis_id: Analiz ID'si
            
        Returns:
            bool: Başarı durumu
        """
        try:
            doc_ref = self.db.collection(self.analyses_collection).document(analysis_id)
            doc_ref.delete()
            
            self.logger.info(f"Analiz silindi: {analysis_id}")
            return True
            
        except Exception as e:
            self.logger.error(f"Analiz silme hatası: {str(e)}")
            raise Exception(f"Analiz silinemedi: {str(e)}")

    async def get_analyses_by_video(self, video_id: str) -> List[Dict[str, Any]]:
        """
        Belirli bir video için yapılan analizleri getirir
        
        Args:
            video_id: Video ID'si
            
        Returns:
            List[Dict]: Analiz listesi
        """
        try:
            docs = self.db.collection(self.analyses_collection)\
                .where('videoId', '==', video_id)\
                .order_by('createdAt', direction=firestore.Query.DESCENDING)\
                .stream()
            
            analyses = []
            for doc in docs:
                data = doc.to_dict()
                data['id'] = doc.id
                analyses.append(data)
            
            return analyses
            
        except Exception as e:
            self.logger.error(f"Video analizleri getirme hatası: {str(e)}")
            raise Exception(f"Video analizleri getirilemedi: {str(e)}")

    def _format_comments(self, comments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Yorumları Firestore formatına dönüştürür
        
        Args:
            comments: Ham yorum verileri
            
        Returns:
            List[Dict]: Formatlanmış yorumlar
        """
        formatted_comments = []
        
        for comment in comments:
            formatted_comment = {
                'id': comment.get('id'),
                'text': comment.get('text'),
                'author': comment.get('author'),
                'date': comment.get('date'),
                'sentiment': {
                    'polarity': comment.get('sentiment', {}).get('polarity', 0),
                    'category': comment.get('sentiment', {}).get('category', 'neutral'),
                    'confidence': comment.get('sentiment', {}).get('confidence', 0),
                    'language': comment.get('sentiment', {}).get('language', 'en')
                },
                'theme': comment.get('theme', {})
            }
            formatted_comments.append(formatted_comment)
        
        return formatted_comments

    async def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """
        Kullanıcının genel istatistiklerini getirir
        
        Args:
            user_id: Kullanıcı ID'si
            
        Returns:
            Dict: Kullanıcı istatistikleri
        """
        try:
            docs = self.db.collection(self.analyses_collection)\
                .where('userId', '==', user_id)\
                .stream()
            
            total_analyses = 0
            total_comments = 0
            sentiment_totals = {'positive': 0, 'neutral': 0, 'negative': 0}
            polarity_sum = 0
            video_analysis_count = {}
            recent_analyses = []
            
            for doc in docs:
                data = doc.to_dict()
                total_analyses += 1
                
                # Sentiment istatistikleri
                sentiment_stats = data.get('sentimentStats', {})
                total_comments += sentiment_stats.get('total', 0)
                polarity_sum += sentiment_stats.get('averagePolarity', 0)
                
                categories = sentiment_stats.get('categories', {})
                for sentiment, count in categories.items():
                    if sentiment in sentiment_totals:
                        sentiment_totals[sentiment] += count
                
                # Video analiz sayısı
                video_title = data.get('videoTitle', 'Bilinmeyen Video')
                if video_title in video_analysis_count:
                    video_analysis_count[video_title] += 1
                else:
                    video_analysis_count[video_title] = 1
                
                # Son analizler için
                recent_analyses.append({
                    'id': doc.id,
                    'videoTitle': video_title,
                    'createdAt': data.get('createdAt'),
                    'totalComments': sentiment_stats.get('total', 0),
                    'averagePolarity': sentiment_stats.get('averagePolarity', 0),
                    'dominantSentiment': self._get_dominant_sentiment(categories)
                })
            
            # Ortalama sentiment skoru
            average_sentiment_score = polarity_sum / total_analyses if total_analyses > 0 else 0
            
            # En çok analiz edilen video
            most_analyzed_video = max(video_analysis_count.items(), key=lambda x: x[1]) if video_analysis_count else ('Henüz analiz yok', 0)
            
            # Sentiment dağılımını yüzde olarak hesapla
            total_sentiment_comments = sum(sentiment_totals.values())
            sentiment_percentages = {}
            if total_sentiment_comments > 0:
                for sentiment, count in sentiment_totals.items():
                    sentiment_percentages[sentiment] = round((count / total_sentiment_comments) * 100)
            else:
                sentiment_percentages = {'positive': 0, 'neutral': 0, 'negative': 0}
            
            # Son analizleri tarihe göre sırala
            recent_analyses.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
            recent_analyses = recent_analyses[:5]  # Son 5 analiz
            
            return {
                'totalAnalyses': total_analyses,
                'totalCommentsAnalyzed': total_comments,
                'averageSentimentScore': average_sentiment_score,
                'mostAnalyzedVideo': {
                    'title': most_analyzed_video[0],
                    'analysisCount': most_analyzed_video[1]
                },
                'sentimentDistribution': sentiment_percentages,
                'recentAnalyses': recent_analyses
            }
            
        except Exception as e:
            self.logger.error(f"Kullanıcı istatistikleri getirme hatası: {str(e)}")
            raise Exception(f"Kullanıcı istatistikleri getirilemedi: {str(e)}")
    
    def _get_dominant_sentiment(self, categories: Dict[str, int]) -> str:
        """
        Dominant sentiment'i belirler
        
        Args:
            categories: Sentiment kategorileri
            
        Returns:
            str: Dominant sentiment
        """
        if not categories:
            return 'neutral'
        
        max_category = max(categories.items(), key=lambda x: x[1])
        return max_category[0]

# Singleton instance
firestore_service = FirestoreService() 