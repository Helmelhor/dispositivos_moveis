from sqlalchemy import Column, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base


# Tabela de associação para aprendizes e suas áreas de interesse
learner_interests = Table(
    'learner_interests',
    Base.metadata,
    Column('learner_id', Integer, ForeignKey('learners.id'), primary_key=True),
    Column('subject_id', Integer, ForeignKey('subjects.id'), primary_key=True)
)


class Learner(Base):
    """Perfil de Aprendiz (aluno)"""
    __tablename__ = "learners"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False)
    total_badges = Column(Integer, default=0)
    total_courses_completed = Column(Integer, default=0)
    total_quiz_score = Column(Integer, default=0)
    
    # Relacionamentos
    interests = relationship("Subject", secondary=learner_interests, back_populates="learners")
