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


# # Etapa base para reducir duplicación
# FROM node:18-alpine3.15 AS base
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm ci && npm cache clean --force

# # Etapa de desarrollo
# FROM base AS development
# CMD ["npm", "run", "start:dev"]

# # Etapa de construcción para production y staging
# FROM base AS build
# COPY . .
# # Ajustar la memoria disponible para Node.js durante la construcción
# RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# # Etapa de producción
# FROM node:18-alpine3.15 AS production
# WORKDIR /usr/src/app
# COPY --from=build /usr/src/app/dist ./dist
# COPY package*.json ./
# RUN npm ci --production && npm cache clean --force
# CMD ["npm", "run", "start:prod"]

# # Etapa de staging
# FROM node:18-alpine3.15 AS staging
# WORKDIR /usr/src/app
# COPY --from=build /usr/src/app/dist ./dist
# COPY package*.json ./
# RUN npm ci --production && npm cache clean --force
# CMD ["npm", "run", "start:staging"]