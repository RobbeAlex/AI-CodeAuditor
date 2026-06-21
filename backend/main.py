from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from core.database import create_db_and_tables
from api import webhooks, audits

app = FastAPI(
    title="AI-CodeAuditor API",
    description="Backend Core for AI Code Audit System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permitir frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])
app.include_router(audits.router, prefix="/api/audits", tags=["audits"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "AI-CodeAuditor API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
