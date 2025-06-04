import os
import json
from typing import List, Dict, Any, Optional
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
        Aşağıdaki YouTube yorumlarını analiz et ve şu konularda değerlendirme yap:
        1. Genel duygu durumu
        2. En çok bahsedilen konular
        3. Öne çıkan öneriler veya eleştiriler
        4. İyileştirme önerileri
        
        Tatlı emojiler kullan. Samimi ol.

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

async def chat_with_ai(message: str, comments: Optional[List[Comment]] = None) -> Dict[str, Any]:
    """AI ile normal sohbet eder."""
    try:
        # Gemini modelini başlat
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Sohbet için sistem mesajı
        system_prompt = """
        Sen CommsItumo platformunun AI asistanısın. YouTuber'lara ve içerik üreticilerine yardım eden samimi ve yardımsever bir asistansın.
        
        Görevlerin:
        - YouTube içerik üretimi hakkında tavsiyelerde bulunmak
        - Kanal büyütme stratejileri paylaşmak
        - İçerik fikirlerinde yardım etmek
        - Teknik sorulara yanıt vermek
        - Genel sorulara samimi bir şekilde cevap vermek
        
        Tatlı emojiler kullan ve samimi ol. Türkçe konuş.
        """
        
        # Kullanıcı mesajını işle
        full_prompt = f"{system_prompt}\n\nKullanıcı: {message}\n\nAsistan:"
        
        # Gemini API'ye istek gönder
        response = model.generate_content(full_prompt)
        
        return {
            "response": response.text,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        print(f"Gemini chat hatası: {str(e)}")
        raise 