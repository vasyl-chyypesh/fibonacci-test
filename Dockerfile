# official node images: https://hub.docker.com/_/node/
# builder image
FROM node:21.6.2-alpine AS builder
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install --ignore-scripts
COPY ./src ./src
RUN npm run build

# final image
FROM node:21.6.2-alpine
WORKDIR /usr/app
RUN chown node:node .
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install --production --ignore-scripts
COPY --from=builder /usr/app/dist ./dist

USER node
EXPOSE 3000
CMD [ "node", "dist/app/index.js" ]
