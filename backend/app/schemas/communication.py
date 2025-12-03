from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class MessageBase(BaseModel):
    receiver_id: int
    content: str
    lesson_id: Optional[int] = None


class MessageCreate(MessageBase):
    pass


class MessageResponse(MessageBase):
    id: int
    sender_id: int
    is_read: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class ForumTopicBase(BaseModel):
    subject_id: int
    title: str
    content: str


class ForumTopicCreate(ForumTopicBase):
    pass


class ForumTopicUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_resolved: Optional[bool] = None


class ForumTopicResponse(ForumTopicBase):
    id: int
    user_id: int
    is_resolved: bool
    views_count: int
    replies_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class ForumReplyBase(BaseModel):
    topic_id: int
    content: str


class ForumReplyCreate(ForumReplyBase):
    pass


class ForumReplyUpdate(BaseModel):
    content: Optional[str] = None
    is_accepted: Optional[bool] = None


class ForumReplyResponse(ForumReplyBase):
    id: int
    user_id: int
    is_accepted: bool
    likes_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
