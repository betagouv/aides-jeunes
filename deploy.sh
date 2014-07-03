#!/bin/bash
set -o nounset
set -o errexit

grunt
cd dist
git add --all
git commit -m "livraison"
git push heroku master
cd ..
