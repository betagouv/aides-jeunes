import pytest
from unittest.mock import AsyncMock, patch
from httpx import AsyncClient, ASGITransport

RAW_YAML = "label: aide test\ninstitution: caf_test\ntype: bool\nperiodicite: ponctuelle\ndescription: test\n"

MOCK_STATE_OK = {
    "yaml_content": "label: aide test\ninstitution: caf_test\n",
    "filename": "caf-test-aide-test.yml",
    "missing_fields": [],
    "questions_for_contributor": [],
    "validation_errors": [],
    "error": None,
}

MOCK_STATE_ERROR = {
    "yaml_content": None,
    "filename": None,
    "missing_fields": [],
    "questions_for_contributor": [],
    "validation_errors": [],
    "error": "YAML non parseable: ...",
}


@pytest.mark.asyncio
async def test_format_contribution_success():
    from backend.main import app
    with patch("backend.routes.contribution.contribution_agent") as mock_agent:
        mock_agent.app.ainvoke = AsyncMock(return_value=MOCK_STATE_OK)
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/contribution/format",
                json={"yaml_content": RAW_YAML},
            )
    assert response.status_code == 200
    data = response.json()
    assert data["yaml_content"] == MOCK_STATE_OK["yaml_content"]
    assert data["filename"] == "caf-test-aide-test.yml"
    assert data["error"] is None


@pytest.mark.asyncio
async def test_format_contribution_parse_error():
    from backend.main import app
    with patch("backend.routes.contribution.contribution_agent") as mock_agent:
        mock_agent.app.ainvoke = AsyncMock(return_value=MOCK_STATE_ERROR)
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/contribution/format",
                json={"yaml_content": "{{bad yaml"},
            )
    assert response.status_code == 200
    data = response.json()
    assert data["error"] is not None
    assert data["yaml_content"] is None


@pytest.mark.asyncio
async def test_format_contribution_missing_body():
    from backend.main import app
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/contribution/format", json={})
    assert response.status_code == 422
