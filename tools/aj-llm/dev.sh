#!/usr/bin/env bash
# Lance le backend (FastAPI) et le frontend (Vite) en une seule commande.
# Ctrl-C arrête les deux proprement.
#
# Usage: ./dev.sh

set -euo pipefail
cd "$(dirname "$0")"

BLUE='\033[34m'
GREEN='\033[32m'
RESET='\033[0m'

pids=()

cleanup() {
  echo
  echo "→ Arrêt des serveurs…"
  for pid in "${pids[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Préfixe chaque ligne de sortie avec un label coloré.
prefix() {
  local label="$1" color="$2"
  while IFS= read -r line; do
    printf "${color}[%s]${RESET} %s\n" "$label" "$line"
  done
}

echo "→ Backend  : http://localhost:8000"
echo "→ Frontend : http://localhost:5173"
echo

# Backend — FastAPI avec hot-reload
( uv run uvicorn backend.main:app --reload --port 8000 2>&1 | prefix "back " "$BLUE" ) &
pids+=($!)

# Frontend — Vite dev server
( cd frontend && pnpm dev 2>&1 | prefix "front" "$GREEN" ) &
pids+=($!)

wait
