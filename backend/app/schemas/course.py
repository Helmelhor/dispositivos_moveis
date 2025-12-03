from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List
from app.models.course import ContentType


class CourseBase(BaseModel):
    subject_id: int
    title: str
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    difficulty_level: Optional[str] = None
    duration_hours: Optional[int] = None


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    difficulty_level: Optional[str] = None
    duration_hours: Optional[int] = None
    is_active: Optional[bool] = None


class CourseResponse(CourseBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class CourseMaterialBase(BaseModel):
    course_id: int
    title: str
    content_type: ContentType
    content_url: str
    description: Optional[str] = None
    order_index: int = 0
    duration_minutes: Optional[int] = None


class CourseMaterialCreate(CourseMaterialBase):
    pass


class CourseMaterialUpdate(BaseModel):
    title: Optional[str] = None
    content_url: Optional[str] = None
    description: Optional[str] = None
    order_index: Optional[int] = None
    duration_minutes: Optional[int] = None


class CourseMaterialResponse(CourseMaterialBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class CourseProgressBase(BaseModel):
    learner_id: int
    course_id: int


class CourseProgressUpdate(BaseModel):
    completed_materials: int
    total_materials: int
    is_completed: bool = False


class CourseProgressResponse(BaseModel):
    id: int
    learner_id: int
    course_id: int
    completed_materials: int
    total_materials: int
    is_completed: bool
    completed_at: Optional[datetime] = None
    started_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
