from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Enum as SQLEnum
from sqlalchemy.sql import func
from app.database import Base
import enum


class PartnerType(str, enum.Enum):
    ONG = "ong"
    SCHOOL = "school"
    LIBRARY = "library"
    COMMUNITY_CENTER = "community_center"
    OTHER = "other"


class PartnerLocation(Base):
    """Locais parceiros (ONGs, escolas, bibliotecas)"""
    __tablename__ = "partner_locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    partner_type = Column(SQLEnum(PartnerType), nullable=False)
    description = Column(Text, nullable=True)
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    latitude = Column(String, nullable=True)
    longitude = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    website = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
