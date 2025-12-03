from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.partner import PartnerLocation
from app.schemas.partner import PartnerLocationCreate, PartnerLocationUpdate, PartnerLocationResponse


router = APIRouter(prefix="/partners", tags=["partners"])


@router.get("/", response_model=List[PartnerLocationResponse])
def get_partners(
    partner_type: str = None,
    city: str = None,
    state: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Listar locais parceiros"""
    query = db.query(PartnerLocation).filter(PartnerLocation.is_active == True)
    
    if partner_type:
        query = query.filter(PartnerLocation.partner_type == partner_type)
    if city:
        query = query.filter(PartnerLocation.city == city)
    if state:
        query = query.filter(PartnerLocation.state == state)
    
    partners = query.offset(skip).limit(limit).all()
    return partners


@router.get("/{partner_id}", response_model=PartnerLocationResponse)
def get_partner(partner_id: int, db: Session = Depends(get_db)):
    """Retorna local parceiro específico"""
    partner = db.query(PartnerLocation).filter(PartnerLocation.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Parceiro não encontrado")
    return partner


@router.post("/", response_model=PartnerLocationResponse, status_code=status.HTTP_201_CREATED)
def create_partner(partner: PartnerLocationCreate, db: Session = Depends(get_db)):
    """Criar local parceiro"""
    db_partner = PartnerLocation(**partner.model_dump())
    db.add(db_partner)
    db.commit()
    db.refresh(db_partner)
    return db_partner


@router.put("/{partner_id}", response_model=PartnerLocationResponse)
def update_partner(
    partner_id: int,
    partner: PartnerLocationUpdate,
    db: Session = Depends(get_db)
):
    """Atualizar local parceiro"""
    db_partner = db.query(PartnerLocation).filter(PartnerLocation.id == partner_id).first()
    if not db_partner:
        raise HTTPException(status_code=404, detail="Parceiro não encontrado")
    
    update_data = partner.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_partner, field, value)
    
    db.commit()
    db.refresh(db_partner)
    return db_partner


@router.delete("/{partner_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_partner(partner_id: int, db: Session = Depends(get_db)):
    """Deletar local parceiro"""
    db_partner = db.query(PartnerLocation).filter(PartnerLocation.id == partner_id).first()
    if not db_partner:
        raise HTTPException(status_code=404, detail="Parceiro não encontrado")
    
    db.delete(db_partner)
    db.commit()
    return None
