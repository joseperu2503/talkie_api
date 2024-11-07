FROM node:18-alpine3.15 AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci && npm cache clean --force
CMD ["npm", "run", "start:dev"]


FROM node:18-alpine3.15 AS production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build
CMD ["npm", "run", "start:prod"]

FROM node:18-alpine3.15 AS staging
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build
CMD ["npm", "run", "start:staging"]