from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.lesson import Lesson
from app.models.learner import Learner
from app.models.volunteer import Volunteer
from app.models.user import User
from app.schemas.lesson import (
    LessonCreate, LessonUpdate, LessonResponse,
    LessonAccept, LessonFeedback
)
from app.websocket.manager import manager


router = APIRouter(prefix="/lessons", tags=["lessons"])


@router.post("/", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
async def create_lesson(lesson: LessonCreate, db: Session = Depends(get_db)):
    """Criar solicitação de aula"""
    # Verificar se learner existe
    learner = db.query(Learner).filter(Learner.id == lesson.learner_id).first()
    if not learner:
        raise HTTPException(status_code=404, detail="Aprendiz não encontrado")
    
    db_lesson = Lesson(**lesson.model_dump())
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    
    await manager.broadcast({
        "type": "lesson_requested",
        "data": LessonResponse.model_validate(db_lesson).model_dump(mode='json')
    })
    
    return db_lesson


@router.get("/", response_model=List[LessonResponse])
def get_lessons(
    learner_id: int = None,
    volunteer_id: int = None,
    subject_id: int = None,
    status_filter: str = None,
    lesson_type: str = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Listar aulas com filtros"""
    query = db.query(Lesson)
    
    if learner_id:
        query = query.filter(Lesson.learner_id == learner_id)
    if volunteer_id:
        query = query.filter(Lesson.volunteer_id == volunteer_id)
    if subject_id:
        query = query.filter(Lesson.subject_id == subject_id)
    if status_filter:
        query = query.filter(Lesson.status == status_filter)
    if lesson_type:
        query = query.filter(Lesson.lesson_type == lesson_type)
    
    lessons = query.order_by(Lesson.scheduled_date.desc()).offset(skip).limit(limit).all()
    return lessons


@router.get("/available", response_model=List[LessonResponse])
def get_available_lessons(
    city: str = None,
    subject_id: int = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Voluntários veem solicitações disponíveis"""
    query = db.query(Lesson).filter(Lesson.status == "requested")
    
    if subject_id:
        query = query.filter(Lesson.subject_id == subject_id)
    
    if city:
        query = query.filter(Lesson.location_city == city)
    
    lessons = query.order_by(Lesson.created_at.desc()).offset(skip).limit(limit).all()
    return lessons


@router.get("/{lesson_id}", response_model=LessonResponse)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    """Retorna aula específica"""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Aula não encontrada")
    return lesson


@router.put("/{lesson_id}", response_model=LessonResponse)
async def update_lesson(
    lesson_id: int,
    lesson: LessonUpdate,
    db: Session = Depends(get_db)
):
    """Atualiza informações da aula"""
    db_lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not db_lesson:
        raise HTTPException(status_code=404, detail="Aula não encontrada")
    
    update_data = lesson.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_lesson, field, value)
    
    db.commit()
    db.refresh(db_lesson)
    
    await manager.broadcast({
        "type": "lesson_updated",
        "data": LessonResponse.model_validate(db_lesson).model_dump(mode='json')
    })
    
    return db_lesson


@router.post("/{lesson_id}/accept", response_model=LessonResponse)
async def accept_lesson(
    lesson_id: int,
    accept_data: LessonAccept,
    db: Session = Depends(get_db)
):
    """Voluntário aceita aula"""
    db_lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not db_lesson:
        raise HTTPException(status_code=404, detail="Aula não encontrada")
    
    if db_lesson.status != "requested":
        raise HTTPException(status_code=400, detail="Aula não está disponível")
    
    # Verificar se voluntário existe
    volunteer = db.query(Volunteer).filter(Volunteer.id == accept_data.volunteer_id).first()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Voluntário não encontrado")
    
    db_lesson.volunteer_id = accept_data.volunteer_id
    db_lesson.status = "accepted"
    
    db.commit()
    db.refresh(db_lesson)
    
    await manager.broadcast({
        "type": "lesson_accepted",
        "data": LessonResponse.model_validate(db_lesson).model_dump(mode='json')
    })
    
    return db_lesson


@router.post("/{lesson_id}/confirm", response_model=LessonResponse)
async def confirm_lesson(lesson_id: int, db: Session = Depends(get_db)):
    """Confirmar aula (após aceita)"""
    db_lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not db_lesson:
        raise HTTPException(status_code=404, detail="Aula não encontrada")
    
    if db_lesson.status != "accepted":
        raise HTTPException(status_code=400, detail="Aula precisa estar aceita")
    
    db_lesson.status = "confirmed"
    db.commit()
    db.refresh(db_lesson)
    
    await manager.broadcast({
        "type": "lesson_confirmed",
        "data": LessonResponse.model_validate(db_lesson).model_dump(mode='json')
    })
    
    return db_lesson


@router.post("/{lesson_id}/complete", response_model=LessonResponse)
async def complete_lesson(
    lesson_id: int,
    feedback: LessonFeedback = None,
    db: Session = Depends(get_db)
):
    """Marcar aula como concluída"""
    db_lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not db_lesson:
        raise HTTPException(status_code=404, detail="Aula não encontrada")
    
    db_lesson.status = "completed"
    
    if feedback:
        db_lesson.rating = feedback.rating
        db_lesson.feedback = feedback.feedback
    
    # Adicionar pontos ao voluntário
    if db_lesson.volunteer_id:
        volunteer = db.query(Volunteer).filter(Volunteer.id == db_lesson.volunteer_id).first()
        if volunteer:
            volunteer.total_points += 10
            volunteer.total_lessons += 1
    
    db.commit()
    db.refresh(db_lesson)
    
    await manager.broadcast({
        "type": "lesson_completed",
        "data": LessonResponse.model_validate(db_lesson).model_dump(mode='json')
    })
    
    return db_lesson


@router.delete("/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_lesson(lesson_id: int, db: Session = Depends(get_db)):
    """Cancelar aula"""
    db_lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not db_lesson:
        raise HTTPException(status_code=404, detail="Aula não encontrada")
    
    db_lesson.status = "cancelled"
    db.commit()
    
    await manager.broadcast({
        "type": "lesson_cancelled",
        "data": {"id": lesson_id}
    })
    
    return None
