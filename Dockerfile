FROM node:lts-alpine3.18 AS builder

WORKDIR /app

COPY . .
COPY .env.example .env

RUN yarn install && yarn build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist .

RUN rm -rf /etc/nginx/conf.d/default.conf

COPY default.conf /etc/nginx/conf.d

ENTRYPOINT ["nginx", "-g", "daemon off;"]
