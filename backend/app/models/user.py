from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Enum as SQLEnum
from sqlalchemy.sql import func
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    LEARNER = "learner"  # Aprendiz
    VOLUNTEER = "volunteer"  # Voluntário


class UserStatus(str, enum.Enum):
    PENDING = "pending"  # Aguardando aprovação
    ACTIVE = "active"  # Ativo
    INACTIVE = "inactive"  # Inativo
    REJECTED = "rejected"  # Rejeitado


class User(Base):
    """Modelo base de usuário"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False)
    status = Column(SQLEnum(UserStatus), default=UserStatus.PENDING)
    phone = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)
    location_city = Column(String, nullable=True)
    location_state = Column(String, nullable=True)
    location_latitude = Column(String, nullable=True)
    location_longitude = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    is_online_available = Column(Boolean, default=True)
    is_presencial_available = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
