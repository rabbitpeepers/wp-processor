# Build TS to JS
FROM node:14 AS webbuild
WORKDIR /web

COPY ./.eslintrc /web/.eslintrc
COPY ./package.json /web/package.json
COPY ./tsconfig.json /web/tsconfig.json
COPY ./yarn.lock /web/yarn.lock
COPY ./src /web/src
RUN yarn
WORKDIR /web
RUN yarn build

# start app
CMD ["yarn", "serve"]
