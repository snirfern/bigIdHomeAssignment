FROM node:20.12.0-alpine

WORKDIR /usr/src/app

COPY ../package*.json ./

RUN npm install

COPY ../.. ./

RUN npm run build

EXPOSE 3000

CMD ["npm","run", "run-app"]
