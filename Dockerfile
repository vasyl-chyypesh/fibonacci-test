# official node images: https://hub.docker.com/_/node/
# use --platform=linux/amd64 if npm install hangs on M3 Mac
# builder image
FROM node:22.0.0-alpine AS builder
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install --ignore-scripts --no-audit
COPY ./src ./src
RUN npm run build

# final image
FROM node:22.0.0-alpine AS runner
WORKDIR /usr/app
RUN chown node:node .
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install --production --ignore-scripts --no-audit
COPY --from=builder /usr/app/dist ./dist

USER node
EXPOSE 3000
CMD [ "node", "dist/app/index.js" ]
