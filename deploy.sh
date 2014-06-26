#!/bin/bash
set -o nounset
set -o errexit

grunt
cd dist
git add -u
git add .
git commit -m "livraison"
git push heroku master
cd ..
