from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from app.database import Base
import enum


class LessonType(str, enum.Enum):
    ONLINE = "online"
    PRESENCIAL = "presencial"


class LessonStatus(str, enum.Enum):
    REQUESTED = "requested"  # Solicitada
    ACCEPTED = "accepted"  # Aceita
    CONFIRMED = "confirmed"  # Confirmada
    COMPLETED = "completed"  # Concluída
    CANCELLED = "cancelled"  # Cancelada


class Lesson(Base):
    """Agendamento de aulas"""
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    learner_id = Column(Integer, ForeignKey('learners.id'), nullable=False)
    volunteer_id = Column(Integer, ForeignKey('volunteers.id'), nullable=True)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=False)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    lesson_type = Column(SQLEnum(LessonType), nullable=False)
    status = Column(SQLEnum(LessonStatus), default=LessonStatus.REQUESTED)
    
    scheduled_date = Column(DateTime(timezone=True), nullable=False)
    duration_minutes = Column(Integer, default=60)
    
    # Para aulas presenciais
    location_address = Column(String, nullable=True)
    location_city = Column(String, nullable=True)
    location_latitude = Column(String, nullable=True)
    location_longitude = Column(String, nullable=True)
    
    # Para aulas online
    meeting_link = Column(String, nullable=True)
    meeting_platform = Column(String, nullable=True)  # "google_meet", "zoom", etc
    
    # Avaliação
    rating = Column(Integer, nullable=True)  # 1-5
    feedback = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
