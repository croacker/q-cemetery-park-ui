FROM node:lts-alpine as develop-stage
WORKDIR /app
COPY package*.json ./
RUN npm install -g @quasar/cli
COPY . .
# build stage
FROM develop-stage as build-stage
RUN quasar build
# production stage
FROM node:lts-alpine as production-stage
RUN npm install -g http-server
COPY --from=build-stage /app/dist/spa /app/dist/spa
EXPOSE 8080
CMD [ "http-server", "/app/dist/spa" ]
