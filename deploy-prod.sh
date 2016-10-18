#!/bin/bash
# This script is not currently meant to be executed from within the repository.
# Copy or symlink it to some deployment directory.

set -ex

cd /var/www/dds

# Update mes-aides
git fetch origin
git checkout --force --detach origin/master
git clean --force
npm install
grunt build

# Update openfisca
npm run install-openfisca
cat openfisca/api_config.ini | sed s/"port = 2000"/"port = 12000"/ > ~/production.ini

# Restart mes-aides
sudo restart dds

# Restart openfisca
sudo start openfisca || sudo restart openfisca

echo "Déploiement effectué"
