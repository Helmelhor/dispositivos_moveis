from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from app.models.news import NewsType


class NewsBase(BaseModel):
    title: str
    content: str
    news_type: NewsType
    author: Optional[str] = None
    image_url: Optional[str] = None
    event_date: Optional[datetime] = None
    event_location: Optional[str] = None
    event_link: Optional[str] = None
    campaign_goal: Optional[str] = None
    campaign_end_date: Optional[datetime] = None
    campaign_contact: Optional[str] = None
    is_featured: bool = False


class NewsCreate(NewsBase):
    pass


class NewsUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    news_type: Optional[NewsType] = None
    author: Optional[str] = None
    image_url: Optional[str] = None
    event_date: Optional[datetime] = None
    event_location: Optional[str] = None
    event_link: Optional[str] = None
    campaign_goal: Optional[str] = None
    campaign_end_date: Optional[datetime] = None
    campaign_contact: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None


class NewsResponse(NewsBase):
    id: int
    is_active: bool
    views_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
