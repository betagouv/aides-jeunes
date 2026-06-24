from pathlib import Path
import yaml
from configs.settings import settings


class ReferentielService:
    def __init__(self, data_path: Path = None):
        self._data_path = data_path or settings.AIDES_JEUNES_DATA_PATH
        self._institutions: list[dict] = []
        self._benefit_slugs: list[str] = []
        self._loaded = False

    def load(self) -> None:
        if self._loaded:
            return
        institutions_dir = self._data_path / "institutions"
        for f in sorted(institutions_dir.glob("*.yml")):
            try:
                with open(f, encoding="utf-8") as fh:
                    data = yaml.safe_load(fh)
                if isinstance(data, dict):
                    data["slug"] = f.stem
                    self._institutions.append(data)
            except Exception:
                pass
        js_dir = self._data_path / "benefits" / "javascript"
        for f in js_dir.glob("*.yml"):
            self._benefit_slugs.append(f.stem)
        self._loaded = True

    @property
    def institutions(self) -> list[dict]:
        self.load()
        return self._institutions

    @property
    def benefit_slugs(self) -> list[str]:
        self.load()
        return self._benefit_slugs


referentiel = ReferentielService()
