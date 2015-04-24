# Replaces the local test cases database by the distant one

USER=deploy
DATABASE=dds

NOW=$(date +"%F-%H-%M-%S")

DISTANT_DUMP_FOLDER="~/dumps/dump-$NOW"
LATEST_DUMP_SYMLINK='dump-latest'
LOCAL_DUMP_FOLDER='./dump'


cd `dirname $0`

read -n 1 -p "Are you POSITIVE you want to replace ALL contents of the $DATABASE database with contents from the $USER one?  [y/N]" sure

if [[ $sure != 'y' ]]
then
    echo 'Cancelled'
    exit 1
fi

ssh $USER@sgmap.fr "mongodump --db $DATABASE && mv dump $DISTANT_DUMP_FOLDER && rm $LATEST_DUMP_SYMLINK && ln -s $DIR_NAME $LATEST_DUMP_SYMLINK" &&
rm -rf $LOCAL_DUMP_FOLDER &&
scp -r $USER@sgmap.fr:$DISTANT_DUMP_FOLDER/$DATABASE $LOCAL_DUMP_FOLDER &&
mongorestore --drop --db $DATABASE $LOCAL_DUMP_FOLDER
