from fastapi import APIRouter
from configs.settings import settings

router = APIRouter(prefix="/health", tags=["health"])

@router.get("")
async def health_check():
    return {"status": "ok"}

@router.get("/llm")
async def llm_health_check():
    return {
        "status": "ok",
        "model": settings.MODEL_NAME
    }
