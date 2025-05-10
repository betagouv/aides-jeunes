#!/bin/bash

# Script de déploiement du simulateur MAAS Group sur Netlify

# Créer un répertoire temporaire pour le déploiement
echo "Création d'un répertoire temporaire pour le déploiement..."
mkdir -p deploy-temp

# Copier les fichiers nécessaires en excluant ceux listés dans .gitignore-deploy
echo "Copie des fichiers nécessaires..."
rsync -av --exclude-from='.gitignore-deploy' ./ deploy-temp/ --exclude='deploy-temp'

# Se déplacer dans le répertoire temporaire
cd deploy-temp

# Installer les dépendances
echo "Installation des dépendances..."
npm ci

# Construire l'application
echo "Construction de l'application..."
npm run build:front

# Créer le répertoire pour les templates d'emails
mkdir -p dist-server/backend/lib/mes-aides/emails/templates

# Déployer sur Netlify (nécessite l'installation préalable de netlify-cli)
echo "Déploiement sur Netlify..."
npx netlify deploy --prod --dir=dist --site=maas-group-simulateur

# Nettoyer le répertoire temporaire
echo "Nettoyage..."
cd ..
rm -rf deploy-temp

echo "Déploiement terminé !"
