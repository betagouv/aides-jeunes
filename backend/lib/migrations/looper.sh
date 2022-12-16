#!/bin/bash

cd `dirname $0`

LOG_FILE=/home/main/migration.log
MAX_LOOP=1000

loop_count=1

# simulations / followups
MODEL_MIGRATION=$1;

echo "Migration de $MODEL_MIGRATION"

migrate() {
    script_result=$(npm run migrate -- --model=$MODEL_MIGRATION | tee -a $LOG_FILE)
    read number error <<< $(echo $script_result | awk -F";" '{ print $5" "$6 }')
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
