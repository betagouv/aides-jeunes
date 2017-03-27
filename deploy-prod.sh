#!/bin/bash
# This script is not currently meant to be executed from within the repository.
# Copy or symlink it to some deployment directory.

OPENFISCA_PORT=12000

set -ex

cd /var/www/dds

# Update mes-aides
git fetch origin
git checkout --force --detach origin/master
git clean --force
npm install
npm run prestart

# Update openfisca
npm run install-openfisca
cat openfisca/api_config.ini | sed "s/port = 2000/port = $OPENFISCA_PORT/" > ~/production.ini

# Restart mes-aides
sudo start dds || sudo restart dds

# Restart openfisca
sudo start openfisca || sudo restart openfisca

echo "Déploiement effectué"
