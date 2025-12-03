from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.volunteer import volunteer_subjects
from app.models.learner import learner_interests


class Subject(Base):
    """Disciplinas/Áreas de conhecimento"""
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    icon = Column(String, nullable=True)  # Nome do ícone ou URL
    category = Column(String, nullable=True)  # Ex: "Exatas", "Humanas", "Tecnologia"
    
    # Relacionamentos
    volunteers = relationship("Volunteer", secondary=volunteer_subjects, back_populates="subjects")
    learners = relationship("Learner", secondary=learner_interests, back_populates="interests")
