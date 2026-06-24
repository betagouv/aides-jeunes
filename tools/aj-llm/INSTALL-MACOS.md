# Installation pas à pas (macOS)

Pré-requis : ouvrir un terminal et aller dans le dossier `aides-jeunes/tools/aj-llm`.

---

## Étape 1 — Installer les 3 outils du projet

Une seule commande installe tout :

```bash
brew install uv node redis
```

- `uv` = lance la partie Python
- `node` = lance la partie site web
- `redis` = petite base mémoire utilisée par l'outil

---

## Étape 2 — Activer pnpm (gestionnaire du site web)

`pnpm` est fourni avec `node` via un outil appelé `corepack`. Active-le :

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

Vérifie que ça marche :

```bash
pnpm --version
```

Tu dois voir un numéro (ex. `9.x.x`). Si « command not found », ferme et rouvre le Terminal, puis réessaie. En dernier recours : `brew install pnpm`.

---

## Étape 3 — Démarrer Redis

À faire une fois, il tournera en fond tout seul ensuite.

```bash
brew services start redis
```

---

## Étape 4 — Installer la partie Python

```bash
uv sync
```

(Patiente — ça télécharge plusieurs fichiers la première fois.)

---

## Étape 5 — Installer la partie site web

```bash
cd frontend
pnpm install
cd ..
```

---

## Étape 6 — Configurer la clé

Copie le modèle :

```bash
cp .env.example .env
```

Puis ouvre ce fichier pour y mettre ta clé :

```bash
open -e .env
```

Une fenêtre TextEdit s'ouvre. Remplace `your-key-here` par ta vraie clé API, puis enregistre (`Cmd + S`) et ferme la fenêtre.

> Demande la clé `OPENAI_API_KEY` à la personne qui gère le projet si tu ne l'as pas.

---

## Étape 7 — Lancer l'outil (à chaque utilisation)

Il faut **2 fenêtres de Terminal** ouvertes en même temps.

### Fenêtre 1 — le moteur (backend)

```bash
cd ~/<chemin vers aides-jeunes>/tools/aj-llm
uv run uvicorn backend.main:app --reload --port 8000
```

Laisse cette fenêtre ouverte. Tu verras défiler du texte — c'est normal, ça veut dire que ça tourne.

### Fenêtre 2 — le site web (frontend)

Ouvre une **nouvelle** fenêtre Terminal (`Cmd + N` dans le Terminal), puis :

```bash
cd ~/<chemin vers aides-jeunes>/tools/aj-llm/frontend
pnpm dev
```

Cette fenêtre affiche une adresse, en général `http://localhost:5173`.

### Ouvrir dans le navigateur

```bash
open http://localhost:5173
```

Ou ouvre Safari/Chrome et tape `http://localhost:5173` toi-même.

---

## Étape 8 — Arrêter l'outil

Dans **chaque** fenêtre Terminal qui tourne, clique dedans et appuie sur :

```
Ctrl + C
```

(la touche `Ctrl`, pas `Cmd`). Tu peux ensuite fermer les fenêtres.

---

## Que fait l'outil avec mes fichiers ?

L'outil écrit **directement** les fiches dans le dossier `data/benefits/javascript/` du projet aides-jeunes. Aucune « PR » à gérer. Après usage, tu relis et tu enregistres les changements toi-même.

---

## En cas de problème

| Message / souci                        | Solution                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------- |
| `command not found: brew`              | Ferme et rouvre le Terminal. Sinon réinstalle Homebrew (https://brew.sh). |
| `command not found: uv` (ou node/pnpm) | Refais l'étape 1 (`brew install uv node redis`) puis l'étape 2.           |
| `No such file or directory` sur `cd`   | Le chemin est faux — vérifie où est le dossier `aides-jeunes`.            |
| La page web ne s'ouvre pas             | Vérifie que **les 2 fenêtres** Terminal tournent (étape 7).               |
| Erreur liée à Redis                    | Relance `brew services restart redis`.                                    |
| Erreur de clé / d'API                  | Vérifie `.env` (étape 6) — la clé doit être correcte.                     |

> Astuce : copie-colle le message d'erreur complet à la personne qui t'aide. C'est le plus rapide.
