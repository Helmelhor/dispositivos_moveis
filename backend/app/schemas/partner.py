from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime
from typing import Optional
from app.models.partner import PartnerType


class PartnerLocationBase(BaseModel):
    name: str
    partner_type: PartnerType
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    image_url: Optional[str] = None


class PartnerLocationCreate(PartnerLocationBase):
    pass


class PartnerLocationUpdate(BaseModel):
    name: Optional[str] = None
    partner_type: Optional[PartnerType] = None
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None


class PartnerLocationResponse(PartnerLocationBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
