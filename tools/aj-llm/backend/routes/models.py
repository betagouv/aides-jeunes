import httpx
from fastapi import APIRouter

from configs.settings import settings

router = APIRouter()

# Modèles non-chat à exclure de la liste (embeddings, audio).
_EXCLUDE = ("whisper", "bge", "embed", "rerank")


@router.get("/models")
async def list_models() -> dict:
    """Liste dynamiquement les modèles chat dispo sur le gateway OpenAI-compatible."""
    current = settings.MODEL_NAME.strip('"')
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"{settings.OPENAI_API_BASE}/models",
                headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
            )
            resp.raise_for_status()
            data = resp.json()
        ids = [m.get("id") for m in data.get("data", []) if m.get("id")]
        chat = sorted(i for i in ids if not any(x in i.lower() for x in _EXCLUDE))
        return {"current": current, "models": chat or [current]}
    except Exception as exc:  # gateway down / auth — fall back to configured model
        return {"current": current, "models": [current], "error": str(exc)}
