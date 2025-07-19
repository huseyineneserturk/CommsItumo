import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from collections import Counter
import re
import logging
from typing import Dict, List, Any
from services.sentiment_service import sentiment_service

# Loglama
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# NLTK verilerini indirme.
try:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('punkt_tab')
    nltk.download('averaged_perceptron_tagger')
    nltk.download('wordnet')
    logger.info("NLTK veri setleri başarıyla indirildi")
except Exception as e:
    logger.error(f"NLTK indirme hatası: {str(e)}")

class CSVAnalyzer:
    def __init__(self):
        try:
            self.sentiment_service = sentiment_service
            logger.info("CSVAnalyzer başarıyla başlatıldı")
        except Exception as e:
            logger.error(f"CSVAnalyzer başlatma hatası: {str(e)}")
            raise

    def analyze_csv(self, file_path: str) -> Dict[str, Any]:
        try:
            logger.info(f"CSV dosyası okunuyor: {file_path}")
            # CSV dosyasını oku
            df = pd.read_csv(file_path)
            logger.info(f"CSV dosyası başarıyla okundu. Satır sayısı: {len(df)}")
            
            # Yorum sütununu bul
            comment_column = None
            possible_columns = ['comment', 'yorum', 'text', 'content', 'message']
            for col in possible_columns:
                if col in df.columns:
                    comment_column = col
                    break
            
            if not comment_column:
                error_msg = "CSV dosyasında yorum sütunu bulunamadı"
                logger.error(error_msg)
                raise ValueError(error_msg)

            logger.info(f"Yorum sütunu bulundu: {comment_column}")

            # Yorumları analiz et
            comments = []
            for _, row in df.iterrows():
                comment = {
                    'text': row[comment_column],
                    'author': row.get('author', 'Anonim'),
                    'date': row.get('date', pd.Timestamp.now().isoformat()),
                    'video_title': row.get('video_title', 'Bilinmeyen Video')
                }
                comments.append(comment)

            # Duygu analizi yap
            analyzed_comments = self.sentiment_service.analyze_comments(comments)
            
            # İstatistikleri hesapla
            sentiment_stats = self.sentiment_service.get_sentiment_stats(analyzed_comments)
            
            # Kelime bulutu oluştur
            word_cloud = self.sentiment_service.get_word_cloud(analyzed_comments)
            
            # Tema analizi
            theme_analysis = self.sentiment_service.get_theme_analysis(analyzed_comments)
            
            # sentiment_stats'e tema verilerini de ekle
            sentiment_stats['themes'] = {}
            for theme_item in theme_analysis:
                sentiment_stats['themes'][theme_item['theme']] = theme_item['count']

            result = {
                'comments': analyzed_comments,
                'sentiment_stats': sentiment_stats,
                'word_cloud': word_cloud,
                'theme_analysis': theme_analysis
            }
            
            logger.info("Analiz başarıyla tamamlandı")
            return result

        except Exception as e:
            logger.error(f"CSV analiz hatası: {str(e)}")
            raise 