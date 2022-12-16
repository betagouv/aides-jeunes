#!/bin/bash

cd `dirname $0`

node ../../dist-server/backend/lib/email.js send benefit-action-survey --multiple 1000
