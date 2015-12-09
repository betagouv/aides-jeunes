#!/bin/bash
# This script is not currently meant to be executed from within the repository.
# Copy or symlink it to some deployment directory.

set -ex

TARGET_BRANCH=${1:-demo}
PORT=${PORT:-8100}
OPENFISCA_PORT=${OPENFISCA_PORT:-2000}
PUBLIC_HOST=${PUBLIC_HOST:-next.mes-aides.sgmap.fr}

# Install Mes Aides
if ! cd mes-aides-ui
then
    git clone https://github.com/sgmap/mes-aides-ui.git
    cd mes-aides-ui
fi

git fetch origin $TARGET_BRANCH
git checkout origin/$TARGET_BRANCH

rm -rf node_modules # work around libsass bindings being never found
npm install
grunt build

# Stop Mes Aides
killall --user `whoami` node
# Start Mes Aides
OPENFISCA_URL="http://localhost:$OPENFISCA_PORT" SESSION_SECRET=foobar NODE_ENV=production MES_AIDES_ROOT_URL="http://$PUBLIC_HOST" PORT=$PORT MONGODB_URL="mongodb://localhost/$(whoami)" nohup node server.js &

cd

# Install OpenFisca
if ! cd openfisca
then
    git clone https://github.com/sgmap/openfisca.git
    cd openfisca
fi

git fetch origin $TARGET_BRANCH
git checkout origin/$TARGET_BRANCH

./update.sh --dev

# Stop OpenFisca
killall --user `whoami` /usr/bin/python
# Start OpenFisca
nohup ./start.sh &

cd

set +x

echo "===================="
echo "Déploiement effectué"

# Smoke test
curl -sL -w "GET %{url_effective} -> %{http_code}\\n" localhost:$OPENFISCA_PORT -o /dev/null
curl -sL -w "GET %{url_effective} -> %{http_code}\\n" localhost:$PORT -o /dev/null
curl -sL -w "GET %{url_effective} -> %{http_code}\\n" $PUBLIC_HOST -o /dev/null
