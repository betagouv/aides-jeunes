#!/bin/sh

cd /srv/app

npm install

node_modules/.bin/grunt serve --no-open
