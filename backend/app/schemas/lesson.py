from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from app.models.lesson import LessonType, LessonStatus


class LessonBase(BaseModel):
    subject_id: int
    title: str
    description: Optional[str] = None
    lesson_type: LessonType
    scheduled_date: datetime
    duration_minutes: int = 60
    location_address: Optional[str] = None
    location_city: Optional[str] = None
    location_latitude: Optional[str] = None
    location_longitude: Optional[str] = None
    meeting_link: Optional[str] = None
    meeting_platform: Optional[str] = None


class LessonCreate(LessonBase):
    learner_id: int


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    location_address: Optional[str] = None
    location_city: Optional[str] = None
    meeting_link: Optional[str] = None
    meeting_platform: Optional[str] = None
    status: Optional[LessonStatus] = None


class LessonAccept(BaseModel):
    volunteer_id: int


class LessonFeedback(BaseModel):
    rating: int  # 1-5
    feedback: Optional[str] = None


class LessonResponse(LessonBase):
    id: int
    learner_id: int
    volunteer_id: Optional[int] = None
    status: LessonStatus
    rating: Optional[int] = None
    feedback: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
