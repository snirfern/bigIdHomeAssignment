FROM node:20.12.0-alpine

WORKDIR /usr/src/app

COPY ../../ package*.json ./

RUN npm install

COPY ../src ./src
COPY ../tests ./tests

RUN mkdir -p /usr/src/app/test-results


CMD ["npm", "run", "test"]
