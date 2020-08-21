FROM node:8-alpine

RUN apk update \
    && apk add --no-cache git fontconfig

WORKDIR /srv/app

RUN set -ex \
  && apk add --no-cache --virtual .build-deps ca-certificates openssl bzip2 \
  && npm config set user 0 \
  && apk del .build-deps

# https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-on-alpine

# Installs latest Chromium (71) package.
# Puppeteer v1.9.0 works with Chromium 71.
RUN apk update && apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
      chromium@edge=~77.0.3865.75-r0 \
      nss@edge \
      freetype@edge \
      harfbuzz@edge \
      ttf-freefont@edge

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /srv/app \
    && chmod g+w /srv/app

# Running as root without --no-sandbox is not supported.
# See https://crbug.com/638180.
# Run everything after as non-privileged user.
USER pptruser

COPY package.json /srv/app
COPY package-lock.json /srv/app

RUN npm install

CMD ["npm", "run", "serve"]
