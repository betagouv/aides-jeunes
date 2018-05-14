#!/bin/sh

cd /srv/app

npm install

bower --allow-root prune
bower --allow-root install

node_modules/.bin/grunt serve --no-open
