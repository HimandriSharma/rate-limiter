FROM node:lts
RUN apt update && apt install -y yarn

WORKDIR /app
RUN chown -R node:node /app

COPY --chown=node:node . ./

RUN yarn install

USER node

CMD ["yarn","run","dev"]
