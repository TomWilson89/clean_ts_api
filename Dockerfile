FROM node:14

WORKDIR /usr/src/clean-node-api

COPY ./package.json .

RUN yarn --only=prod

COPY ./dist  ./dist

EXPOSE 4000

CMD [ "yarn", "start" ]