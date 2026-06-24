import re
from io import StringIO
from ruamel.yaml import YAML

VALID_TYPES = {"float", "bool", "mixed"}
VALID_PERIODICITES = {"mensuelle", "ponctuelle", "annuelle", "autre"}
REQUIRED_FIELDS = ["label", "institution", "description", "type", "periodicite"]


def validate_benefit(
    data: dict,
    existing_institution_slugs: list[str],
    existing_benefit_slugs: list[str],
) -> list[str]:
    errors = []
    for field in REQUIRED_FIELDS:
        if not data.get(field):
            errors.append(f"Champ obligatoire manquant: {field}")

    if data.get("type") and data["type"] not in VALID_TYPES:
        errors.append(f"type invalide: '{data['type']}'. Valeurs autorisées: {sorted(VALID_TYPES)}")

    if data.get("periodicite") and data["periodicite"] not in VALID_PERIODICITES:
        errors.append(
            f"periodicite invalide: '{data['periodicite']}'. Valeurs autorisées: {sorted(VALID_PERIODICITES)}"
        )

    if data.get("description"):
        text_only = re.sub(r"<[^>]+>", "", data["description"])
        if len(text_only) > 420:
            errors.append(f"description trop longue: {len(text_only)} caractères (max 420 hors HTML)")

    if data.get("institution") and existing_institution_slugs:
        if data["institution"] not in existing_institution_slugs:
            errors.append(f"institution slug inexistant: '{data['institution']}'")

    return errors


def json_to_yaml(data: dict) -> str:
    """Convert dict to YAML source string. Strips keys starting with '_'."""
    clean = {k: v for k, v in data.items() if not k.startswith("_")}
    yaml = YAML()
    yaml.default_flow_style = False
    yaml.allow_unicode = True
    yaml.width = 120
    stream = StringIO()
    yaml.dump(clean, stream)
    return stream.getvalue()


def _slugify_for_filename(text: str) -> str:
    text = str(text).lower().strip()
    for chars, repl in [
        ("àâä", "a"), ("éèêë", "e"), ("îï", "i"),
        ("ôö", "o"), ("ùûü", "u"), ("ç", "c"),
    ]:
        for ch in chars:
            text = text.replace(ch, repl)
    text = re.sub(r"[^a-z0-9\s-]", "-", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")


def compute_filename(data: dict) -> str:
    institution = _slugify_for_filename(data.get("institution", ""))
    label = _slugify_for_filename(data.get("label", ""))
    base = f"{institution}-{label}"
    return base[:100] + ".yml"
