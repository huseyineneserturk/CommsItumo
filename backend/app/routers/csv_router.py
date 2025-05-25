from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from services.csv_analyzer import CSVAnalyzer
from ..models.comment import Comment
from typing import Dict, Any, List
import tempfile
import os
import logging

logger = logging.getLogger(__name__)

router = APIRouter()
security = HTTPBearer()
csv_analyzer = CSVAnalyzer()

@router.post("/upload", response_model=Dict[str, Any])
async def upload_csv(
    file: UploadFile = File(...),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    logger.info(f"Dosya yükleme isteği alındı: {file.filename}")
    
    if not file.filename.endswith('.csv'):
        error_msg = "Sadece CSV dosyaları kabul edilir"
        logger.error(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)
    
    try:
        # Geçici dosya oluştur
        with tempfile.NamedTemporaryFile(delete=False, suffix='.csv') as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
            logger.info(f"Geçici dosya oluşturuldu: {temp_file_path}")
        
        # CSV analizi yap
        logger.info("CSV analizi başlatılıyor...")
        result = csv_analyzer.analyze_csv(temp_file_path)
        logger.info("CSV analizi tamamlandı")
        
        # Geçici dosyayı sil
        os.unlink(temp_file_path)
        logger.info("Geçici dosya silindi")
        
        return {"data": result}
    
    except Exception as e:
        error_msg = f"CSV analiz hatası: {str(e)}"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@router.post("/export")
async def export_comments(comments: List[Comment]):
    try:
        file_path = csv_analyzer.export_comments(comments)
        return {"file_path": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{filename}")
async def download_csv(filename: str):
    try:
        return csv_analyzer.download_csv(filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 