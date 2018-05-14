FROM node:6.14-alpine

RUN apk update \
    && apk add --no-cache git

WORKDIR /srv/app

COPY package.json /srv/app
COPY bower.json /srv/app

RUN npm install
RUN npm install -g bower

COPY docker/node/start.sh /usr/local/bin/node-app-start
RUN chmod +x /usr/local/bin/node-app-start

CMD ["node-app-start"]
