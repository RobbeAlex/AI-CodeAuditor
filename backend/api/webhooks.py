from fastapi import APIRouter, Request, Depends
from sqlmodel import Session
from core.database import get_session
from models.audit import AuditJob
from worker import dummy_audit_task

router = APIRouter()

@router.post("/github")
async def github_webhook(request: Request, session: Session = Depends(get_session)):
    event_type = request.headers.get("x-github-event")
    
    if event_type == "pull_request":
        payload = await request.json()
        action = payload.get("action")
        
        # Iniciar auditoría solo cuando el PR es nuevo o se hace un nuevo push
        if action in ["opened", "synchronize"]:
            repo_name = payload["repository"]["full_name"]
            pr_number = payload["pull_request"]["number"]
            
            # Registrar el trabajo en la BD
            job = AuditJob(repository_name=repo_name, pr_number=pr_number)
            session.add(job)
            session.commit()
            session.refresh(job)
            
            # Lanzar tarea asíncrona a Celery
            dummy_audit_task.delay(job.id)
            
            return {"status": "accepted", "job_id": job.id}
            
    return {"status": "ignored"}
