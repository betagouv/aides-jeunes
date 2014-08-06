#!/bin/bash
set -o nounset
set -o errexit

cd heroku
rm -rf app resources project conf build.sbt
cp -r ../app app
cp -r ../resources resources
cp -r ../project project
cp -r ../conf conf
cp ../build.sbt build.sbt
git add -A
git commit -m "livraison"
git push heroku master -f
