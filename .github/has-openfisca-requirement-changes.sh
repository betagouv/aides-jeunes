#! /usr/bin/env bash

result=$(git diff origin/master... --name-only openfisca/requirements.txt)
echo $result

if [ -z "$result" ]
then
  echo "No functional changes detected."
else
  echo "The functional files above were changed."
    exit 1
fi
