from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base


# Tabela de associação para voluntários e suas áreas de atuação
volunteer_subjects = Table(
    'volunteer_subjects',
    Base.metadata,
    Column('volunteer_id', Integer, ForeignKey('volunteers.id'), primary_key=True),
    Column('subject_id', Integer, ForeignKey('subjects.id'), primary_key=True)
)


class Volunteer(Base):
    """Perfil de Voluntário (professor ou estudante)"""
    __tablename__ = "volunteers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False)
    volunteer_type = Column(String, nullable=False)  # "student" ou "teacher"
    institution = Column(String, nullable=True)  # Escola/Universidade
    document_url = Column(String, nullable=True)  # Comprovante enviado
    document_verified = Column(Integer, default=0)  # 0: pendente, 1: aprovado, 2: rejeitado
    verification_notes = Column(String, nullable=True)
    total_points = Column(Integer, default=0)
    total_lessons = Column(Integer, default=0)
    
    # Relacionamentos
    subjects = relationship("Subject", secondary=volunteer_subjects, back_populates="volunteers")
