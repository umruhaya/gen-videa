FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm i -g pnpm
RUN pnpm i
RUN pnpm astro build

FROM httpd:2.4-alpine AS runtime
COPY --from=build /app/dist /usr/local/apache2/htdocs/