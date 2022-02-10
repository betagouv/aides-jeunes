#!/bin/bash
set -eux

declare HOST=$1
declare STATUS=$2
declare TIMEOUT=$3

HOST=$HOST STATUS=$STATUS timeout --foreground -s TERM $TIMEOUT bash -c \
    'while [[ ${STATUS_RECEIVED} != ${STATUS} ]];\
        do STATUS_RECEIVED=$(curl -s -o /dev/null -L -w ''%{http_code}'' ${HOST}) && \
        echo "received status: $STATUS_RECEIVED" && \
        sleep 1;\
    done;
    echo success with status: $STATUS_RECEIVED'
