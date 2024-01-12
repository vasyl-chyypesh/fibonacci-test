#builder image
FROM node:20.11.0-alpine AS builder
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY ./src ./src
RUN npm run build

#final image
FROM node:20.11.0-alpine
WORKDIR /usr/app
RUN chown node:node .
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install --production
COPY --from=builder /usr/app/dist ./dist

USER node
EXPOSE 3000
CMD [ "node", "dist/app/index.js" ]
