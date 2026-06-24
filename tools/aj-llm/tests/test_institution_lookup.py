from unittest.mock import patch

MOCK_INSTITUTIONS = [
    {"slug": "caf_haute_savoie", "name": "CAF de la Haute-Savoie"},
    {"slug": "caf_morbihan", "name": "CAF du Morbihan"},
    {"slug": "commune_paris", "name": "Mairie de Paris"},
]


def test_exact_match():
    from agent.tools.institution_lookup import lookup_institution
    with patch("agent.tools.institution_lookup.referentiel") as mock_ref:
        mock_ref.institutions = MOCK_INSTITUTIONS
        slug, found = lookup_institution("CAF de la Haute-Savoie")
    assert slug == "caf_haute_savoie"
    assert found is True


def test_fuzzy_match():
    from agent.tools.institution_lookup import lookup_institution
    with patch("agent.tools.institution_lookup.referentiel") as mock_ref:
        mock_ref.institutions = MOCK_INSTITUTIONS
        slug, found = lookup_institution("CAF Haute Savoie")
    assert slug == "caf_haute_savoie"
    assert found is True


def test_no_match_returns_proposed_slug():
    from agent.tools.institution_lookup import lookup_institution
    with patch("agent.tools.institution_lookup.referentiel") as mock_ref:
        mock_ref.institutions = MOCK_INSTITUTIONS
        slug, found = lookup_institution("Ville de Quelquepart")
    assert found is False
    assert slug == "ville-de-quelquepart"


def test_slugify_removes_accents():
    from agent.tools.institution_lookup import slugify
    assert slugify("CAF de l'Aube") == "caf-de-l-aube"
    assert slugify("Région Île-de-France") == "region-ile-de-france"


def test_empty_referentiel():
    from agent.tools.institution_lookup import lookup_institution
    with patch("agent.tools.institution_lookup.referentiel") as mock_ref:
        mock_ref.institutions = []
        slug, found = lookup_institution("CAF du Morbihan")
    assert found is False
    assert slug == "caf-du-morbihan"
