from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import os
from pathlib import Path
from app.database import get_db
from app.models.published_lesson import PublishedLesson
from app.models.volunteer import Volunteer
from app.models.user import User, UserRole
from app.schemas.published_lesson import (
    PublishedLessonCreate, PublishedLessonUpdate, PublishedLessonResponse
)


router = APIRouter(prefix="/published-lessons", tags=["published_lessons"])

# Diretório para armazenar arquivos de mídia
MEDIA_DIR = Path("uploads/media")
MEDIA_DIR.mkdir(parents=True, exist_ok=True)

# Extensões permitidas
ALLOWED_EXTENSIONS = {
    'video': {'mp4', 'avi', 'mov', 'mkv', 'webm'},
    'image': {'jpg', 'jpeg', 'png', 'gif', 'webp'},
    'pdf': {'pdf'},
}


def get_current_volunteer(db: Session, user_id: int) -> Volunteer:
    """Verifica se o usuário é um voluntário"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.role != UserRole.VOLUNTEER:
        raise HTTPException(status_code=403, detail="Apenas voluntários podem publicar aulas")
    
    volunteer = db.query(Volunteer).filter(Volunteer.user_id == user_id).first()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Perfil de voluntário não encontrado")
    
    return volunteer


@router.post("/", response_model=PublishedLessonResponse, status_code=status.HTTP_201_CREATED)
async def publish_lesson(
    subject_id: int = Form(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    volunteer_id: int = Form(...),
    media_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """Voluntário publica uma aula"""
    
    # Verificar se voluntário existe
    volunteer = db.query(Volunteer).filter(Volunteer.id == volunteer_id).first()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Voluntário não encontrado")
    
    # Processar arquivo de mídia se fornecido
    media_url = None
    media_type = None
    
    if media_file:
        # Validar extensão
        file_ext = media_file.filename.split('.')[-1].lower()
        media_category = None
        
        for category, extensions in ALLOWED_EXTENSIONS.items():
            if file_ext in extensions:
                media_category = category
                break
        
        if not media_category:
            raise HTTPException(
                status_code=400, 
                detail=f"Tipo de arquivo não permitido. Extensões válidas: {', '.join([ext for exts in ALLOWED_EXTENSIONS.values() for ext in exts])}"
            )
        
        # Salvar arquivo
        try:
            file_content = await media_file.read()
            
            # Gerar nome único para o arquivo
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            file_name = f"{volunteer_id}_{timestamp}_{media_file.filename}"
            file_path = MEDIA_DIR / file_name
            
            with open(file_path, "wb") as f:
                f.write(file_content)
            
            media_url = f"/uploads/media/{file_name}"
            media_type = media_category
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao salvar arquivo: {str(e)}")
    
    # Criar aula publicada
    db_lesson = PublishedLesson(
        volunteer_id=volunteer_id,
        subject_id=subject_id,
        title=title,
        description=description,
        media_url=media_url,
        media_type=media_type
    )
    
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    
    return db_lesson


@router.get("/", response_model=List[PublishedLessonResponse])
def get_published_lessons(
    volunteer_id: Optional[int] = None,
    subject_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Listar aulas publicadas com filtros"""
    query = db.query(PublishedLesson)
    
    if volunteer_id:
        query = query.filter(PublishedLesson.volunteer_id == volunteer_id)
    if subject_id:
        query = query.filter(PublishedLesson.subject_id == subject_id)
    
    lessons = query.order_by(PublishedLesson.created_at.desc()).offset(skip).limit(limit).all()
    return lessons


@router.get("/{lesson_id}", response_model=PublishedLessonResponse)
def get_published_lesson(lesson_id: int, db: Session = Depends(get_db)):
    """Retorna uma aula publicada específica"""
    lesson = db.query(PublishedLesson).filter(PublishedLesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Aula não encontrada")
    
    # Incrementar contador de visualizações
    lesson.views_count += 1
    db.commit()
    
    return lesson


@router.put("/{lesson_id}", response_model=PublishedLessonResponse)
async def update_published_lesson(
    lesson_id: int,
    lesson_update: PublishedLessonUpdate,
    volunteer_id: int = None,
    db: Session = Depends(get_db)
):
    """Atualiza informações da aula publicada"""
    db_lesson = db.query(PublishedLesson).filter(PublishedLesson.id == lesson_id).first()
    if not db_lesson:
        raise HTTPException(status_code=404, detail="Aula não encontrada")
    
    # Verificar permissão (apenas o voluntário que publicou pode atualizar)
    if db_lesson.volunteer_id != volunteer_id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para atualizar esta aula")
    
    update_data = lesson_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_lesson, field, value)
    
    db.commit()
    db.refresh(db_lesson)
    
    return db_lesson


@router.delete("/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_published_lesson(
    lesson_id: int,
    volunteer_id: int = None,
    db: Session = Depends(get_db)
):
    """Deleta uma aula publicada"""
    db_lesson = db.query(PublishedLesson).filter(PublishedLesson.id == lesson_id).first()
    if not db_lesson:
        raise HTTPException(status_code=404, detail="Aula não encontrada")
    
    # Verificar permissão
    if db_lesson.volunteer_id != volunteer_id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para deletar esta aula")
    
    # Deletar arquivo de mídia se existir
    if db_lesson.media_url:
        try:
            file_path = Path(db_lesson.media_url.replace("/uploads/media/", ""))
            full_path = MEDIA_DIR / file_path.name
            if full_path.exists():
                full_path.unlink()
        except Exception as e:
            print(f"Erro ao deletar arquivo: {str(e)}")
    
    db.delete(db_lesson)
    db.commit()
    
    return None


@router.post("/{lesson_id}/like", status_code=status.HTTP_200_OK)
def like_lesson(lesson_id: int, db: Session = Depends(get_db)):
    """Adiciona um like à aula"""
    db_lesson = db.query(PublishedLesson).filter(PublishedLesson.id == lesson_id).first()
    if not db_lesson:
        raise HTTPException(status_code=404, detail="Aula não encontrada")
    
    db_lesson.likes_count += 1
    db.commit()
    db.refresh(db_lesson)
    
    return {"likes_count": db_lesson.likes_count}
