import pytest
from unittest.mock import AsyncMock, MagicMock, patch


@pytest.mark.asyncio
async def test_generate_json_benefit_parses_json():
    from agent.services.llm import LLMService
    svc = LLMService()

    mock_response = MagicMock()
    mock_response.content = '{"label": "aide test", "institution": "caf_test", "description": "desc", "type": "bool", "periodicite": "ponctuelle", "_missing_fields": [], "_questions_for_contributor": []}'

    with patch.object(svc, "_safe_ainvoke", return_value=mock_response):
        result = await svc.generate_json_benefit([
            {"role": "system", "content": "system"},
            {"role": "user", "content": "input"},
        ])

    assert result["label"] == "aide test"
    assert result["_missing_fields"] == []


@pytest.mark.asyncio
async def test_generate_json_benefit_strips_markdown_fences():
    from agent.services.llm import LLMService
    svc = LLMService()

    mock_response = MagicMock()
    mock_response.content = '```json\n{"label": "aide", "institution": "x", "description": "d", "type": "bool", "periodicite": "ponctuelle"}\n```'

    with patch.object(svc, "_safe_ainvoke", return_value=mock_response):
        result = await svc.generate_json_benefit([
            {"role": "system", "content": "system"},
            {"role": "user", "content": "input"},
        ])

    assert result["label"] == "aide"


@pytest.mark.asyncio
async def test_generate_json_benefit_raises_on_unparseable():
    from agent.services.llm import LLMService
    svc = LLMService()

    mock_response = MagicMock()
    mock_response.content = "Ce n'est pas du JSON valide"

    with patch.object(svc, "_safe_ainvoke", return_value=mock_response):
        with patch.object(svc, "repair_json_with_llm", new_callable=AsyncMock) as mock_repair:
            mock_repair.return_value = "still not json"
            with pytest.raises(ValueError, match="JSON non parseable"):
                await svc.generate_json_benefit([
                    {"role": "system", "content": "system"},
                    {"role": "user", "content": "input"},
                ])
