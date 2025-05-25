from pydantic import BaseModel
from typing import Dict, Any

class Comment(BaseModel):
    id: str
    text: str
    author: str
    date: str
    language: str
    video_title: str
    sentiment: Dict[str, Any] 