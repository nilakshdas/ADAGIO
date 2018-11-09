FROM node:latest

EXPOSE 3000

RUN mkdir -p /usr/src/app
ADD . /usr/src/app

WORKDIR /usr/src/app

RUN npm install

CMD ["npm", "start"]
