from fastapi import APIRouter, HTTPException, Depends, Header
from ..services.gemini import analyze_comments
from ..models.comment import Comment
from typing import List
from pydantic import BaseModel
import firebase_admin
from firebase_admin import auth

router = APIRouter()

class User(BaseModel):
    uid: str
    email: str
    display_name: str = None

class AnalyzeRequest(BaseModel):
    comments: List[Comment]
    question: str

async def get_current_user(authorization: str = Header(None)) -> User:
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Kimlik doğrulama gerekli"
        )
    
    try:
        # Bearer token'dan token'ı ayıkla
        token = authorization.split("Bearer ")[1]
        
        # Firebase ile token'ı doğrula
        decoded_token = auth.verify_id_token(token)
        
        # Kullanıcı bilgilerini döndür
        return User(
            uid=decoded_token["uid"],
            email=decoded_token["email"],
            display_name=decoded_token.get("name")
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Geçersiz token: {str(e)}"
        )

@router.post("/analyze")
async def analyze_comments_endpoint(
    request: AnalyzeRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        results = await analyze_comments(request.comments)
        return {
            "analysis": results["analysis"],
            "timestamp": results["timestamp"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 