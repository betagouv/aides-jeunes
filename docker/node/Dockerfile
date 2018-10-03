FROM node:6.14-alpine

RUN apk update \
    && apk add --no-cache git

RUN set -ex \
  && apk add --no-cache --virtual .build-deps ca-certificates openssl bzip2 \
  && wget -qO- "https://github.com/dustinblackman/phantomized/releases/download/2.1.1/dockerized-phantomjs.tar.gz" | tar xz -C / \
  && npm install -g phantomjs \
  && apk del .build-deps

WORKDIR /srv/app

COPY package.json /srv/app

RUN npm install

COPY docker/node/start.sh /usr/local/bin/node-app-start
RUN chmod +x /usr/local/bin/node-app-start

CMD ["node-app-start"]
