import pytest
from unittest.mock import AsyncMock, MagicMock, patch

VALID_LLM_JSON = {
    "label": "chèques déjeuner",
    "institution": "caf_morbihan",
    "description": "Aide alimentaire pour les jeunes en insertion.",
    "conditions": ["Être à la charge de ses parents"],
    "conditions_generales": [{"type": "age", "operator": "<", "value": 21}],
    "profils": [],
    "type": "bool",
    "periodicite": "mensuelle",
    "link": "https://www.caf.fr",
    "_missing_fields": ["montant"],
    "_questions_for_contributor": ["Quel est le montant unitaire d'un chèque ?"],
}

MOCK_INSTITUTIONS = [{"slug": "caf_morbihan", "name": "CAF du Morbihan"}]

RAW_YAML = "label: Chèques déjeuner\ninstitution: caf_morbihan\ndescription: Aide pour jeunes\ntype: bool\nperiodicite: mensuelle\n"

INITIAL_STATE = {
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
}


@pytest.mark.asyncio
async def test_successful_format():
    from agent.agents.contribution import ContributionAgent

    with patch("agent.agents.contribution.referentiel") as mock_ref:
        mock_ref.institutions = MOCK_INSTITUTIONS
        mock_ref.benefit_slugs = []

        with patch("agent.agents.contribution.LLMService") as MockLLM:
            mock_llm = MagicMock()
            mock_llm.generate_json_benefit = AsyncMock(return_value=VALID_LLM_JSON)
            MockLLM.return_value = mock_llm

            agent = ContributionAgent()

        with patch("agent.agents.contribution.referentiel") as mock_ref2:
            mock_ref2.institutions = MOCK_INSTITUTIONS
            mock_ref2.benefit_slugs = []

            result = await agent.app.ainvoke({"raw_yaml": RAW_YAML, **INITIAL_STATE})

    assert result["yaml_content"] is not None
    assert "chèques déjeuner" in result["yaml_content"]
    assert result["filename"] is not None
    assert result["missing_fields"] == ["montant"]
    assert len(result["questions_for_contributor"]) == 1
    assert result["error"] is None


@pytest.mark.asyncio
async def test_unparseable_yaml_sets_error():
    from agent.agents.contribution import ContributionAgent

    with patch("agent.agents.contribution.referentiel") as mock_ref:
        mock_ref.institutions = MOCK_INSTITUTIONS
        mock_ref.benefit_slugs = []

        with patch("agent.agents.contribution.LLMService") as MockLLM:
            mock_llm = MagicMock()
            MockLLM.return_value = mock_llm

            agent = ContributionAgent()

        with patch("agent.agents.contribution.referentiel") as mock_ref2:
            mock_ref2.institutions = MOCK_INSTITUTIONS
            mock_ref2.benefit_slugs = []

            result = await agent.app.ainvoke({
                "raw_yaml": ": bad : yaml : {{",
                **INITIAL_STATE,
            })

    assert result["error"] is not None
    assert result["yaml_content"] is None
