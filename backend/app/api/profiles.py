from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.volunteer import Volunteer
from app.models.learner import Learner
from app.models.subject import Subject
from app.schemas.profiles import (
    VolunteerCreate, VolunteerUpdate, VolunteerResponse,
    LearnerCreate, LearnerUpdate, LearnerResponse
)
from app.websocket.manager import manager


router = APIRouter(prefix="/profiles", tags=["profiles"])


# ==================== VOLUNTEER ROUTES ====================

@router.post("/volunteers", response_model=VolunteerResponse, status_code=status.HTTP_201_CREATED)
async def create_volunteer(volunteer: VolunteerCreate, db: Session = Depends(get_db)):
    """Cria perfil de voluntário"""
    # Verificar se usuário existe
    user = db.query(User).filter(User.id == volunteer.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    # Verificar se já tem perfil
    existing = db.query(Volunteer).filter(Volunteer.user_id == volunteer.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Voluntário já possui perfil")
    
    # Criar voluntário
    volunteer_data = volunteer.model_dump(exclude={'subject_ids'})
    db_volunteer = Volunteer(**volunteer_data)
    
    # Adicionar disciplinas
    if volunteer.subject_ids:
        subjects = db.query(Subject).filter(Subject.id.in_(volunteer.subject_ids)).all()
        db_volunteer.subjects = subjects
    
    db.add(db_volunteer)
    db.commit()
    db.refresh(db_volunteer)
    
    await manager.broadcast({
        "type": "volunteer_created",
        "data": {"volunteer_id": db_volunteer.id, "user_id": db_volunteer.user_id}
    })
    
    return db_volunteer


@router.get("/volunteers/{volunteer_id}", response_model=VolunteerResponse)
def get_volunteer(volunteer_id: int, db: Session = Depends(get_db)):
    """Retorna perfil de voluntário"""
    volunteer = db.query(Volunteer).filter(Volunteer.id == volunteer_id).first()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Voluntário não encontrado")
    return volunteer


@router.get("/volunteers/user/{user_id}", response_model=VolunteerResponse)
def get_volunteer_by_user(user_id: int, db: Session = Depends(get_db)):
    """Retorna perfil de voluntário por user_id"""
    volunteer = db.query(Volunteer).filter(Volunteer.user_id == user_id).first()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Voluntário não encontrado")
    return volunteer


@router.get("/volunteers", response_model=List[VolunteerResponse])
def search_volunteers(
    subject_id: int = None,
    city: str = None,
    volunteer_type: str = None,
    verified_only: bool = False,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Busca voluntários por filtros"""
    query = db.query(Volunteer)
    
    if verified_only:
        query = query.filter(Volunteer.document_verified == 1)
    
    if volunteer_type:
        query = query.filter(Volunteer.volunteer_type == volunteer_type)
    
    if subject_id:
        query = query.join(Volunteer.subjects).filter(Subject.id == subject_id)
    
    if city:
        query = query.join(User).filter(User.location_city == city)
    
    volunteers = query.offset(skip).limit(limit).all()
    return volunteers


@router.put("/volunteers/{volunteer_id}", response_model=VolunteerResponse)
async def update_volunteer(
    volunteer_id: int,
    volunteer: VolunteerUpdate,
    db: Session = Depends(get_db)
):
    """Atualiza perfil de voluntário"""
    db_volunteer = db.query(Volunteer).filter(Volunteer.id == volunteer_id).first()
    if not db_volunteer:
        raise HTTPException(status_code=404, detail="Voluntário não encontrado")
    
    update_data = volunteer.model_dump(exclude_unset=True, exclude={'subject_ids'})
    for field, value in update_data.items():
        setattr(db_volunteer, field, value)
    
    # Atualizar disciplinas se fornecido
    if volunteer.subject_ids is not None:
        subjects = db.query(Subject).filter(Subject.id.in_(volunteer.subject_ids)).all()
        db_volunteer.subjects = subjects
    
    db.commit()
    db.refresh(db_volunteer)
    
    await manager.broadcast({
        "type": "volunteer_updated",
        "data": {"volunteer_id": db_volunteer.id}
    })
    
    return db_volunteer


# ==================== LEARNER ROUTES ====================

@router.post("/learners", response_model=LearnerResponse, status_code=status.HTTP_201_CREATED)
async def create_learner(learner: LearnerCreate, db: Session = Depends(get_db)):
    """Cria perfil de aprendiz"""
    # Verificar se usuário existe
    user = db.query(User).filter(User.id == learner.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    # Verificar se já tem perfil
    existing = db.query(Learner).filter(Learner.user_id == learner.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Aprendiz já possui perfil")
    
    # Criar aprendiz
    learner_data = learner.model_dump(exclude={'interest_ids'})
    db_learner = Learner(**learner_data)
    
    # Adicionar áreas de interesse
    if learner.interest_ids:
        interests = db.query(Subject).filter(Subject.id.in_(learner.interest_ids)).all()
        db_learner.interests = interests
    
    db.add(db_learner)
    db.commit()
    db.refresh(db_learner)
    
    await manager.broadcast({
        "type": "learner_created",
        "data": {"learner_id": db_learner.id, "user_id": db_learner.user_id}
    })
    
    return db_learner


@router.get("/learners/{learner_id}", response_model=LearnerResponse)
def get_learner(learner_id: int, db: Session = Depends(get_db)):
    """Retorna perfil de aprendiz"""
    learner = db.query(Learner).filter(Learner.id == learner_id).first()
    if not learner:
        raise HTTPException(status_code=404, detail="Aprendiz não encontrado")
    return learner


@router.get("/learners/user/{user_id}", response_model=LearnerResponse)
def get_learner_by_user(user_id: int, db: Session = Depends(get_db)):
    """Retorna perfil de aprendiz por user_id"""
    learner = db.query(Learner).filter(Learner.user_id == user_id).first()
    if not learner:
        raise HTTPException(status_code=404, detail="Aprendiz não encontrado")
    return learner


@router.put("/learners/{learner_id}", response_model=LearnerResponse)
async def update_learner(
    learner_id: int,
    learner: LearnerUpdate,
    db: Session = Depends(get_db)
):
    """Atualiza perfil de aprendiz"""
    db_learner = db.query(Learner).filter(Learner.id == learner_id).first()
    if not db_learner:
        raise HTTPException(status_code=404, detail="Aprendiz não encontrado")
    
    # Atualizar áreas de interesse se fornecido
    if learner.interest_ids is not None:
        interests = db.query(Subject).filter(Subject.id.in_(learner.interest_ids)).all()
        db_learner.interests = interests
    
    db.commit()
    db.refresh(db_learner)
    
    await manager.broadcast({
        "type": "learner_updated",
        "data": {"learner_id": db_learner.id}
    })
    
    return db_learner
