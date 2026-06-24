import re
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from agent.agents.contribution import contribution_agent
from configs.settings import settings

router = APIRouter()


class ContributionRequest(BaseModel):
    yaml_content: str
    model_name: str | None = None


class SaveRequest(BaseModel):
    yaml_content: str
    filename: str


class SaveResponse(BaseModel):
    status: str
    path: str


class ContributionResponse(BaseModel):
    yaml_content: str | None
    filename: str | None
    missing_fields: list[str]
    questions_for_contributor: list[str]
    validation_errors: list[str]
    error: str | None
    raw_llm_output: str | None = None
    model_used: str | None = None


_INITIAL_STATE = {
    "parsed_input": None,
    "institution_slug": None,
    "institution_found": False,
    "generated_json": None,
    "yaml_content": None,
    "filename": None,
    "validation_errors": [],
    "missing_fields": [],
    "questions_for_contributor": [],
    "retry_count": 0,
    "error": None,
    "raw_llm_output": None,
}


@router.post("/contribution/format", response_model=ContributionResponse)
async def format_contribution(request: ContributionRequest) -> ContributionResponse:
    state = await contribution_agent.app.ainvoke(
        {
            "raw_yaml": request.yaml_content,
            "model_name": request.model_name,
            **_INITIAL_STATE,
        }
    )
    return ContributionResponse(
        yaml_content=state.get("yaml_content"),
        filename=state.get("filename"),
        missing_fields=state.get("missing_fields", []),
        questions_for_contributor=state.get("questions_for_contributor", []),
        validation_errors=state.get("validation_errors", []),
        error=state.get("error"),
        raw_llm_output=state.get("raw_llm_output"),
        model_used=request.model_name or contribution_agent.llm.model_name,
    )


_FILENAME_RE = re.compile(r"^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.yml$")


@router.post("/contribution/save", response_model=SaveResponse)
async def save_contribution(request: SaveRequest) -> SaveResponse:
    """Écrit la fiche directement dans data/benefits/javascript/ du repo aides-jeunes.

    Pas de PR : modification locale directe. À committer manuellement.
    """
    filename = request.filename.strip()
    if not _FILENAME_RE.match(filename):
        raise HTTPException(
            status_code=400,
            detail="filename invalide (attendu : slug-kebab-case.yml, sans chemin)",
        )

    target_dir = settings.AIDES_JEUNES_BENEFITS_PATH
    if not target_dir.is_dir():
        raise HTTPException(
            status_code=500,
            detail=f"Dossier benefits introuvable : {target_dir}. "
            f"Vérifie AIDES_JEUNES_DATA_PATH.",
        )

    # Anti path-traversal : le fichier résolu doit rester dans target_dir.
    file_path = (target_dir / filename).resolve()
    if file_path.parent != target_dir.resolve():
        raise HTTPException(status_code=400, detail="chemin de fichier non autorisé")

    file_path.write_text(request.yaml_content, encoding="utf-8")
    return SaveResponse(status="success", path=str(file_path))
