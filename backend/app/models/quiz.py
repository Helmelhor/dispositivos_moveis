from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from app.database import Base


class Quiz(Base):
    """Quiz educativo"""
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=True)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    passing_score = Column(Integer, default=70)  # Porcentagem mínima para passar
    time_limit_minutes = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class QuizQuestion(Base):
    """Perguntas do quiz"""
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey('quizzes.id'), nullable=False)
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # Lista de opções: ["A", "B", "C", "D"]
    correct_answer = Column(String, nullable=False)  # Índice da resposta correta
    explanation = Column(Text, nullable=True)
    points = Column(Integer, default=10)
    order_index = Column(Integer, default=0)


class QuizAttempt(Base):
    """Tentativas de quiz dos alunos"""
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    learner_id = Column(Integer, ForeignKey('learners.id'), nullable=False)
    quiz_id = Column(Integer, ForeignKey('quizzes.id'), nullable=False)
    score = Column(Integer, default=0)
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, default=0)
    is_passed = Column(Boolean, default=False)
    answers = Column(JSON, nullable=True)  # Respostas do aluno
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
