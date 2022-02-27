FROM node:lts-alpine

ARG SERVICE=worker

WORKDIR /home/ubuntu/services/$SERVICE
COPY services/$SERVICE/build ./build
COPY services/$SERVICE/package.json .

WORKDIR /home/ubuntu
COPY package.json .
COPY packages packages
RUN yarn --production

CMD tail -f /dev/null