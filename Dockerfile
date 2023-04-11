FROM node:18

#RUN mkdir /usr/src/aides-jeunes
#WORKDIR /usr/src/aides-jeunes

COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build
EXPOSE 8080
#CMD npm run start
ENV OPENFISCA_INTERNAL_ROOT_URL=http://host.docker.internal:2000
ENV MONGODB_URL=mongodb://host.docker.internal/db_aides_jeunes
CMD cd dist-server && NODE_ENV=production node ./backend/server.js