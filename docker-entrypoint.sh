#!/bin/sh

gunicorn api --config /usr/src/openfisca/config.py
