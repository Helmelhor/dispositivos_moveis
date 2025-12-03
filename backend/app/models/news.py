from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Enum as SQLEnum
from sqlalchemy.sql import func
from app.database import Base
import enum


class NewsType(str, enum.Enum):
    NEWS = "news"
    EVENT = "event"
    CAMPAIGN = "campaign"
    ANNOUNCEMENT = "announcement"


class News(Base):
    """Notícias, Eventos e Campanhas"""
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    content = Column(Text, nullable=False)
    news_type = Column(SQLEnum(NewsType), nullable=False)
    author = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    
    # Para eventos
    event_date = Column(DateTime(timezone=True), nullable=True)
    event_location = Column(String, nullable=True)
    event_link = Column(String, nullable=True)
    
    # Para campanhas
    campaign_goal = Column(String, nullable=True)  # Ex: "Arrecadar 1000 cadernos"
    campaign_end_date = Column(DateTime(timezone=True), nullable=True)
    campaign_contact = Column(String, nullable=True)
    
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    views_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)
