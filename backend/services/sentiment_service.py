import os
import json
from typing import Dict, List, Any, Optional
import logging
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from nltk.tokenize import sent_tokenize
import nltk
from collections import Counter
import re
from nltk.corpus import stopwords
import asyncio
from datetime import datetime

class SentimentService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
        # Firestore servisi entegrasyonu
        try:
            from services.firestore_service import firestore_service
            self.firestore_service = firestore_service
            self.firestore_enabled = True
            print("Firestore entegrasyonu aktif!")
        except Exception as e:
            self.logger.warning(f"Firestore entegrasyonu başlatılamadı: {e}")
            self.firestore_service = None
            self.firestore_enabled = False
        
        # Model dosyalarının yolu
        self.models_dir = "models"
        os.makedirs(self.models_dir, exist_ok=True)
        
        # Türkçe duygu analizi modeli
        tr_model_path = os.path.join(self.models_dir, "tr-sentiment")
        if not os.path.exists(tr_model_path):
            print("Türkçe duygu analizi modeli indiriliyor...")
            self.tr_tokenizer = AutoTokenizer.from_pretrained("savasy/bert-base-turkish-sentiment-cased")
            self.tr_model = AutoModelForSequenceClassification.from_pretrained("savasy/bert-base-turkish-sentiment-cased")
            self.tr_tokenizer.save_pretrained(tr_model_path)
            self.tr_model.save_pretrained(tr_model_path)
        else:
            print("Türkçe duygu analizi modeli yükleniyor...")
            self.tr_tokenizer = AutoTokenizer.from_pretrained(tr_model_path)
            self.tr_model = AutoModelForSequenceClassification.from_pretrained(tr_model_path)
        
        # İngilizce duygu analizi modeli
        en_model_path = os.path.join(self.models_dir, "en-sentiment")
        if not os.path.exists(en_model_path):
            print("İngilizce duygu analizi modeli indiriliyor...")
            self.en_tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased-finetuned-sst-2-english")
            self.en_model = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased-finetuned-sst-2-english")
            self.en_tokenizer.save_pretrained(en_model_path)
            self.en_model.save_pretrained(en_model_path)
        else:
            print("İngilizce duygu analizi modeli yükleniyor...")
            self.en_tokenizer = AutoTokenizer.from_pretrained(en_model_path)
            self.en_model = AutoModelForSequenceClassification.from_pretrained(en_model_path)
        
        # Tema analizi modeli
        theme_model_path = os.path.join(self.models_dir, "theme-analysis")
        if not os.path.exists(theme_model_path):
            print("Tema analizi modeli indiriliyor...")
            self.theme_tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-mnli")
            self.theme_model = AutoModelForSequenceClassification.from_pretrained("facebook/bart-large-mnli")
            self.theme_tokenizer.save_pretrained(theme_model_path)
            self.theme_model.save_pretrained(theme_model_path)
        else:
            print("Tema analizi modeli yükleniyor...")
            self.theme_tokenizer = AutoTokenizer.from_pretrained(theme_model_path)
            self.theme_model = AutoModelForSequenceClassification.from_pretrained(theme_model_path)
        
        # Pipeline'ları oluştur
        self.tr_sentiment = pipeline(
            "sentiment-analysis",
            model=self.tr_model,
            tokenizer=self.tr_tokenizer
        )
        
        self.en_sentiment = pipeline(
            "sentiment-analysis",
            model=self.en_model,
            tokenizer=self.en_tokenizer
        )
        
        self.theme_classifier = pipeline(
            "zero-shot-classification",
            model=self.theme_model,
            tokenizer=self.theme_tokenizer
        )
        
        # NLTK veri setlerini indir
        try:
            nltk.data.find('tokenizers/punkt')
            nltk.data.find('corpora/stopwords')
        except LookupError:
            nltk.download('punkt')
            nltk.download('stopwords')
        
        # Tema kategorileri
        self.theme_categories = [
            "içerik kalitesi",
            "sunum tarzı",
            "video düzeni",
            "ses ve görüntü",
            "konu seçimi",
            "etkileşim",
            "öğreticilik",
            "eğlence",
            "güncellik",
            "topluluk"
        ]
        
        # Stopwords listesi
        self.stop_words = set(stopwords.words('turkish') + stopwords.words('english'))
        
        print("Duygu analizi servisi başlatıldı!")

    def detect_language(self, text: str) -> str:
        """Metnin dilini tespit eder"""
        try:
            # Basit bir dil tespiti
            turkish_chars = set('çğıöşüÇĞİÖŞÜ')
            if any(char in text for char in turkish_chars):
                return 'tr'
            return 'en'
        except Exception as e:
            self.logger.error(f"Dil tespiti hatası: {str(e)}")
            return 'en'

    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Metin için detaylı duygu analizi yapar"""
        try:
            # Dil tespiti
            lang = self.detect_language(text)
            
            # Cümlelere ayır
            sentences = sent_tokenize(text)
            
            # Her cümle için analiz yap
            sentence_analyses = []
            for sentence in sentences:
                if lang == 'tr':
                    result = self.tr_sentiment(sentence)[0]
                else:
                    result = self.en_sentiment(sentence)[0]
                
                sentence_analyses.append({
                    "text": sentence,
                    "sentiment": result["label"],
                    "score": result["score"]
                })
            
            # Tema analizi
            theme_result = self.analyze_theme(text)
            
            # Genel duygu skoru hesapla
            sentiment_scores = {
                "positive": sum(1 for s in sentence_analyses if s["sentiment"] in ["positive", "POSITIVE"]),
                "negative": sum(1 for s in sentence_analyses if s["sentiment"] in ["negative", "NEGATIVE"]),
                "neutral": sum(1 for s in sentence_analyses if s["sentiment"] in ["neutral", "NEUTRAL"])
            }
            
            # Ana duygu kategorisini belirle
            max_category = max(sentiment_scores, key=sentiment_scores.get)
            
            return {
                "polarity": (sentiment_scores["positive"] - sentiment_scores["negative"]) / len(sentences),
                "category": max_category,
                "confidence": max(sentiment_scores.values()) / len(sentences),
                "language": lang,
                "sentence_analyses": sentence_analyses,
                "theme": theme_result
            }
                
        except Exception as e:
            self.logger.error(f"Duygu analizi hatası: {str(e)}")
            return {
                "polarity": 0,
                "category": "neutral",
                "confidence": 0,
                "language": "en",
                "error": str(e)
            }

    def analyze_comments(self, comments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Yorum listesi için duygu analizi yapar"""
        analyzed_comments = []
        for comment in comments:
            try:
                # YouTube yorumu için duygu analizi
                sentiment = self.analyze_sentiment(comment['text'])
                
                # Yorumu analiz sonuçlarıyla zenginleştir
                analyzed_comment = {
                    'id': comment.get('id'),
                    'text': comment.get('text'),
                    'author': comment.get('author'),
                    'date': comment.get('published_at'),
                    'video_id': comment.get('video_id'),
                    'video_title': comment.get('video_title'),
                    'sentiment': sentiment,
                    'theme': self.analyze_theme(comment['text'])
                }
                
                analyzed_comments.append(analyzed_comment)
            except Exception as e:
                self.logger.error(f"Yorum analizi hatası: {str(e)}")
                continue
                
        return analyzed_comments

    def get_sentiment_stats(self, comments: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Yorumların detaylı duygu dağılımını hesaplar"""
        total_comments = len(comments)
        if total_comments == 0:
            return {
                "total": 0,
                "categories": {
                    "positive": 0,
                    "negative": 0,
                    "neutral": 0
                },
                "average_polarity": 0,
                "language_distribution": {"tr": 0, "en": 0},
                "themes": {}
            }

        sentiment_counts = {
            "positive": 0,
            "negative": 0,
            "neutral": 0
        }

        theme_counts = {}
        language_counts = {"tr": 0, "en": 0}
        total_polarity = 0

        for comment in comments:
            sentiment = comment.get('sentiment', {})
            category = sentiment.get('category', 'neutral')
            themes = sentiment.get('theme', {})
            
            # Duygu sayılarını güncelle
            sentiment_counts[category] += 1
            
            # Tema sayılarını güncelle
            for theme, score in themes.items():
                if score > 0.1:  # Eşik değeri
                    theme_counts[theme] = theme_counts.get(theme, 0) + 1
            
            # Dil dağılımını güncelle
            language = sentiment.get('language', 'en')
            language_counts[language] += 1
            
            total_polarity += sentiment.get('polarity', 0)

        return {
            "total": total_comments,
            "categories": sentiment_counts,
            "average_polarity": total_polarity / total_comments if total_comments > 0 else 0,
            "language_distribution": language_counts,
            "themes": theme_counts
        }

    def get_word_cloud(self, comments: List[Dict[str, Any]], max_words: int = 50) -> List[Dict[str, Any]]:
        """Kelime bulutu için sık kullanılan kelimeleri hesaplar"""
        try:
            all_text = ' '.join(comment['text'] for comment in comments)
            
            # Noktalama işaretlerini kaldır
            all_text = re.sub(r'[^\w\s]', '', all_text)
            
            # Kelimelere ayır
            words = all_text.lower().split()
            
            # Stop words'leri kaldır
            words = [word for word in words if word not in self.stop_words and len(word) > 2]
            
            # Kelime frekanslarını hesapla
            word_freq = Counter(words)
            
            # En sık kullanılan kelimeleri döndür
            return [{"text": word, "value": count} 
                    for word, count in word_freq.most_common(max_words)]
        except Exception as e:
            self.logger.error(f"Kelime bulutu oluşturma hatası: {str(e)}")
            return []

    def analyze_theme(self, text: str) -> Dict[str, float]:
        """Metin için tema analizi yapar"""
        try:
            if not text or len(text.strip()) == 0:
                return {theme: 0.0 for theme in self.theme_categories}

            # Metni temizle
            cleaned_text = self.clean_text(text)
            
            # Tema analizi yap
            result = self.theme_classifier(
                sequences=[cleaned_text],
                candidate_labels=self.theme_categories,
                multi_label=True
            )
            
            # Sonuçları sözlük olarak döndür
            if isinstance(result, list) and len(result) > 0:
                first_result = result[0]
                if isinstance(first_result, dict) and 'labels' in first_result and 'scores' in first_result:
                    return dict(zip(first_result['labels'], first_result['scores']))
            
            self.logger.error(f"Beklenmeyen tema analizi sonucu formatı: {result}")
            return {theme: 0.0 for theme in self.theme_categories}
            
        except Exception as e:
            self.logger.error(f"Tema analizi hatası: {str(e)}")
            return {theme: 0.0 for theme in self.theme_categories}

    def clean_text(self, text: str) -> str:
        """Metni temizler ve normalize eder."""
        # Küçük harfe çevir
        text = text.lower()
        
        # Noktalama işaretlerini kaldır
        text = re.sub(r'[^\w\s]', ' ', text)
        
        # Sayıları kaldır
        text = re.sub(r'\d+', '', text)
        
        # Stopwords'leri kaldır
        words = text.split()
        words = [word for word in words if word not in self.stop_words]
        
        # Tekrar eden boşlukları kaldır
        text = ' '.join(words)
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text 

    def get_theme_analysis(self, comments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Yorumlar için tema analizi sonuçlarını döndürür
        
        Args:
            comments: Analiz edilmiş yorumlar
            
        Returns:
            List[Dict]: Tema analizi sonuçları
        """
        try:
            theme_counts = {}
            total_comments = len(comments)
            
            # Her yorum için tema skorlarını topla
            for comment in comments:
                themes = comment.get('theme', {})
                for theme, score in themes.items():
                    if score > 0.1:  # Eşik değeri
                        theme_counts[theme] = theme_counts.get(theme, 0) + 1
            
            # Tema analizi sonuçlarını oluştur
            theme_analysis = []
            for theme, count in theme_counts.items():
                percentage = (count / total_comments * 100) if total_comments > 0 else 0
                theme_analysis.append({
                    'theme': theme,
                    'count': count,
                    'percentage': round(percentage, 2)
                })
            
            # Sayıya göre sırala
            theme_analysis.sort(key=lambda x: x['count'], reverse=True)
            
            return theme_analysis
            
        except Exception as e:
            self.logger.error(f"Tema analizi sonuçları oluşturma hatası: {str(e)}")
            return []

    async def analyze_and_save_comments(self, comments: List[Dict[str, Any]], user_id: str, 
                                      video_id: Optional[str] = None, video_title: Optional[str] = None) -> Dict[str, Any]:
        """
        Yorumları analiz eder ve sonuçları Firestore'a kaydeder
        
        Args:
            comments: Analiz edilecek yorumlar
            user_id: Kullanıcı ID'si
            video_id: Video ID'si (opsiyonel)
            video_title: Video başlığı (opsiyonel)
            
        Returns:
            Dict: Analiz sonuçları ve Firestore doküman ID'si
        """
        try:
            # Yorumları analiz et
            analyzed_comments = self.analyze_comments(comments)
            
            # İstatistikleri hesapla
            sentiment_stats = self.get_sentiment_stats(analyzed_comments)
            
            # Kelime bulutu oluştur
            word_cloud = self.get_word_cloud(analyzed_comments)
            
            # Analiz sonuçlarını hazırla
            analysis_result = {
                'video_id': video_id,
                'video_title': video_title,
                'sentiment_stats': sentiment_stats,
                'word_cloud': word_cloud,
                'comments': analyzed_comments
            }
            
            # Firestore'a kaydet (eğer aktifse)
            analysis_id = None
            if self.firestore_enabled and self.firestore_service:
                try:
                    analysis_id = await self.firestore_service.save_analysis(analysis_result, user_id)
                    self.logger.info(f"Analiz Firestore'a kaydedildi: {analysis_id}")
                except Exception as e:
                    self.logger.error(f"Firestore kaydetme hatası: {e}")
            
            # Sonuçları döndür
            result = {
                'analysis_id': analysis_id,
                'sentiment_stats': sentiment_stats,
                'word_cloud': word_cloud,
                'comments': analyzed_comments,
                'total_analyzed': len(analyzed_comments)
            }
            
            return result
            
        except Exception as e:
            self.logger.error(f"Analiz ve kaydetme hatası: {str(e)}")
            raise Exception(f"Analiz işlemi başarısız: {str(e)}")

    async def get_user_analysis_history(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Kullanıcının analiz geçmişini getirir
        
        Args:
            user_id: Kullanıcı ID'si
            limit: Maksimum sonuç sayısı
            
        Returns:
            List[Dict]: Analiz geçmişi
        """
        if not self.firestore_enabled or not self.firestore_service:
            self.logger.warning("Firestore servisi aktif değil")
            return []
        
        try:
            return await self.firestore_service.get_user_analyses(user_id, limit)
        except Exception as e:
            self.logger.error(f"Analiz geçmişi getirme hatası: {str(e)}")
            return []

    async def get_analysis_by_id(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        """
        Belirli bir analizi ID'ye göre getirir
        
        Args:
            analysis_id: Analiz ID'si
            
        Returns:
            Dict: Analiz verisi veya None
        """
        if not self.firestore_enabled or not self.firestore_service:
            self.logger.warning("Firestore servisi aktif değil")
            return None
        
        try:
            return await self.firestore_service.get_analysis_by_id(analysis_id)
        except Exception as e:
            self.logger.error(f"Analiz getirme hatası: {str(e)}")
            return None

    async def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """
        Kullanıcının genel istatistiklerini getirir
        
        Args:
            user_id: Kullanıcı ID'si
            
        Returns:
            Dict: Kullanıcı istatistikleri
        """
        if not self.firestore_enabled or not self.firestore_service:
            self.logger.warning("Firestore servisi aktif değil")
            return {
                'totalAnalyses': 0,
                'totalComments': 0,
                'sentimentDistribution': {'positive': 0, 'neutral': 0, 'negative': 0}
            }
        
        try:
            return await self.firestore_service.get_user_stats(user_id)
        except Exception as e:
            self.logger.error(f"Kullanıcı istatistikleri getirme hatası: {str(e)}")
            return {
                'totalAnalyses': 0,
                'totalComments': 0,
                'sentimentDistribution': {'positive': 0, 'neutral': 0, 'negative': 0}
            }

    def create_analysis_summary(self, comments: List[Dict[str, Any]], 
                              video_id: Optional[str] = None, video_title: Optional[str] = None) -> Dict[str, Any]:
        """
        Yorumlar için hızlı analiz özeti oluşturur (Firestore'a kaydetmeden)
        
        Args:
            comments: Analiz edilecek yorumlar
            video_id: Video ID'si (opsiyonel)
            video_title: Video başlığı (opsiyonel)
            
        Returns:
            Dict: Analiz özeti
        """
        try:
            # Yorumları analiz et
            analyzed_comments = self.analyze_comments(comments)
            
            # İstatistikleri hesapla
            sentiment_stats = self.get_sentiment_stats(analyzed_comments)
            
            # Kelime bulutu oluştur
            word_cloud = self.get_word_cloud(analyzed_comments, max_words=20)
            
            return {
                'video_id': video_id,
                'video_title': video_title,
                'sentiment_stats': sentiment_stats,
                'word_cloud': word_cloud,
                'total_comments': len(analyzed_comments),
                'analysis_date': str(datetime.now())
            }
            
        except Exception as e:
            self.logger.error(f"Analiz özeti oluşturma hatası: {str(e)}")
            return {
                'error': str(e),
                'total_comments': 0
            } 