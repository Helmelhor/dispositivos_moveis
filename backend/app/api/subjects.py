from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.subject import Subject
from app.schemas.profiles import SubjectCreate, SubjectUpdate, SubjectResponse
from app.websocket.manager import manager


router = APIRouter(prefix="/subjects", tags=["subjects"])


@router.get("/", response_model=List[SubjectResponse])
def get_subjects(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    db: Session = Depends(get_db)
):
    """Retorna todas as disciplinas"""
    query = db.query(Subject)
    if category:
        query = query.filter(Subject.category == category)
    subjects = query.offset(skip).limit(limit).all()
    return subjects


@router.get("/{subject_id}", response_model=SubjectResponse)
def get_subject(subject_id: int, db: Session = Depends(get_db)):
    """Retorna uma disciplina específica"""
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Disciplina não encontrada")
    return subject


@router.post("/", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
async def create_subject(subject: SubjectCreate, db: Session = Depends(get_db)):
    """Cria uma nova disciplina"""
    # Verificar se já existe
    existing = db.query(Subject).filter(Subject.name == subject.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Disciplina já existe")
    
    db_subject = Subject(**subject.model_dump())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    
    await manager.broadcast({
        "type": "subject_created",
        "data": SubjectResponse.model_validate(db_subject).model_dump(mode='json')
    })
    
    return db_subject


@router.put("/{subject_id}", response_model=SubjectResponse)
async def update_subject(
    subject_id: int,
    subject: SubjectUpdate,
    db: Session = Depends(get_db)
):
    """Atualiza uma disciplina"""
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Disciplina não encontrada")
    
    update_data = subject.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_subject, field, value)
    
    db.commit()
    db.refresh(db_subject)
    
    await manager.broadcast({
        "type": "subject_updated",
        "data": SubjectResponse.model_validate(db_subject).model_dump(mode='json')
    })
    
    return db_subject


@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    """Deleta uma disciplina"""
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Disciplina não encontrada")
    
    db.delete(db_subject)
    db.commit()
    
    await manager.broadcast({
        "type": "subject_deleted",
        "data": {"id": subject_id}
    })
    
    return None
