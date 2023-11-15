#!/bin/bash

cd `dirname $0`

node ../../../../dist-server/backend/lib/messaging/email/email-sending-tool.js send initial-survey --multiple 1000
