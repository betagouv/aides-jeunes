#!/usr/bin/env bash
curl --user ${CIRCLE_TOKEN}: \
    --request POST \
    --form config=config.yml \
    --form notify=false \
        https://circleci.com/api/v1.1/project/github/betagouv/mes-aides-ui/tree/coherence-versions