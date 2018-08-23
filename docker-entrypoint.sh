#!/bin/sh

gunicorn api --config /usr/src/openfisca/config.py --preload --log-level debug --log-file=-
