from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/status")
async def auth_status():
    return {"auth_enabled": False}

@router.get("/me")
async def get_me():
    return {
        "user_id": "local_user",
        "username": "local_user",
        "authenticated": True,
        "plan": "org"
    }

@router.get("/org-membership")
async def org_membership():
    return {"is_member": True}
