#!/bin/bash

# Afficher les informations de débogage
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Installer les dépendances globales
npm install -g concurrently

# Installer les dépendances du projet
npm ci

# Installer les types manquants
npm install @types/lodash-es @types/mustache @types/progress --save-dev

# Créer un lien symbolique pour lodash-es
mkdir -p node_modules/@types/lodash-es
echo '{ "name": "@types/lodash-es", "version": "4.17.12", "description": "TypeScript definitions for lodash-es", "license": "MIT", "dependencies": { "@types/lodash": "*" }, "typeScriptVersion": "4.2" }' > node_modules/@types/lodash-es/package.json
echo 'export * from "lodash";' > node_modules/@types/lodash-es/index.d.ts

# Exécuter le build
npm run build:server && npm run build:iframes && npm run build:front && npm run copy:templates

# Vérifier si le build a réussi
if [ $? -eq 0 ]; then
  echo "Build réussi!"
  exit 0
else
  echo "Erreur lors du build!"
  exit 1
fi
