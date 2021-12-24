FROM node:17-alpine

WORKDIR /home/app

COPY ./app .

RUN npm i

CMD ["node", "app.js"]


