#!/bin/bash

cd `dirname $0`

SCRIPT_NAME=${1:-HELO}
LOG_FILE=../../../migration.log
MAX_LOOP=300

loop_count=1
migrate() {
    script_result=$(node index.js $SCRIPT_NAME | tee -a $LOG_FILE)
    read number error <<< $(echo $script_result | awk -F";" '{ print $6" "$7 }')
}

migrate
while [[ $number -ne 0 && $error -eq 0 && $loop_count -ne $MAX_LOOP ]];
do
    migrate
    ((loop_count++))
done

if [[ $loop_count -eq $MAX_LOOP || $error -ne 0 ]]
then
    echo "Loop;$loop_count;Error;$error"
    exit 1
else
    echo "Loop;$loop_count"
    exit 0
fi
