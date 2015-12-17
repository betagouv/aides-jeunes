# Replaces the local database by the production one

USER=mes-aides-master
DATABASE=mes-aides-master

NOW=$(date +"%F-%H-%M-%S")

DISTANT_DUMP_FOLDER="~/dumps/dump-$NOW"
LOCAL_DUMP_FOLDER='./dump'


cd `dirname $0`

read -n 1 -p "Are you POSITIVE you want to merge contents of the local $DATABASE database with contents from the distant $USER one?  [y/N]" sure

if [[ $sure != 'y' ]]
then
    echo 'Cancelled'
    exit 1
fi

set -ex

ssh $USER@sgmap.fr "mongodump --db $DATABASE && mkdir -p `dirname $DISTANT_DUMP_FOLDER` && mv dump $DISTANT_DUMP_FOLDER/ && gzip -rv $DISTANT_DUMP_FOLDER"
rm -rf $LOCAL_DUMP_FOLDER
scp -r $USER@sgmap.fr:$DISTANT_DUMP_FOLDER/$DATABASE $LOCAL_DUMP_FOLDER
gunzip -r $LOCAL_DUMP_FOLDER
mongorestore --db $DATABASE $LOCAL_DUMP_FOLDER
