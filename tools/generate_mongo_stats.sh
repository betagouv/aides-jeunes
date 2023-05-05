#!/bin/bash

cd `dirname $0`

NOW=$(date +"%F_%H-%M-%S")
DEST=../dist/documents
mkdir -p "$DEST"

echo $NOW

function generate_stats {
  echo $2
  mongo --quiet db_aides_jeunes --eval "const headers='$1';" mongo-query.js > $DEST/$2_$NOW.csv
  cp $DEST/$2_$NOW.csv $DEST/$2.csv
}

generate_stats month,activite monthly_activite
generate_stats month,age monthly_age
generate_stats month,depcom100kp,departement,region monthly_geo
