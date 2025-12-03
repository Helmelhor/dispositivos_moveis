from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from app.database import Base
import enum


class ContentType(str, enum.Enum):
    VIDEO = "video"
    PDF = "pdf"
    ARTICLE = "article"


class Course(Base):
    """Cursos educativos"""
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=False)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    thumbnail = Column(String, nullable=True)
    difficulty_level = Column(String, nullable=True)  # "beginner", "intermediate", "advanced"
    duration_hours = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class CourseMaterial(Base):
    """Materiais do curso (apostilas, vídeos)"""
    __tablename__ = "course_materials"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    title = Column(String, nullable=False)
    content_type = Column(SQLEnum(ContentType), nullable=False)
    content_url = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)
    duration_minutes = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CourseProgress(Base):
    """Progresso do aluno nos cursos"""
    __tablename__ = "course_progress"

    id = Column(Integer, primary_key=True, index=True)
    learner_id = Column(Integer, ForeignKey('learners.id'), nullable=False)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    completed_materials = Column(Integer, default=0)
    total_materials = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
