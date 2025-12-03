from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from app.models.gamification import BadgeType


class BadgeBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    badge_type: BadgeType
    requirement_value: int = 1
    points_reward: int = 0


class BadgeCreate(BadgeBase):
    pass


class BadgeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    requirement_value: Optional[int] = None
    points_reward: Optional[int] = None


class BadgeResponse(BadgeBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class UserBadgeResponse(BaseModel):
    id: int
    user_id: int
    badge_id: int
    badge: BadgeResponse
    earned_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class PointsTransactionBase(BaseModel):
    user_id: int
    points: int
    reason: str
    reference_id: Optional[int] = None


class PointsTransactionCreate(BaseModel):
    points: int
    reason: str
    reference_id: Optional[int] = None


class PointsTransactionResponse(PointsTransactionBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
