#! /usr/bin/env bash

result=$(git diff origin/master... --name-only data/benefits)
echo $result

if [ -z "$result" ]
then
  echo "No functional changes detected."
  exit 1
else
  echo "The functional files above were changed."
fi
