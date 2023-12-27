#builder image
FROM node:20.10.0-alpine AS builder
WORKDIR /usr/src/app
COPY package.json ./
COPY tsconfig.json ./
RUN npm install
COPY ./src ./src
RUN npm run build

#final image
FROM node:20.10.0-alpine
WORKDIR /usr/src/app
RUN chown node:node .
COPY package.json ./
COPY tsconfig.json ./
RUN npm install
COPY --from=builder /usr/src/app/dist ./dist

USER node
EXPOSE 3000
CMD [ "node", "dist/app/index.js" ]
