FROM node:22-alpine AS build-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
ARG VITE_APP_USER_API_URL
ARG VITE_APP_THREAT_API_URL
ENV VITE_APP_USER_API_URL $VITE_APP_USER_API_URL
ENV VITE_APP_USER_API_URL $VITE_APP_USER_API_URL
RUN yarn build

FROM busybox:1.37
RUN adduser -D static
USER static
WORKDIR /home/static
COPY --from=build-stage /app/dist .
CMD ["busybox", "httpd", "-f", "-v", "-p", "3000"]
