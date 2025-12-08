from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import secrets
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserLogin, Token


router = APIRouter(prefix="/users", tags=["users"])


@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """
    Autenticar usuário com email e senha.
    Retorna token de acesso e dados do usuário.
    """
    user = db.query(User).filter(User.email == user_data.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )
    
    # Verificar senha (em texto simples por enquanto)
    if user.password_hash != user_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )
    
    # Gerar token simples
    token = secrets.token_urlsafe(32)
    
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.post("/", response_model=Token, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Criar novo usuário.
    Retorna token de acesso e dados do usuário para auto-login.
    """
    # Verificar se email já existe
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    # Criar usuário (senha em texto simples por enquanto - em produção, usar hash)
    user_data = user.model_dump()
    user_data['password_hash'] = user_data.pop('password')  # Renomear campo
    
    db_user = User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Gerar token para auto-login
    token = secrets.token_urlsafe(32)
    
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(db_user)
    )


@router.get("/", response_model=List[UserResponse])
def list_users(
    role: str = None,
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Listar todos os usuários"""
    query = db.query(User)
    
    if role:
        query = query.filter(User.role == role)
    if status:
        query = query.filter(User.status == status)
    
    users = query.offset(skip).limit(limit).all()
    return users


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Retorna usuário por ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    """Atualizar usuário"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    # Verificar se email já existe (se está sendo alterado)
    if user.email:
        existing_email = db.query(User).filter(
            User.email == user.email,
            User.id != user_id  # Excluir o usuário atual
        ).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    # Verificar se nome já existe (se está sendo alterado)
    if user.name:
        existing_name = db.query(User).filter(
            User.name == user.name,
            User.id != user_id  # Excluir o usuário atual
        ).first()
        if existing_name:
            raise HTTPException(status_code=400, detail="Nome já cadastrado")
    
    update_data = user.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Deletar usuário"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    db.delete(db_user)
    db.commit()
    return None
