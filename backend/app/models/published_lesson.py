from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class PublishedLesson(Base):
    """Aulas publicadas por voluntários"""
    __tablename__ = "published_lessons"

    id = Column(Integer, primary_key=True, index=True)
    volunteer_id = Column(Integer, ForeignKey('volunteers.id'), nullable=False)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=False)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # Mídia
    media_url = Column(String, nullable=True)  # URL do arquivo de vídeo/imagem
    media_type = Column(String, nullable=True)  # "video", "image", "pdf", etc
    
    # Metadados
    views_count = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
