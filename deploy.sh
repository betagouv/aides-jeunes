#!/bin/bash
# This script is not currently meant to be executed from within the repository.
# Copy or symlink it to some deployment directory.

set -ex

LOG_FILE=deployment.log

# Defaults for production.
# Example for development:
#   PORT=8100 OPENFISCA_PORT=12100 ./deploy.sh aah
# Example for production:
#   PORT=8000 OPENFISCA_PORT=2000 PUBLIC_HOST=mes-aides.gouv.fr PROTOCOL=https ./deploy.sh
TARGET_BRANCH=${1:-master}
PORT=${PORT:-8000}
OPENFISCA_PORT=${OPENFISCA_PORT:-12000}
PUBLIC_HOST=${PUBLIC_HOST:-$TARGET_BRANCH.mes-aides.sgmap.fr}
PROTOCOL=${PROTOCOL:-http}


# Log deployment
date >> $LOG_FILE
echo "Starting deployment of branch $TARGET_BRANCH" >> $LOG_FILE
echo "Main application expected to run on $PORT" >> $LOG_FILE
echo "OpenFisca expected to run on $OPENFISCA_PORT" >> $LOG_FILE
echo "Server expected to be visible on $PUBLIC_HOST" >> $LOG_FILE

# Install Mes Aides
if ! cd mes-aides-ui
then
    git clone https://github.com/sgmap/mes-aides-ui.git --branch $TARGET_BRANCH
    cd mes-aides-ui
fi

git fetch origin $TARGET_BRANCH
git checkout origin/$TARGET_BRANCH

rm -rf node_modules # work around libsass bindings being never found
npm install
grunt build

# Stop Mes Aides
forever stop server.js || echo 'No server was running'

mongo localhost --eval "db.copyDatabase('mes-aides-master', '`whoami`')"

# Start Mes Aides
OPENFISCA_URL="http://localhost:$OPENFISCA_PORT" SESSION_SECRET=foobar NODE_ENV=production MES_AIDES_ROOT_URL="$PROTOCOL://$PUBLIC_HOST" PORT=$PORT MONGODB_URL="mongodb://localhost/$(whoami)" forever -l ../mes-aides.log -e ../mes-aides_error.log --append start server.js

cd ..

# Install OpenFisca
if ! cd openfisca
then
    git clone https://github.com/sgmap/openfisca.git
    cd openfisca
fi

./update.sh $TARGET_BRANCH || {
        echo "No branch $TARGET_BRANCH was found on sgmap/openfisca. Staying on current branch."
        ./update.sh
    }

# Stop OpenFisca
killall --user `whoami` /usr/bin/python || echo 'No OpenFisca server was running'
# Start OpenFisca
PORT=$OPENFISCA_PORT nohup ./start.sh mes-aides >> ../openfisca.log 2>> ../openfisca_error.log &

cd ..

# Set up reverse proxy

echo "upstream $(whoami) {
    server 127.0.0.1:$PORT;
}

server {
    listen 80;
    server_name $PUBLIC_HOST;

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
curl -sL -w "GET %{url_effective} -> %{http_code}\\n" $PROTOCOL://$PUBLIC_HOST -o /dev/null

echo
echo 'Exécuter `service nginx reload` en root en cas de changement de ports ou de nouvelle instance'

echo "Deployment successful" >> $LOG_FILE
