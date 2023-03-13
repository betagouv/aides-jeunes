FROM node:18

#RUN mkdir /usr/src/aides-jeunes
#WORKDIR /usr/src/aides-jeunes

COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
EXPOSE 8080
CMD npm run start
#RUN MONGODB_URL=mongodb://192.168.1.57/db_aides_jeunes npm run stats
