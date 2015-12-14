#!/bin/bash
# This script is not currently meant to be executed from within the repository.
# Copy or symlink it to some deployment directory.

set -ex

# Defaults for production.
# Example for development:
#   PORT=8100 OPENFISCA_PORT=2000 PUBLIC_URL=http://next.mes-aides.sgmap.fr ./deploy.sh aah
TARGET_BRANCH=${1:-master}  # demo
PORT=${PORT:-8000}  # 8100
OPENFISCA_PORT=${OPENFISCA_PORT:-12000}  # 2000
PUBLIC_URL=${PUBLIC_URL:-https://mes-aides.gouv.fr}  # http://next.mes-aides.sgmap.fr

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
killall --user `whoami` node || echo 'No server was running'
# Start Mes Aides
OPENFISCA_URL="http://localhost:$OPENFISCA_PORT" SESSION_SECRET=foobar NODE_ENV=production MES_AIDES_ROOT_URL="$PUBLIC_URL" PORT=$PORT MONGODB_URL="mongodb://localhost/$(whoami)" nohup node server.js >> ../mes-aides_log.txt &

cd ..

# Install OpenFisca
if ! cd openfisca
then
    git clone https://github.com/sgmap/openfisca.git
    cd openfisca
fi

./update.sh $TARGET_BRANCH

# Stop OpenFisca
killall --user `whoami` /usr/bin/python || echo 'No OpenFisca server was running'
# Start OpenFisca
PORT=$OPENFISCA_PORT nohup ./start.sh mes-aides >> ../openfisca_log.txt &

cd ..

# Set up reverse proxy

echo "upstream $(whoami) {
    server 127.0.0.1:$PORT;
}

server {
    listen 80;
    server_name $(whoami).mes-aides.sgmap.fr;

    access_log off;

    gzip on;
    gzip_proxied any;
    gzip_types application/json
               application/javascript
               text/css
               text/plain
               text/xml;
    gzip_vary on;

    location / {
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header Host \$http_host;

        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \"upgrade\";

        proxy_pass  http://$(whoami);
        proxy_redirect off;
    }
}" > /etc/nginx/conf.d/$(whoami).conf

set +x

echo "===================="
echo "Déploiement effectué"
echo "Attente du démarrage du serveur OpenFisca…"

wget --quiet --retry-connrefused --waitretry=1 --output-document=/dev/null http://localhost:$OPENFISCA_PORT

# Smoke test
curl -sL -w "GET %{url_effective} -> %{http_code}\\n" localhost:$OPENFISCA_PORT -o /dev/null
curl -sL -w "GET %{url_effective} -> %{http_code}\\n" localhost:$PORT -o /dev/null
curl -sL -w "GET %{url_effective} -> %{http_code}\\n" $PUBLIC_URL -o /dev/null

echo
echo 'Exécuter `service nginx reload` en root en cas de changement de ports ou de nouvelle instance'
