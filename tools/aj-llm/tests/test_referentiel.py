import pytest
from pathlib import Path


def test_load_institutions(tmp_path):
    from agent.services.referentiel import ReferentielService
    inst_dir = tmp_path / "institutions"
    inst_dir.mkdir()
    (inst_dir / "caf_test.yml").write_text(
        "name: CAF de Test\ntype: caf\ncode_siren: '123456789'\ndepartments:\n  - '01'\n"
    )
    (tmp_path / "benefits" / "javascript").mkdir(parents=True)

    svc = ReferentielService(data_path=tmp_path)
    svc.load()

    assert len(svc.institutions) == 1
    assert svc.institutions[0]["slug"] == "caf_test"
    assert svc.institutions[0]["name"] == "CAF de Test"


def test_load_benefit_slugs(tmp_path):
    from agent.services.referentiel import ReferentielService
    (tmp_path / "institutions").mkdir()
    js_dir = tmp_path / "benefits" / "javascript"
    js_dir.mkdir(parents=True)
    (js_dir / "caf-test-aide-logement.yml").write_text("label: aide logement\ntype: float\n")
    (js_dir / "caf-test-aide-transport.yml").write_text("label: aide transport\ntype: bool\n")

    svc = ReferentielService(data_path=tmp_path)
    svc.load()

    assert "caf-test-aide-logement" in svc.benefit_slugs
    assert "caf-test-aide-transport" in svc.benefit_slugs
    assert len(svc.benefit_slugs) == 2


def test_load_is_idempotent(tmp_path):
    from agent.services.referentiel import ReferentielService
    (tmp_path / "institutions").mkdir()
    (tmp_path / "benefits" / "javascript").mkdir(parents=True)

    svc = ReferentielService(data_path=tmp_path)
    svc.load()
    svc.load()  # second call should not re-parse

    assert svc._loaded is True


def test_singleton_uses_settings_path():
    from agent.services.referentiel import referentiel
    from configs.settings import settings
    assert referentiel._data_path == settings.AIDES_JEUNES_DATA_PATH
