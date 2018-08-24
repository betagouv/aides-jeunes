FROM node:6.14-alpine

RUN apk update \
    && apk add --no-cache git

WORKDIR /srv/app

COPY package.json /srv/app

RUN npm install

COPY docker/node/start.sh /usr/local/bin/node-app-start
RUN chmod +x /usr/local/bin/node-app-start

CMD ["node-app-start"]
