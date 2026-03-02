FROM node:20-alpine

WORKDIR /measure-ms

COPY *.json ./
RUN npm install --production

COPY src src

CMD [ "npm", "start" ]
