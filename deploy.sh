#!/bin/bash
# This script is not currently meant to be executed from within the repository.
# Copy or symlink it to some deployment directory.

set -ex

LOG_FILE=deployment.log

# Defaults for production.
# Example for development:
#   PORT=8100 OPENFISCA_PORT=12100 ./deploy.sh
# Example for production:
#   PORT=8000 OPENFISCA_PORT=2000 PUBLIC_HOST=mes-aides.gouv.fr PROTOCOL=https ./deploy.sh
USER=`whoami`
TARGET_BRANCH=${USER#mes-aides-}
source current_config.env || echo "No current_config.env file found."
PORT=${PORT:-$CURRENT_PORT}
OPENFISCA_PORT=${OPENFISCA_PORT:-$CURRENT_OPENFISCA_PORT}

if ! [[ -n $PORT && -n $OPENFISCA_PORT ]]
then
    echo "Ports not specified, and not found in current_config.env file. Please provide them."
    exit 1
fi

PUBLIC_HOST=${PUBLIC_HOST:-${CURRENT_PUBLIC_HOST:-$TARGET_BRANCH.mes-aides.beta.gouv.fr}}
PROTOCOL=${PROTOCOL:-${CURRENT_PROTOCOL:-http}}

# Log deployment
date >> $LOG_FILE
echo "Starting deployment of branch $TARGET_BRANCH" >> $LOG_FILE
echo "Main application expected to run on $PORT" >> $LOG_FILE
echo "OpenFisca expected to run on $OPENFISCA_PORT" >> $LOG_FILE
echo "Server expected to be visible on $PUBLIC_HOST" >> $LOG_FILE

# Install Mes Aides
if [ ! -d "mes-aides-ui" ]; then
    git clone https://github.com/sgmap/mes-aides-ui.git --branch $TARGET_BRANCH
fi

cd mes-aides-ui

git fetch origin $TARGET_BRANCH
git checkout origin/$TARGET_BRANCH

rm -rf node_modules # work around libsass bindings being never found
npm install
grunt build

# Stop Mes Aides
forever stop mes-aides || echo 'No server was running'

mongo localhost --eval "db.copyDatabase('mes-aides-master', '$USER')"

# Start Mes Aides
OPENFISCA_URL="http://localhost:$OPENFISCA_PORT" SESSION_SECRET=foobar NODE_ENV=production MES_AIDES_ROOT_URL="$PROTOCOL://$PUBLIC_HOST" PORT=$PORT MONGODB_URL="mongodb://localhost/$USER" forever --uid mes-aides -l ../mes-aides.log -e ../mes-aides_error.log --append start server.js

cd ..

# Install OpenFisca

if [[ ! $VIRTUAL_ENV ]]; then
    user_option='--user'
fi

pip install --requirement mes-aides-ui/openfisca/requirements.txt $user_option

sed s/%PORT%/$OPENFISCA_PORT/ mes-aides-ui/openfisca/api_config.ini > current_openfisca_config.ini

# Stop OpenFisca
forever stop openfisca || echo 'No OpenFisca server was running'

# Start OpenFisca
forever --uid openfisca -l openfisca.log -e openfisca_error.log --append start -c "paster serve" current_openfisca_config.ini

# Set up reverse proxy

echo "upstream $USER {
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

        proxy_pass  http://$USER;
        proxy_redirect off;
    }
}" > /etc/nginx/conf.d/$USER.conf

# Save current config
echo "CURRENT_PORT=$PORT
CURRENT_OPENFISCA_PORT=$OPENFISCA_PORT
CURRENT_PUBLIC_HOST=$PUBLIC_HOST
CURRENT_PROTOCOL=$PROTOCOL
" > current_config.env

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
