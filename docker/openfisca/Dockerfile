FROM python:3.7-alpine

# Install packages needed for build
RUN apk add --no-cache --virtual .build-deps \
    build-base \
    gcc \
    linux-headers \
    git

RUN apk add --no-cache \
    yaml \
    yaml-dev \
    libstdc++

RUN mkdir /usr/src/openfisca
WORKDIR /usr/src/openfisca

COPY openfisca/api.py ./
COPY openfisca/config.py ./
COPY openfisca/requirements.txt ./

RUN pip install --upgrade -r requirements.txt

# Remove packages not needed after build
RUN apk del .build-deps

COPY docker/openfisca/docker-entrypoint.sh /

RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
