FROM node:8-alpine

RUN apk update \
    && apk add --no-cache git

RUN set -ex \
  && apk add --no-cache --virtual .build-deps ca-certificates openssl bzip2 \
  && wget -qO- "https://github.com/dustinblackman/phantomized/releases/download/2.1.1a/dockerized-phantomjs.tar.gz" | tar xz -C / \
  && npm config set user 0 \
  && npm install -g phantomjs-prebuilt \
  && apk del .build-deps

ENV PHANTOMJS_BIN /usr/local/bin/phantomjs

WORKDIR /srv/app

COPY package.json /srv/app
COPY package-lock.json /srv/app

RUN npm install

COPY docker/node/start.sh /usr/local/bin/node-app-start
RUN chmod +x /usr/local/bin/node-app-start

CMD ["node-app-start"]
