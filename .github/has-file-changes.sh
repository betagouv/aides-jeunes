#! /usr/bin/env bash

result=$(git diff origin/main...HEAD --name-only -- "$1")
echo $result

if [ -z "$result" ]
then
  echo "No functional changes detected."
  exit 1
else
  echo "The functional files above were changed."
fi
