from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.database import get_db
from app.models.communication import ForumTopic, ForumReply
from app.models.user import User
from app.schemas.communication import (
    ForumTopicCreate, ForumTopicUpdate, ForumTopicResponse,
    ForumReplyCreate, ForumReplyUpdate, ForumReplyResponse
)
from pydantic import BaseModel
from datetime import datetime


router = APIRouter(prefix="/forum", tags=["forum"])


# Schema estendido para incluir informações do autor
class ForumTopicWithAuthor(BaseModel):
    id: int
    subject_id: int
    user_id: int
    title: str
    content: str
    is_resolved: bool
    views_count: int
    replies_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    author_name: str
    
    class Config:
        from_attributes = True


class ForumReplyWithAuthor(BaseModel):
    id: int
    topic_id: int
    user_id: int
    content: str
    is_accepted: bool
    likes_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    author_name: str
    parent_reply_id: Optional[int] = None
    
    class Config:
        from_attributes = True


# ==================== TÓPICOS ====================

@router.get("/topics", response_model=List[ForumTopicWithAuthor])
def get_topics(
    subject_id: Optional[int] = None,
    user_id: Optional[int] = None,
    is_resolved: Optional[bool] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Listar tópicos do fórum"""
    query = db.query(ForumTopic, User.name.label('author_name')).join(
        User, ForumTopic.user_id == User.id
    )
    
    if subject_id:
        query = query.filter(ForumTopic.subject_id == subject_id)
    if user_id:
        query = query.filter(ForumTopic.user_id == user_id)
    if is_resolved is not None:
        query = query.filter(ForumTopic.is_resolved == is_resolved)
    if search:
        query = query.filter(
            ForumTopic.title.ilike(f"%{search}%") | 
            ForumTopic.content.ilike(f"%{search}%")
        )
    
    results = query.order_by(ForumTopic.created_at.desc()).offset(skip).limit(limit).all()
    
    topics = []
    for topic, author_name in results:
        topic_dict = {
            "id": topic.id,
            "subject_id": topic.subject_id,
            "user_id": topic.user_id,
            "title": topic.title,
            "content": topic.content,
            "is_resolved": topic.is_resolved,
            "views_count": topic.views_count,
            "replies_count": topic.replies_count,
            "created_at": topic.created_at,
            "updated_at": topic.updated_at,
            "author_name": author_name
        }
        topics.append(topic_dict)
    
    return topics


@router.get("/topics/{topic_id}", response_model=ForumTopicWithAuthor)
def get_topic(topic_id: int, db: Session = Depends(get_db)):
    """Retorna tópico específico"""
    result = db.query(ForumTopic, User.name.label('author_name')).join(
        User, ForumTopic.user_id == User.id
    ).filter(ForumTopic.id == topic_id).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Tópico não encontrado")
    
    topic, author_name = result
    
    # Incrementar visualizações
    topic.views_count += 1
    db.commit()
    
    return {
        "id": topic.id,
        "subject_id": topic.subject_id,
        "user_id": topic.user_id,
        "title": topic.title,
        "content": topic.content,
        "is_resolved": topic.is_resolved,
        "views_count": topic.views_count,
        "replies_count": topic.replies_count,
        "created_at": topic.created_at,
        "updated_at": topic.updated_at,
        "author_name": author_name
    }


@router.post("/topics", response_model=ForumTopicWithAuthor, status_code=status.HTTP_201_CREATED)
def create_topic(topic: ForumTopicCreate, db: Session = Depends(get_db)):
    """Criar novo tópico"""
    # Verificar se o usuário existe
    user = db.query(User).filter(User.id == topic.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    db_topic = ForumTopic(
        subject_id=topic.subject_id,
        user_id=topic.user_id,
        title=topic.title,
        content=topic.content
    )
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    
    return {
        "id": db_topic.id,
        "subject_id": db_topic.subject_id,
        "user_id": db_topic.user_id,
        "title": db_topic.title,
        "content": db_topic.content,
        "is_resolved": db_topic.is_resolved,
        "views_count": db_topic.views_count,
        "replies_count": db_topic.replies_count,
        "created_at": db_topic.created_at,
        "updated_at": db_topic.updated_at,
        "author_name": user.name
    }


# Criar schema que inclui user_id para criar tópico
class ForumTopicCreateWithUser(BaseModel):
    subject_id: int
    user_id: int
    title: str
    content: str


@router.put("/topics/{topic_id}", response_model=ForumTopicWithAuthor)
def update_topic(
    topic_id: int, 
    topic_update: ForumTopicUpdate, 
    user_id: int,
    db: Session = Depends(get_db)
):
    """Atualizar tópico (apenas o autor pode atualizar)"""
    result = db.query(ForumTopic, User.name.label('author_name')).join(
        User, ForumTopic.user_id == User.id
    ).filter(ForumTopic.id == topic_id).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Tópico não encontrado")
    
    db_topic, author_name = result
    
    # Verificar se é o autor
    if db_topic.user_id != user_id:
        raise HTTPException(status_code=403, detail="Apenas o autor pode editar o tópico")
    
    update_data = topic_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_topic, field, value)
    
    db.commit()
    db.refresh(db_topic)
    
    return {
        "id": db_topic.id,
        "subject_id": db_topic.subject_id,
        "user_id": db_topic.user_id,
        "title": db_topic.title,
        "content": db_topic.content,
        "is_resolved": db_topic.is_resolved,
        "views_count": db_topic.views_count,
        "replies_count": db_topic.replies_count,
        "created_at": db_topic.created_at,
        "updated_at": db_topic.updated_at,
        "author_name": author_name
    }


@router.delete("/topics/{topic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_topic(topic_id: int, user_id: int, db: Session = Depends(get_db)):
    """Deletar tópico (apenas o autor pode deletar)"""
    db_topic = db.query(ForumTopic).filter(ForumTopic.id == topic_id).first()
    if not db_topic:
        raise HTTPException(status_code=404, detail="Tópico não encontrado")
    
    # Verificar se é o autor
    if db_topic.user_id != user_id:
        raise HTTPException(status_code=403, detail="Apenas o autor pode deletar o tópico")
    
    # Deletar todas as respostas do tópico
    db.query(ForumReply).filter(ForumReply.topic_id == topic_id).delete()
    
    db.delete(db_topic)
    db.commit()
    
    return None


# ==================== RESPOSTAS ====================

@router.get("/topics/{topic_id}/replies", response_model=List[ForumReplyWithAuthor])
def get_replies(topic_id: int, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """Listar respostas de um tópico"""
    # Verificar se o tópico existe
    topic = db.query(ForumTopic).filter(ForumTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Tópico não encontrado")
    
    results = db.query(ForumReply, User.name.label('author_name')).join(
        User, ForumReply.user_id == User.id
    ).filter(ForumReply.topic_id == topic_id).order_by(
        ForumReply.created_at.asc()
    ).offset(skip).limit(limit).all()
    
    replies = []
    for reply, author_name in results:
        reply_dict = {
            "id": reply.id,
            "topic_id": reply.topic_id,
            "user_id": reply.user_id,
            "content": reply.content,
            "is_accepted": reply.is_accepted,
            "likes_count": reply.likes_count,
            "created_at": reply.created_at,
            "updated_at": reply.updated_at,
            "author_name": author_name,
            "parent_reply_id": getattr(reply, 'parent_reply_id', None)
        }
        replies.append(reply_dict)
    
    return replies


class ForumReplyCreateWithUser(BaseModel):
    topic_id: int
    user_id: int
    content: str
    parent_reply_id: Optional[int] = None


@router.post("/replies", response_model=ForumReplyWithAuthor, status_code=status.HTTP_201_CREATED)
def create_reply(reply: ForumReplyCreateWithUser, db: Session = Depends(get_db)):
    """Criar nova resposta"""
    # Verificar se o tópico existe
    topic = db.query(ForumTopic).filter(ForumTopic.id == reply.topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Tópico não encontrado")
    
    # Verificar se o usuário existe
    user = db.query(User).filter(User.id == reply.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    db_reply = ForumReply(
        topic_id=reply.topic_id,
        user_id=reply.user_id,
        content=reply.content
    )
    db.add(db_reply)
    
    # Incrementar contador de respostas do tópico
    topic.replies_count += 1
    
    db.commit()
    db.refresh(db_reply)
    
    return {
        "id": db_reply.id,
        "topic_id": db_reply.topic_id,
        "user_id": db_reply.user_id,
        "content": db_reply.content,
        "is_accepted": db_reply.is_accepted,
        "likes_count": db_reply.likes_count,
        "created_at": db_reply.created_at,
        "updated_at": db_reply.updated_at,
        "author_name": user.name,
        "parent_reply_id": None
    }


@router.put("/replies/{reply_id}", response_model=ForumReplyWithAuthor)
def update_reply(
    reply_id: int, 
    reply_update: ForumReplyUpdate, 
    user_id: int,
    db: Session = Depends(get_db)
):
    """Atualizar resposta (apenas o autor pode atualizar)"""
    result = db.query(ForumReply, User.name.label('author_name')).join(
        User, ForumReply.user_id == User.id
    ).filter(ForumReply.id == reply_id).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Resposta não encontrada")
    
    db_reply, author_name = result
    
    # Verificar se é o autor
    if db_reply.user_id != user_id:
        raise HTTPException(status_code=403, detail="Apenas o autor pode editar a resposta")
    
    update_data = reply_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_reply, field, value)
    
    db.commit()
    db.refresh(db_reply)
    
    return {
        "id": db_reply.id,
        "topic_id": db_reply.topic_id,
        "user_id": db_reply.user_id,
        "content": db_reply.content,
        "is_accepted": db_reply.is_accepted,
        "likes_count": db_reply.likes_count,
        "created_at": db_reply.created_at,
        "updated_at": db_reply.updated_at,
        "author_name": author_name,
        "parent_reply_id": None
    }


@router.delete("/replies/{reply_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reply(reply_id: int, user_id: int, db: Session = Depends(get_db)):
    """Deletar resposta (apenas o autor pode deletar)"""
    db_reply = db.query(ForumReply).filter(ForumReply.id == reply_id).first()
    if not db_reply:
        raise HTTPException(status_code=404, detail="Resposta não encontrada")
    
    # Verificar se é o autor
    if db_reply.user_id != user_id:
        raise HTTPException(status_code=403, detail="Apenas o autor pode deletar a resposta")
    
    # Decrementar contador de respostas do tópico
    topic = db.query(ForumTopic).filter(ForumTopic.id == db_reply.topic_id).first()
    if topic:
        topic.replies_count = max(0, topic.replies_count - 1)
    
    db.delete(db_reply)
    db.commit()
    
    return None


@router.post("/replies/{reply_id}/like", response_model=ForumReplyWithAuthor)
def like_reply(reply_id: int, db: Session = Depends(get_db)):
    """Curtir uma resposta"""
    result = db.query(ForumReply, User.name.label('author_name')).join(
        User, ForumReply.user_id == User.id
    ).filter(ForumReply.id == reply_id).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Resposta não encontrada")
    
    db_reply, author_name = result
    db_reply.likes_count += 1
    db.commit()
    db.refresh(db_reply)
    
    return {
        "id": db_reply.id,
        "topic_id": db_reply.topic_id,
        "user_id": db_reply.user_id,
        "content": db_reply.content,
        "is_accepted": db_reply.is_accepted,
        "likes_count": db_reply.likes_count,
        "created_at": db_reply.created_at,
        "updated_at": db_reply.updated_at,
        "author_name": author_name,
        "parent_reply_id": None
    }


@router.post("/replies/{reply_id}/accept", response_model=ForumReplyWithAuthor)
def accept_reply(reply_id: int, user_id: int, db: Session = Depends(get_db)):
    """Aceitar uma resposta como solução (apenas o autor do tópico)"""
    result = db.query(ForumReply, User.name.label('author_name')).join(
        User, ForumReply.user_id == User.id
    ).filter(ForumReply.id == reply_id).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Resposta não encontrada")
    
    db_reply, author_name = result
    
    # Verificar se o usuário é o autor do tópico
    topic = db.query(ForumTopic).filter(ForumTopic.id == db_reply.topic_id).first()
    if not topic or topic.user_id != user_id:
        raise HTTPException(status_code=403, detail="Apenas o autor do tópico pode aceitar respostas")
    
    db_reply.is_accepted = True
    topic.is_resolved = True
    db.commit()
    db.refresh(db_reply)
    
    return {
        "id": db_reply.id,
        "topic_id": db_reply.topic_id,
        "user_id": db_reply.user_id,
        "content": db_reply.content,
        "is_accepted": db_reply.is_accepted,
        "likes_count": db_reply.likes_count,
        "created_at": db_reply.created_at,
        "updated_at": db_reply.updated_at,
        "author_name": author_name,
        "parent_reply_id": None
    }
