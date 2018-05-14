#!/bin/sh

cd /usr/src/app/openfisca

gunicorn api --config config.py
