FROM node:20-alpine

WORKDIR /microcontrollers-ms

COPY *.json ./
RUN npm install --production

COPY src src

USER node

CMD [ "npm", "start" ]
