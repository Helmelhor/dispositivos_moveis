from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional
from app.models.user import UserRole, UserStatus


class UserBase(BaseModel):
    email: EmailStr
    name: str
    phone: Optional[str] = None
    location_city: Optional[str] = None
    location_state: Optional[str] = None
    location_latitude: Optional[str] = None
    location_longitude: Optional[str] = None
    bio: Optional[str] = None
    is_online_available: bool = True
    is_presencial_available: bool = False


class UserCreate(UserBase):
    password: str
    role: UserRole


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location_city: Optional[str] = None
    location_state: Optional[str] = None
    location_latitude: Optional[str] = None
    location_longitude: Optional[str] = None
    bio: Optional[str] = None
    profile_image: Optional[str] = None
    is_online_available: Optional[bool] = None
    is_presencial_available: Optional[bool] = None


class UserResponse(UserBase):
    id: int
    role: UserRole
    status: UserStatus
    profile_image: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
