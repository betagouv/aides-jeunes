import pytest
from agent.tools.yaml_validator import validate_benefit, json_to_yaml, compute_filename

VALID_BENEFIT = {
    "label": "aide au BAFA",
    "institution": "caf_haute_savoie",
    "description": "L'aide au BAFA permet de financer la formation.",
    "type": "float",
    "periodicite": "ponctuelle",
    "unit": "€",
    "montant": 109,
    "conditions_generales": [{"type": "age", "operator": ">=", "value": 16}],
    "profils": [],
    "link": "https://www.caf.fr",
}

EXISTING_INSTITUTIONS = ["caf_haute_savoie", "caf_morbihan"]
EXISTING_SLUGS = ["caf-haute-savoie-aide-bafa-autre"]


def test_valid_benefit_no_errors():
    errors = validate_benefit(VALID_BENEFIT, EXISTING_INSTITUTIONS, EXISTING_SLUGS)
    assert errors == []


def test_missing_required_fields():
    benefit = {"label": "test", "institution": "caf_haute_savoie"}
    errors = validate_benefit(benefit, EXISTING_INSTITUTIONS, EXISTING_SLUGS)
    assert any("description" in e for e in errors)
    assert any("type" in e for e in errors)
    assert any("periodicite" in e for e in errors)


def test_invalid_type():
    benefit = {**VALID_BENEFIT, "type": "invalid_type"}
    errors = validate_benefit(benefit, EXISTING_INSTITUTIONS, EXISTING_SLUGS)
    assert any("type invalide" in e for e in errors)


def test_invalid_periodicite():
    benefit = {**VALID_BENEFIT, "periodicite": "hebdomadaire"}
    errors = validate_benefit(benefit, EXISTING_INSTITUTIONS, EXISTING_SLUGS)
    assert any("periodicite invalide" in e for e in errors)


def test_description_too_long():
    long_desc = "a" * 421
    benefit = {**VALID_BENEFIT, "description": long_desc}
    errors = validate_benefit(benefit, EXISTING_INSTITUTIONS, EXISTING_SLUGS)
    assert any("description trop longue" in e for e in errors)


def test_description_with_html_tags_length_counts_text_only():
    # 418 chars of text wrapped in HTML tags — text length 418 <= 420, should pass
    desc = "<br>" + "a" * 418 + "<br>"
    benefit = {**VALID_BENEFIT, "description": desc}
    errors = validate_benefit(benefit, EXISTING_INSTITUTIONS, EXISTING_SLUGS)
    assert not any("description trop longue" in e for e in errors)


def test_unknown_institution():
    benefit = {**VALID_BENEFIT, "institution": "unknown_institution"}
    errors = validate_benefit(benefit, EXISTING_INSTITUTIONS, EXISTING_SLUGS)
    assert any("institution slug inexistant" in e for e in errors)


def test_json_to_yaml_produces_valid_yaml():
    import yaml as pyyaml
    yaml_str = json_to_yaml(VALID_BENEFIT)
    parsed = pyyaml.safe_load(yaml_str)
    assert parsed["label"] == "aide au BAFA"
    assert parsed["montant"] == 109


def test_json_to_yaml_strips_underscore_keys():
    data = {**VALID_BENEFIT, "_missing_fields": ["montant"], "_questions_for_contributor": []}
    yaml_str = json_to_yaml(data)
    assert "_missing_fields" not in yaml_str
    assert "_questions_for_contributor" not in yaml_str


def test_compute_filename():
    filename = compute_filename({"institution": "caf_haute_savoie", "label": "aide au BAFA"})
    assert filename.endswith(".yml")
    assert "caf-haute-savoie" in filename
    assert "aide-au-bafa" in filename
