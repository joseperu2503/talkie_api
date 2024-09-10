# Talkie API

## Installation

### Variables de entorno

```bash
cp .env.example .env
```

```bash
nano .env
```

## Para desarrollo

```bash
docker compose -f docker-compose.yml up -d
```

```bash
docker compose -f docker-compose.yml up -d --build
```

## Para produccion

```bash
docker compose -f docker-compose.prod.yml up -d
```

para detectar cambios en el codigo fuente, como cuando se baja cambios remotos:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

# Migraciones

1. Entrar al contenedor:

```bash
docker exec -it talkie_api sh
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
