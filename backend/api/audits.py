from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from pydantic import BaseModel
from core.database import get_session
from models.audit import AuditJob

router = APIRouter()

class ManualAuditRequest(BaseModel):
    code_content: str

@router.post("/manual")
def manual_audit(request: ManualAuditRequest):
    from services.llm import AIAuditService
    ai_service = AIAuditService()
    result = ai_service.analyze_diff(request.code_content)
    return result

@router.get("/", response_model=List[AuditJob])
def get_audits(session: Session = Depends(get_session), limit: int = 10):
    audits = session.exec(select(AuditJob).order_by(AuditJob.created_at.desc()).limit(limit)).all()
    return audits

@router.get("/{audit_id}", response_model=AuditJob)
def get_audit(audit_id: int, session: Session = Depends(get_session)):
    audit = session.get(AuditJob, audit_id)
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")
    return audit
