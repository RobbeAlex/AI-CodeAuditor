import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-CodeAuditor"
    # Using Docker network default, fallback to localhost for local testing
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://auditor:auditor_password@localhost:5432/aicodeauditor")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    GITHUB_WEBHOOK_SECRET: str = os.getenv("GITHUB_WEBHOOK_SECRET", "my_super_secret")

settings = Settings()
