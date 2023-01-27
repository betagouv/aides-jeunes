#!/bin/bash

cd `dirname $0`

node ../../dist-server/backend/lib/email.js send initial-survey --multiple 1000
