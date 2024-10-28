# Talkie API

## Variables de entorno

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

## Desarrollo

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev -p talkie_api_dev up -d --build
```

## Produccion

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod -p talkie_api_prod up -d --build
```

## Staging

```bash
docker compose -f docker-compose.staging.yml --env-file .env.staging -p talkie_api_staging up -d --build
```

# Migraciones

1. Entrar al contenedor:

```bash
docker exec -it talkie_api_dev sh
docker exec -it talkie_api_prod sh
docker exec -it talkie_api_staging sh
```

2. Ejecutar el comando dentro del contenedor:

```bash
npm run migrations:run
```

3. (Opcional) Ejecutar Seeders

```bash
npm run cli -- seed
```

4. Salir:

```bash
exit
```

## Limpiar imagenes dangling

```bash
docker image prune -f
```

## Crear migraciones

```bash
npm run migrations:generate database/migrations/init
```
