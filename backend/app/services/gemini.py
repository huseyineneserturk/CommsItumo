import os
import json
from typing import List, Dict, Any
from datetime import datetime
from ..models.comment import Comment
import google.generativeai as genai
from dotenv import load_dotenv

# Gemini API'yi başlat
load_dotenv()
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

async def analyze_comments(comments: List[Comment]) -> Dict[str, Any]:
    """Yorumları Gemini API ile analiz eder."""
    try:
        # Gemini modelini başlat
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Yorumları metin formatına dönüştür
        comments_text = "\n".join([
            f"Yorum {i+1}: {comment.text} (Duygu: {json.dumps(comment.sentiment)})"
            for i, comment in enumerate(comments)
        ])
        
        # Analiz için prompt oluştur
        prompt = f"""
        - Eğer ki sana aşağıdaki gibi bir yorum paketi gelirse aşağıdaki YouTube yorumlarını analiz et ve şu konularda değerlendirme yap:
        1. Genel duygu durumu
        2. En çok bahsedilen konular
        3. Öne çıkan öneriler veya eleştiriler
        4. İyileştirme önerileri
        
        - Eğer ki sana aşağıdaki gibi bir yorum paketi gelmezse kullanıcı ile aynı bir Youtuber yardımcısı gibi sohbet et. Kullanıcının sorularını yanıtla.
        
        Her iki durum için de tatlı emojiler kullan. Samimi ol.

        Yorumlar:
        {comments_text}
        """
        
        # Gemini API'ye istek gönder
        response = model.generate_content(prompt)
        
        return {
            "analysis": response.text,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        print(f"Gemini analiz hatası: {str(e)}")
        raise 