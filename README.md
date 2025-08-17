# Talkie API

## Installation

### Environments

```bash
cp .env.example .env.dev
cp .env.example .env.prod
cp .env.example .env.staging
```

```bash
nano .env.dev
nano .env.prod
nano .env.staging
```

## Start all services in development mode with Docker:

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev -p talkie_api_dev up --build
```

## Run the API in detached, production-ready mode:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod -p talkie_api_prod up -d --build
```

## Run the API in detached, staging-ready mode:

```bash
docker compose -f docker-compose.staging.yml --env-file .env.staging -p talkie_api_staging up -d --build
```

## Running Migrations

1. Enter the running container:

```bash
docker exec -it talkie_api_dev sh
docker exec -it talkie_api_prod sh
docker exec -it talkie_api_staging sh
```

2. Execute pending migrations:

```bash
npm run migrations:run
```

3. Seed the database inside the container:

```bash
npm run cli -- seed
npm run cli:prod -- seed
```

4. Exit the container:

```bash
exit
```

## Generating Migrations

```bash
npm run migrations:generate database/migrations/<MigrationName>
```

Example:

```bash
npm run migrations:generate database/migrations/create-places-table
```

## Configuracion Ngnix

server {
    server_name talkie-api.joseperezgil.com www.talkie-api.joseperezgil.com;
    location / {
        proxy_pass http://localhost:3007;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
