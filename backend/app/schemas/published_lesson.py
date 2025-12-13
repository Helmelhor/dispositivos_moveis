from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class PublishedLessonBase(BaseModel):
    subject_id: int
    title: str
    description: Optional[str] = None


class PublishedLessonCreate(PublishedLessonBase):
    pass


class PublishedLessonUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class PublishedLessonResponse(PublishedLessonBase):
    id: int
    volunteer_id: int
    media_url: Optional[str] = None
    media_type: Optional[str] = None
    views_count: int
    likes_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
