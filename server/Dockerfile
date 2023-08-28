FROM node:alpine

WORKDIR /usr/app/server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "yarn", "dev" ]