from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.news import News
from app.schemas.news import NewsCreate, NewsUpdate, NewsResponse
from app.websocket.manager import manager


router = APIRouter(prefix="/news", tags=["news"])


@router.get("/", response_model=List[NewsResponse])
def get_news(
    news_type: str = None,
    is_featured: bool = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Listar notícias, eventos e campanhas"""
    query = db.query(News).filter(News.is_active == True)
    
    if news_type:
        query = query.filter(News.news_type == news_type)
    if is_featured is not None:
        query = query.filter(News.is_featured == is_featured)
    
    news = query.order_by(News.created_at.desc()).offset(skip).limit(limit).all()
    return news


@router.get("/{news_id}", response_model=NewsResponse)
def get_news_item(news_id: int, db: Session = Depends(get_db)):
    """Retorna notícia específica"""
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="Notícia não encontrada")
    
    # Incrementar visualizações
    news.views_count += 1
    db.commit()
    
    return news


@router.post("/", response_model=NewsResponse, status_code=status.HTTP_201_CREATED)
async def create_news(news: NewsCreate, db: Session = Depends(get_db)):
    """Criar notícia/evento/campanha"""
    db_news = News(**news.model_dump())
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    
    await manager.broadcast({
        "type": "news_created",
        "data": NewsResponse.model_validate(db_news).model_dump(mode='json')
    })
    
    return db_news


@router.put("/{news_id}", response_model=NewsResponse)
async def update_news(news_id: int, news: NewsUpdate, db: Session = Depends(get_db)):
    """Atualizar notícia"""
    db_news = db.query(News).filter(News.id == news_id).first()
    if not db_news:
        raise HTTPException(status_code=404, detail="Notícia não encontrada")
    
    update_data = news.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_news, field, value)
    
    db.commit()
    db.refresh(db_news)
    
    await manager.broadcast({
        "type": "news_updated",
        "data": NewsResponse.model_validate(db_news).model_dump(mode='json')
    })
    
    return db_news


@router.delete("/{news_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_news(news_id: int, db: Session = Depends(get_db)):
    """Deletar notícia"""
    db_news = db.query(News).filter(News.id == news_id).first()
    if not db_news:
        raise HTTPException(status_code=404, detail="Notícia não encontrada")
    
    db.delete(db_news)
    db.commit()
    
    await manager.broadcast({
        "type": "news_deleted",
        "data": {"id": news_id}
    })
    
    return None
