from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List, Dict, Any


class QuizBase(BaseModel):
    course_id: Optional[int] = None
    subject_id: int
    title: str
    description: Optional[str] = None
    passing_score: int = 70
    time_limit_minutes: Optional[int] = None


class QuizCreate(QuizBase):
    pass


class QuizUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    passing_score: Optional[int] = None
    time_limit_minutes: Optional[int] = None
    is_active: Optional[bool] = None


class QuizResponse(QuizBase):
    id: int
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class QuizQuestionBase(BaseModel):
    quiz_id: int
    question_text: str
    options: List[str]
    correct_answer: str
    explanation: Optional[str] = None
    points: int = 10
    order_index: int = 0


class QuizQuestionCreate(QuizQuestionBase):
    pass


class QuizQuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None
    points: Optional[int] = None
    order_index: Optional[int] = None


class QuizQuestionResponse(BaseModel):
    id: int
    quiz_id: int
    question_text: str
    options: List[str]
    explanation: Optional[str] = None
    points: int
    order_index: int
    
    model_config = ConfigDict(from_attributes=True)


class QuizQuestionResponseWithAnswer(QuizQuestionResponse):
    correct_answer: str


class QuizAttemptBase(BaseModel):
    learner_id: int
    quiz_id: int
    answers: Dict[str, Any]  # {"question_id": "answer"}


class QuizAttemptCreate(BaseModel):
    quiz_id: int
    answers: Dict[str, Any]


class QuizAttemptResponse(BaseModel):
    id: int
    learner_id: int
    quiz_id: int
    score: int
    total_questions: int
    correct_answers: int
    is_passed: bool
    started_at: datetime
    completed_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
