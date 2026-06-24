# aj-llm — Agents IA pour Aides Jeunes

Outils LLM pour alimenter et maintenir la base Aides Jeunes, **intégrés dans le repo `aides-jeunes`** (`tools/aj-llm/`).

- **Agent 1 — Contribution** : formate un YAML brut en fiche `benefits` valide, et l'écrit **directement** dans `data/benefits/javascript/`.
- **Agent 2 — URL** : scrape une page et génère la fiche _(à venir)_
- **Agent 3 — Veille** : détecte liens cassés / contenus obsolètes _(à venir)_

> **Écriture directe, sans PR.** En mode local (`PUBLISH_MODE=dev`, défaut), l'outil modifie les fichiers du repo sur disque. Tu relis le diff et committes toi-même. Aucune gestion de PR GitHub.

---

## Emplacement

```
aides-jeunes/
├── data/                 ← cible des écritures (benefits, institutions…)
└── tools/
    └── aj-llm/           ← cet outil
```

L'outil écrit dans `../../data` par rapport à `tools/aj-llm/` (résolu automatiquement). Surcharge possible via `AIDES_JEUNES_DATA_PATH`.

---

## Prérequis

- Python 3.11+ avec [`uv`](https://docs.astral.sh/uv/)
- Node.js 18+ avec `pnpm`
- Redis local (`brew install redis && brew services start redis`)

---

## Installation

```bash
cd tools/aj-llm

# Backend
uv sync

# Frontend
cd frontend && pnpm install && cd ..

# Config
cp .env.example .env   # puis renseigner OPENAI_API_KEY / MODEL_NAME
```

---

## Lancer (local)

### Backend seul (API + frontend buildé)

```bash
cd tools/aj-llm
uv run uvicorn backend.main:app --reload --port 8000
```

API sur `http://localhost:8000`.

### Dev frontend (hot-reload)

```bash
# Terminal 1 — backend
uv run uvicorn backend.main:app --reload --port 8000
# Terminal 2 — frontend
cd frontend && pnpm dev
```

UI sur `http://localhost:5173` (proxy `/api` → `:8000`).

---

## Workflow Agent 1 (contribution → écriture directe)

1. **Formater** un YAML brut :

   ```bash
   curl -s -X POST http://localhost:8000/api/contribution/format \
     -H "Content-Type: application/json" \
     -d '{"yaml_content":"label: aide au BAFA\ninstitution: caf_haute_savoie\ndescription: ...\ntype: float\nperiodicite: ponctuelle\nunit: \"€\"\nmontant: 109\nlink: https://www.caf.fr\n"}' \
     | python3 -m json.tool
   ```

   Réponse : `yaml_content` + `filename` (ex. `aide-au-bafa-caf-haute-savoie.yml`).

2. **Écrire** la fiche dans `data/benefits/javascript/` :

   ```bash
   curl -s -X POST http://localhost:8000/api/contribution/save \
     -H "Content-Type: application/json" \
     -d '{"yaml_content":"...","filename":"aide-au-bafa-caf-haute-savoie.yml"}'
   ```

   Réponse : `{"status":"success","path":".../data/benefits/javascript/aide-au-bafa-caf-haute-savoie.yml"}`.

3. **Relire + committer** dans `aides-jeunes` :
   ```bash
   cd ../..        # racine aides-jeunes
   git diff data/benefits/javascript/
   git add data/benefits/javascript/<fichier>.yml && git commit
   ```

> `filename` est strictement validé (`slug-kebab-case.yml`, sans chemin) — anti path-traversal.

---

## Tests

```bash
uv run pytest tests/ -v
```

---

## Roadmap déploiement

- **Itération 1 (actuelle)** : outil local lancé à la main (ce README).
- **Itération 2** : montage automatique via **Ansible** (service + Redis provisionnés avec l'infra aides-jeunes).
