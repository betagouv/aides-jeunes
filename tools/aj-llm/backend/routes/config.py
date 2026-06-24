from fastapi import APIRouter
from configs.settings import settings

router = APIRouter(prefix="/config", tags=["config"])

@router.get("/model")
async def get_model_config():
    return {
        "current": settings.MODEL_NAME,
        "available": [
            {"id": settings.MODEL_NAME, "label": settings.MODEL_NAME, "provider": "local", "tier": "free"}
        ]
    }
