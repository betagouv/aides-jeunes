import re
from thefuzz import process
from agent.services.referentiel import referentiel


def slugify(text: str) -> str:
    text = text.lower().strip()
    for chars, repl in [
        ("àâä", "a"), ("éèêë", "e"), ("îï", "i"),
        ("ôö", "o"), ("ùûü", "u"), ("ç", "c"),
    ]:
        for ch in chars:
            text = text.replace(ch, repl)
    text = re.sub(r"[^a-z0-9\s-]", "-", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")


def lookup_institution(name: str) -> tuple[str | None, bool]:
    """Return (slug, found). If not found: (proposed_kebab_slug, False)."""
    institutions = referentiel.institutions
    if not institutions:
        return slugify(name), False

    labels = [i.get("name", "") for i in institutions]
    result = process.extractOne(name, labels)
    if result is None:
        return slugify(name), False

    match, score = result
    if score >= 80:
        idx = labels.index(match)
        return institutions[idx]["slug"], True

    return slugify(name), False
