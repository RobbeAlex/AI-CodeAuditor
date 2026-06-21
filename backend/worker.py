import os
from celery import Celery
from sqlmodel import Session
from core.database import engine
from models.audit import AuditJob
from services.github import GitHubService
from services.llm import AIAuditService

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "ai_code_auditor_worker",
    broker=REDIS_URL,
    backend=REDIS_URL
)

github_service = GitHubService()
ai_service = AIAuditService()

@celery_app.task
def dummy_audit_task(job_id: int):
    print(f"Iniciando auditoría IA para el job {job_id}...")
    
    with Session(engine) as session:
        job = session.get(AuditJob, job_id)
        if not job:
            return {"status": "error", "message": "Job no encontrado"}
            
        job.status = "in_progress"
        session.add(job)
        session.commit()
        
        # 1. Extraer código modificado de GitHub
        diff_text = github_service.get_pr_diff(job.repository_name, job.pr_number)
        
        # 2. Enviar el código a la Inteligencia Artificial
        findings = ai_service.analyze_diff(diff_text)
        
        # 3. Guardar resultados
        job.status = "completed"
        job.findings = findings
        session.add(job)
        session.commit()
            
    return {"status": "completed", "job_id": job_id}
