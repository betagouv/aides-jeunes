#!/bin/bash
# Replaces the local database by the production one

REMOTE=metal.mes-aides.gouv.fr
USER=root
DATABASE=dds

NOW=$(date +"%F-%H-%M-%S")

DISTANT_DUMP_FOLDER="~/dumps/dump-$NOW"
LOCAL_DUMP_FOLDER='./dump'

cd `dirname $0`

export LC_ALL=C

read -p "Do you want to delete the content of the local $DATABASE database as part of this import?  [y/N]" drop
if [[ $drop == 'y' ]]
then
    mongo $DATABASE --eval "db.dropDatabase()"
else
    read -p "Are you POSITIVE you want to merge contents of the local $DATABASE database with contents from the distant $USER one?  [y/N]" sure

    if [[ $sure != 'y' ]]
    then
        echo 'Cancelled'
        exit 1
    fi
fi

read -p "Do you want to LIMIT the imported situations to the one used in tests ONLY?  [y/N]" limited

set -ex

ssh $USER@$REMOTE "mongodump --db $DATABASE"

if [[ $limited == 'y' ]]
then
    ssh $USER@$REMOTE "mongodump --db=dds --collection=situations --query='{status: \"test\"}'"
    read -p "Do you want to rename the local 'situations' collection in 'legacysituations' after the import?  [y/N]" rename
fi

ssh $USER@$REMOTE "mkdir -p `dirname $DISTANT_DUMP_FOLDER` && mv dump $DISTANT_DUMP_FOLDER/ && gzip -rv $DISTANT_DUMP_FOLDER"
rm -rf $LOCAL_DUMP_FOLDER
scp -r $USER@$REMOTE:$DISTANT_DUMP_FOLDER/$DATABASE $LOCAL_DUMP_FOLDER
gunzip -r $LOCAL_DUMP_FOLDER

# Mongo version discrepancy prevent index restoration
if [[ $(whoami) != 'root' ]]
then
    RESTORE_PARAM=--noIndexRestore
fi
mongorestore --db $DATABASE $LOCAL_DUMP_FOLDER $RESTORE_PARAM

if [[ $rename == 'y'  ]]
then
    mongo $DATABASE --eval 'db.situations.renameCollection("legacysituations")'
fi
