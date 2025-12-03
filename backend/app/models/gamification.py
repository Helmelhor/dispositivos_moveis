from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from app.database import Base
import enum


class BadgeType(str, enum.Enum):
    COURSE_COMPLETION = "course_completion"
    QUIZ_MASTER = "quiz_master"
    LESSON_STREAK = "lesson_streak"
    HELPER = "helper"
    SPECIAL = "special"


class Badge(Base):
    """Selos/Conquistas disponíveis"""
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String, nullable=True)
    badge_type = Column(SQLEnum(BadgeType), nullable=False)
    requirement_value = Column(Integer, default=1)  # Ex: completar 5 cursos
    points_reward = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class UserBadge(Base):
    """Selos conquistados pelos usuários"""
    __tablename__ = "user_badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    badge_id = Column(Integer, ForeignKey('badges.id'), nullable=False)
    earned_at = Column(DateTime(timezone=True), server_default=func.now())


class PointsTransaction(Base):
    """Histórico de pontos"""
    __tablename__ = "points_transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    points = Column(Integer, nullable=False)
    reason = Column(String, nullable=False)  # "lesson_completed", "quiz_passed", etc
    reference_id = Column(Integer, nullable=True)  # ID da aula, quiz, etc
    created_at = Column(DateTime(timezone=True), server_default=func.now())
