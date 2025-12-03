from pydantic import BaseModel, ConfigDict
from typing import Optional, List


class SubjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    category: Optional[str] = None


class SubjectCreate(SubjectBase):
    pass


class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    category: Optional[str] = None


class SubjectResponse(SubjectBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)


class VolunteerBase(BaseModel):
    volunteer_type: str  # "student" ou "teacher"
    institution: Optional[str] = None
    subject_ids: List[int] = []


class VolunteerCreate(VolunteerBase):
    user_id: int
    document_url: Optional[str] = None


class VolunteerUpdate(BaseModel):
    volunteer_type: Optional[str] = None
    institution: Optional[str] = None
    document_url: Optional[str] = None
    subject_ids: Optional[List[int]] = None


class VolunteerResponse(BaseModel):
    id: int
    user_id: int
    volunteer_type: str
    institution: Optional[str] = None
    document_url: Optional[str] = None
    document_verified: int
    verification_notes: Optional[str] = None
    total_points: int
    total_lessons: int
    subjects: List[SubjectResponse] = []
    
    model_config = ConfigDict(from_attributes=True)


class LearnerBase(BaseModel):
    interest_ids: List[int] = []


class LearnerCreate(LearnerBase):
    user_id: int


class LearnerUpdate(BaseModel):
    interest_ids: Optional[List[int]] = None


class LearnerResponse(BaseModel):
    id: int
    user_id: int
    total_badges: int
    total_courses_completed: int
    total_quiz_score: int
    interests: List[SubjectResponse] = []
    
    model_config = ConfigDict(from_attributes=True)
