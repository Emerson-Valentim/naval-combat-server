FROM node:lts-alpine

ARG SERVICE=notification

WORKDIR /home/ubuntu/services/$SERVICE

COPY services/notification/build ./build

CMD tail -f /dev/null