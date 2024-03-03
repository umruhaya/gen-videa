FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm i -g pnpm
RUN pnpm i
RUN pnpm astro build

CMD node ./dist/server/entry.mjs