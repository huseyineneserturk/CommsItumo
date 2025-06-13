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
        
        # Gelişmiş tema kategorileri
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
            "topluluk",
            "teknik sorunlar",
            "yaratıcılık",
            "özgünlük",
            "samimilik",
            "profesyonellik",
            "faydalılık",
            "motivasyon",
            "komedi",
            "bilgi vericilik",
            "güvenilirlik"
        ]
        
        # Tema anahtar kelimeleri (Türkçe ve İngilizce)
        self.theme_keywords = {
            "içerik kalitesi": ["kalite", "güzel", "harika", "mükemmel", "kötü", "berbat", "quality", "great", "awesome", "terrible", "bad"],
            "sunum tarzı": ["sunum", "anlatım", "stil", "presentation", "style", "delivery", "speaking"],
            "video düzeni": ["montaj", "düzen", "editing", "layout", "structure", "organization"],
            "ses ve görüntü": ["ses", "görüntü", "audio", "video", "sound", "visual", "mikrofon", "microphone"],
            "konu seçimi": ["konu", "konu", "topic", "subject", "theme", "idea"],
            "etkileşim": ["etkileşim", "soru", "cevap", "interaction", "question", "answer", "response"],
            "öğreticilik": ["öğren", "öğret", "ders", "learn", "teach", "tutorial", "lesson", "education"],
            "eğlence": ["eğlen", "komik", "gül", "fun", "funny", "entertaining", "laugh", "humor"],
            "güncellik": ["güncel", "yeni", "fresh", "new", "current", "update", "recent"],
            "topluluk": ["abone", "takip", "community", "subscriber", "follower", "fan"],
            "teknik sorunlar": ["sorun", "hata", "bug", "problem", "issue", "error", "glitch"],
            "yaratıcılık": ["yaratıcı", "kreatif", "özgün", "creative", "original", "innovative"],
            "özgünlük": ["özgün", "farklı", "unique", "different", "original", "special"],
            "samimilik": ["samimi", "doğal", "genuine", "authentic", "natural", "sincere"],
            "profesyonellik": ["profesyonel", "kaliteli", "professional", "polished", "refined"],
            "faydalılık": ["faydalı", "yararlı", "useful", "helpful", "beneficial", "valuable"],
            "motivasyon": ["motive", "ilham", "motivation", "inspiration", "encouraging"],
            "komedi": ["komik", "espri", "funny", "comedy", "joke", "hilarious"],
            "bilgi vericilik": ["bilgi", "info", "information", "educational", "informative"],
            "güvenilirlik": ["güvenilir", "doğru", "reliable", "trustworthy", "accurate", "credible"]
        }
        
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
            if not sentences:
                sentences = [text]
            
            # Her cümle için analiz yap
            sentence_analyses = []
            total_positive_score = 0
            total_negative_score = 0
            total_neutral_score = 0
            
            for sentence in sentences:
                if lang == 'tr':
                    result = self.tr_sentiment(sentence)[0]
                else:
                    result = self.en_sentiment(sentence)[0]
                
                # Label normalizasyonu
                normalized_label = result["label"].lower()
                if normalized_label in ["positive", "pos"]:
                    normalized_label = "positive"
                elif normalized_label in ["negative", "neg"]:
                    normalized_label = "negative"
                else:
                    normalized_label = "neutral"
                
                sentence_analyses.append({
                    "text": sentence,
                    "sentiment": normalized_label,
                    "score": result["score"]
                })
                
                # Skorları topla
                if normalized_label == "positive":
                    total_positive_score += result["score"]
                elif normalized_label == "negative":
                    total_negative_score += result["score"]
                else:
                    total_neutral_score += result["score"]
            
            # Tema analizi
            theme_result = self.analyze_theme(text)
            
            # Gelişmiş duygu hesaplama
            total_sentences = len(sentences)
            
            # Sayısal skorlar
            positive_count = sum(1 for s in sentence_analyses if s["sentiment"] == "positive")
            negative_count = sum(1 for s in sentence_analyses if s["sentiment"] == "negative")
            neutral_count = sum(1 for s in sentence_analyses if s["sentiment"] == "neutral")
            
            # Ağırlıklı skorlar (confidence skorlarını dikkate al)
            weighted_positive = total_positive_score / total_sentences if total_sentences > 0 else 0
            weighted_negative = total_negative_score / total_sentences if total_sentences > 0 else 0
            weighted_neutral = total_neutral_score / total_sentences if total_sentences > 0 else 0
            
            # Polarite hesaplama (daha gelişmiş)
            # Negatif skorları negatif yapmak için -1 ile çarp
            polarity = (weighted_positive - weighted_negative)
            
            # Nötr durumları da dikkate al (nötr yüksekse polarite 0'a yaklaşsın)
            if weighted_neutral > 0.6:  # %60'dan fazla nötr ise
                polarity = polarity * (1 - weighted_neutral * 0.5)
            
            # Ana kategoriyi belirle - hem sayı hem de confidence'ı dikkate al
            if positive_count > negative_count and positive_count > neutral_count and weighted_positive > 0.5:
                main_category = "positive"
                confidence = weighted_positive
            elif negative_count > positive_count and negative_count > neutral_count and weighted_negative > 0.5:
                main_category = "negative" 
                confidence = weighted_negative
            else:
                main_category = "neutral"
                confidence = max(weighted_neutral, 0.5)  # En az %50 confidence
            
            # Eğer tüm skorlar düşükse, nötr kabul et
            if max(weighted_positive, weighted_negative, weighted_neutral) < 0.3:
                main_category = "neutral"
                polarity = 0
                confidence = 0.6
            
            return {
                "polarity": round(polarity, 4),
                "category": main_category,
                "confidence": round(confidence, 4),
                "language": lang,
                "sentence_analyses": sentence_analyses,
                "theme": theme_result,
                "detailed_scores": {
                    "positive_score": round(weighted_positive, 4),
                    "negative_score": round(weighted_negative, 4),
                    "neutral_score": round(weighted_neutral, 4),
                    "positive_count": positive_count,
                    "negative_count": negative_count,
                    "neutral_count": neutral_count
                }
            }
                
        except Exception as e:
            self.logger.error(f"Duygu analizi hatası: {str(e)}")
            return {
                "polarity": 0,
                "category": "neutral",
                "confidence": 0.6,
                "language": "en",
                "error": str(e),
                "detailed_scores": {
                    "positive_score": 0,
                    "negative_score": 0,
                    "neutral_score": 0.6,
                    "positive_count": 0,
                    "negative_count": 0,
                    "neutral_count": 1
                }
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
                "themes": {},
                "confidence_distribution": {
                    "high": 0,    # >0.8
                    "medium": 0,  # 0.5-0.8
                    "low": 0      # <0.5
                },
                "polarity_distribution": {
                    "strongly_positive": 0,  # >0.5
                    "moderately_positive": 0, # 0.1-0.5
                    "neutral": 0,            # -0.1-0.1
                    "moderately_negative": 0, # -0.5-(-0.1)
                    "strongly_negative": 0   # <-0.5
                }
            }

        sentiment_counts = {
            "positive": 0,
            "negative": 0,
            "neutral": 0
        }

        theme_counts = {}
        language_counts = {"tr": 0, "en": 0}
        total_polarity = 0
        
        # Yeni metriklerin sayaçları
        confidence_counts = {"high": 0, "medium": 0, "low": 0}
        polarity_counts = {
            "strongly_positive": 0,
            "moderately_positive": 0,
            "neutral": 0,
            "moderately_negative": 0,
            "strongly_negative": 0
        }
        
        total_positive_score = 0
        total_negative_score = 0
        total_neutral_score = 0

        for comment in comments:
            sentiment = comment.get('sentiment', {})
            category = sentiment.get('category', 'neutral')
            polarity = sentiment.get('polarity', 0)
            confidence = sentiment.get('confidence', 0)
            themes = sentiment.get('theme', {})
            detailed_scores = sentiment.get('detailed_scores', {})
            
            # Duygu sayılarını güncelle
            sentiment_counts[category] += 1
            
            # Detaylı skorları topla
            total_positive_score += detailed_scores.get('positive_score', 0)
            total_negative_score += detailed_scores.get('negative_score', 0) 
            total_neutral_score += detailed_scores.get('neutral_score', 0)
            
            # Confidence dağılımı
            if confidence > 0.8:
                confidence_counts["high"] += 1
            elif confidence > 0.5:
                confidence_counts["medium"] += 1
            else:
                confidence_counts["low"] += 1
                
            # Polarite dağılımı
            if polarity > 0.5:
                polarity_counts["strongly_positive"] += 1
            elif polarity > 0.1:
                polarity_counts["moderately_positive"] += 1
            elif polarity > -0.1:
                polarity_counts["neutral"] += 1
            elif polarity > -0.5:
                polarity_counts["moderately_negative"] += 1
            else:
                polarity_counts["strongly_negative"] += 1
            
            # Tema sayılarını güncelle (daha düşük threshold)
            for theme, score in themes.items():
                if score > 0.05:  # Düşürülmüş eşik değeri
                    theme_counts[theme] = theme_counts.get(theme, 0) + 1
            
            # Dil dağılımını güncelle
            language = sentiment.get('language', 'en')
            if language in language_counts:
                language_counts[language] += 1
            else:
                language_counts[language] = 1
            
            total_polarity += polarity

        # Ortalama skorları hesapla
        avg_polarity = total_polarity / total_comments if total_comments > 0 else 0
        avg_positive_score = total_positive_score / total_comments if total_comments > 0 else 0
        avg_negative_score = total_negative_score / total_comments if total_comments > 0 else 0
        avg_neutral_score = total_neutral_score / total_comments if total_comments > 0 else 0

        return {
            "total": total_comments,
            "categories": sentiment_counts,
            "average_polarity": round(avg_polarity, 4),
            "language_distribution": language_counts,
            "themes": dict(sorted(theme_counts.items(), key=lambda x: x[1], reverse=True)),  # Temaları büyükten küçüğe sırala
            "confidence_distribution": confidence_counts,
            "polarity_distribution": polarity_counts,
            "detailed_averages": {
                "positive_score": round(avg_positive_score, 4),
                "negative_score": round(avg_negative_score, 4),
                "neutral_score": round(avg_neutral_score, 4)
            },
            "sentiment_ratios": {
                "positive_ratio": round(sentiment_counts["positive"] / total_comments, 4) if total_comments > 0 else 0,
                "negative_ratio": round(sentiment_counts["negative"] / total_comments, 4) if total_comments > 0 else 0,
                "neutral_ratio": round(sentiment_counts["neutral"] / total_comments, 4) if total_comments > 0 else 0
            }
        }

    def get_word_cloud(self, comments: List[Dict[str, Any]], max_words: int = 50) -> List[Dict[str, Any]]:
        """Gelişmiş kelime bulutu için sık kullanılan kelimeleri hesaplar"""
        try:
            if not comments:
                return []
                
            # Pozitif ve negatif yorumları ayır
            positive_texts = []
            negative_texts = []
            neutral_texts = []
            
            for comment in comments:
                text = comment.get('text', '')
                sentiment = comment.get('sentiment', {})
                category = sentiment.get('category', 'neutral')
                
                if category == 'positive':
                    positive_texts.append(text)
                elif category == 'negative':
                    negative_texts.append(text)
                else:
                    neutral_texts.append(text)
            
            # Tüm metinleri birleştir
            all_text = ' '.join(comment.get('text', '') for comment in comments)
            
            # Metni temizle
            cleaned_text = self.clean_text(all_text)
            
            # Kelimelere ayır
            words = cleaned_text.split()
            
            # Stop words'leri ve kısa kelimeleri kaldır
            filtered_words = []
            for word in words:
                if (word not in self.stop_words and 
                    len(word) > 2 and 
                    len(word) < 20 and  # Çok uzun kelimeleri filtrele
                    not word.isdigit()):  # Sayıları filtrele
                    filtered_words.append(word)
            
            # Kelime frekanslarını hesapla
            word_freq = Counter(filtered_words)
            
            # Çok sık kullanılan genel kelimeleri filtrele
            common_words = {'video', 'çok', 'güzel', 'iyi', 'kötü', 'var', 'yok', 'bu', 'şu', 'o', 'bir', 've', 'de', 'da', 'ki', 'için', 'ile', 'olan', 'olur', 'gibi', 'kadar', 'daha', 'en', 'çok', 'az', 'tüm', 'hep', 'her', 'hiç', 'şey', 'kez', 'defa'}
            
            # Filtrelenmiş kelime listesi
            final_words = {}
            for word, count in word_freq.items():
                if word.lower() not in common_words and count >= 2:  # En az 2 kez geçmeli
                    # Tema ve duygu ağırlığı ekle
                    weight = count
                    
                    # Pozitif/negatif yorumlarda geçen kelimeler daha önemli
                    positive_count = sum(1 for text in positive_texts if word.lower() in text.lower())
                    negative_count = sum(1 for text in negative_texts if word.lower() in text.lower())
                    
                    if positive_count > 0 or negative_count > 0:
                        weight += (positive_count + negative_count) * 0.5
                    
                    final_words[word] = int(weight)
            
            # En sık kullanılan kelimeleri döndür
            sorted_words = sorted(final_words.items(), key=lambda x: x[1], reverse=True)
            
            return [{"text": word, "value": count} 
                    for word, count in sorted_words[:max_words]]
                    
        except Exception as e:
            self.logger.error(f"Kelime bulutu oluşturma hatası: {str(e)}")
            return []

    def analyze_theme(self, text: str) -> Dict[str, float]:
        """Metin için gelişmiş tema analizi yapar"""
        try:
            if not text or len(text.strip()) == 0:
                return {theme: 0.0 for theme in self.theme_categories}

            # Metni temizle
            cleaned_text = self.clean_text(text)
            original_text = text.lower()
            
            # Anahtar kelime bazlı tema skoru hesaplama
            keyword_scores = {}
            for theme, keywords in self.theme_keywords.items():
                score = 0.0
                word_count = 0
                
                for keyword in keywords:
                    # Anahtar kelimenin metinde geçme sıklığı
                    keyword_count = original_text.count(keyword.lower())
                    if keyword_count > 0:
                        # Kelime uzunluğuna göre ağırlık (daha uzun kelimeler daha önemli)
                        weight = len(keyword) / 10.0
                        score += keyword_count * weight
                        word_count += keyword_count
                
                # Normalize et (0-1 arası)
                if word_count > 0:
                    keyword_scores[theme] = min(score / 5.0, 1.0)  # Max 1.0
                else:
                    keyword_scores[theme] = 0.0
            
            # ML tabanlı tema analizi (sadece anlamlı temalar için)
            ml_scores = {}
            try:
                # Sadece yüksek keyword skoru olan temaları ML ile kontrol et
                relevant_themes = [theme for theme, score in keyword_scores.items() if score > 0.1]
                
                if relevant_themes and len(cleaned_text) > 10:
                    # ML analizi yap
                    result = self.theme_classifier(
                        sequences=[cleaned_text],
                        candidate_labels=relevant_themes,
                        multi_label=True
                    )
                    
                    # Sonuçları parse et
                    if isinstance(result, list) and len(result) > 0:
                        first_result = result[0]
                        if isinstance(first_result, dict) and 'labels' in first_result and 'scores' in first_result:
                            ml_scores = dict(zip(first_result['labels'], first_result['scores']))
            
            except Exception as ml_error:
                self.logger.warning(f"ML tema analizi hatası, anahtar kelime analizi kullanılıyor: {ml_error}")
            
            # Hibrit skorlama: Anahtar kelime + ML skorlarını birleştir
            final_scores = {}
            for theme in self.theme_categories:
                keyword_score = keyword_scores.get(theme, 0.0)
                ml_score = ml_scores.get(theme, 0.0)
                
                # Ağırlıklı ortalama (keyword %60, ML %40)
                if keyword_score > 0 or ml_score > 0:
                    final_score = (keyword_score * 0.6) + (ml_score * 0.4)
                    final_scores[theme] = round(final_score, 4)
                else:
                    final_scores[theme] = 0.0
            
            # En az 0.05 threshold uygula
            filtered_scores = {theme: score for theme, score in final_scores.items() if score >= 0.05}
            
            # Hiç tema bulunamazsa, en yüksek 3 keyword skorunu döndür
            if not filtered_scores:
                top_keyword_themes = sorted(keyword_scores.items(), key=lambda x: x[1], reverse=True)[:3]
                for theme, score in top_keyword_themes:
                    if score > 0:
                        filtered_scores[theme] = max(score, 0.1)  # Minimum 0.1 ver
            
            return filtered_scores if filtered_scores else {theme: 0.0 for theme in self.theme_categories}
            
        except Exception as e:
            self.logger.error(f"Tema analizi hatası: {str(e)}")
            return {theme: 0.0 for theme in self.theme_categories}

    def clean_text(self, text: str) -> str:
        """Metni temizler ve normalize eder."""
        if not text:
            return ""
            
        # Küçük harfe çevir
        text = text.lower()
        
        # URL'leri kaldır
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)
        
        # Email adreslerini kaldır
        text = re.sub(r'\S+@\S+', '', text)
        
        # Emojileri koruyarak diğer özel karakterleri kaldır
        text = re.sub(r'[^\w\s\u263a-\U0001f645]', ' ', text)
        
        # Sayıları kaldır (ama zamanları koru)
        text = re.sub(r'\b\d{5,}\b', '', text)  # 5+ haneli sayıları kaldır
        
        # Çoklu boşlukları tek boşluğa çevir
        text = re.sub(r'\s+', ' ', text)
        
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
            theme_scores = {}
            total_comments = len(comments)
            
            # Her yorum için tema skorlarını topla
            for comment in comments:
                # Hem sentiment altındaki theme hem de doğrudan theme alanını kontrol et
                themes = comment.get('theme', {})
                if not themes and 'sentiment' in comment:
                    themes = comment['sentiment'].get('theme', {})
                
                for theme, score in themes.items():
                    if score > 0.05:  # Düşürülmüş eşik değeri
                        theme_counts[theme] = theme_counts.get(theme, 0) + 1
                        if theme not in theme_scores:
                            theme_scores[theme] = []
                        theme_scores[theme].append(score)
            
            # Tema analizi sonuçlarını oluştur
            theme_analysis = []
            for theme, count in theme_counts.items():
                percentage = (count / total_comments * 100) if total_comments > 0 else 0
                avg_score = sum(theme_scores[theme]) / len(theme_scores[theme]) if theme in theme_scores else 0
                
                theme_analysis.append({
                    'theme': theme,
                    'count': count,
                    'percentage': round(percentage, 2),
                    'avg_score': round(avg_score, 3)
                })
            
            # Sayıya göre sırala
            theme_analysis.sort(key=lambda x: x['count'], reverse=True)
            
            # En az bir tema olması için fallback
            if not theme_analysis and total_comments > 0:
                # En yüksek skorlu temaları bul
                all_themes_scores = {}
                for comment in comments:
                    themes = comment.get('theme', {})
                    if not themes and 'sentiment' in comment:
                        themes = comment['sentiment'].get('theme', {})
                    
                    for theme, score in themes.items():
                        if theme not in all_themes_scores:
                            all_themes_scores[theme] = []
                        all_themes_scores[theme].append(score)
                
                # En yüksek ortalama skora sahip temaları ekle
                for theme, scores in all_themes_scores.items():
                    if scores:
                        avg_score = sum(scores) / len(scores)
                        if avg_score > 0.01:  # Çok düşük eşik
                            theme_analysis.append({
                                'theme': theme,
                                'count': len(scores),
                                'percentage': round((len(scores) / total_comments * 100), 2),
                                'avg_score': round(avg_score, 3)
                            })
                
                theme_analysis.sort(key=lambda x: x['avg_score'], reverse=True)
            
            return theme_analysis[:15]  # En fazla 15 tema döndür
            
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
            
            # Tema analizi
            theme_analysis = self.get_theme_analysis(analyzed_comments)
            
            # sentiment_stats'e tema verilerini de ekle (backward compatibility için)
            sentiment_stats['themes'] = {}
            for theme_item in theme_analysis:
                sentiment_stats['themes'][theme_item['theme']] = theme_item['count']
            
            # Analiz sonuçlarını hazırla
            analysis_result = {
                'video_id': video_id,
                'video_title': video_title,
                'sentiment_stats': sentiment_stats,
                'word_cloud': word_cloud,
                'theme_analysis': theme_analysis,
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
                'video_id': video_id,
                'video_title': video_title,
                'total_comments': len(analyzed_comments),
                'sentiment_stats': sentiment_stats,
                'word_cloud': word_cloud,
                'theme_analysis': theme_analysis,
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
            
            # Tema analizi
            theme_analysis = self.get_theme_analysis(analyzed_comments)
            
            # sentiment_stats'e tema verilerini de ekle (backward compatibility için)
            sentiment_stats['themes'] = {}
            for theme_item in theme_analysis:
                sentiment_stats['themes'][theme_item['theme']] = theme_item['count']
            
            return {
                'video_id': video_id,
                'video_title': video_title,
                'total_comments': len(analyzed_comments),
                'sentiment_stats': sentiment_stats,
                'word_cloud': word_cloud,
                'theme_analysis': theme_analysis,
                'comments': analyzed_comments,
                'analysis_date': str(datetime.now())
            }
            
        except Exception as e:
            self.logger.error(f"Analiz özeti oluşturma hatası: {str(e)}")
            return {
                'error': str(e),
                'total_comments': 0,
                'sentiment_stats': {},
                'word_cloud': [],
                'theme_analysis': []
            } 