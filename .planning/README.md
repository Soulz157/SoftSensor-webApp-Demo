# Backend Architecture Plan — SoftSensor

## Stack Decision

| Layer | Technology | Role |
|-------|-----------|------|
| API Framework | NestJS (TypeScript) | REST + WebSocket server |
| Relational DB | PostgreSQL + Prisma ORM | Users, workspaces, model configs, sensor registry |
| Time-Series DB | InfluxDB v2 | Raw sensor readings, model predictions, aggregates |
| Auth | JWT (access + refresh tokens) | Stateless auth; refresh stored in HttpOnly cookie |
| Realtime | WebSocket (NestJS Gateway) | Push live sensor readings to frontend |
| Containerization | Docker Compose | Local dev; all services in one `docker-compose.yml` |

## Why Two Databases

- **PostgreSQL** — relational data that needs ACID transactions: users, workspaces, sensor device registry, model definitions, permissions.
- **InfluxDB** — append-only, tag-indexed time-series: millions of sensor readings, prediction outputs, aggregated metrics. Far faster than Postgres for range queries and downsampling.

## Monorepo Layout (target)

```
SoftSensor-webApp/           ← existing Next.js frontend
backend/                     ← new NestJS backend
  src/
    auth/
    users/
    workspaces/
    sensors/
    models/
    telemetry/               ← InfluxDB ingestion + query
    analytics/               ← aggregated analytics queries
    realtime/                ← WebSocket gateway
  prisma/
    schema.prisma
    migrations/
  test/
  docker-compose.yml
  .env.example
```

## Phases

| Phase | Focus | Est. Scope |
|-------|-------|-----------|
| [1 — Foundation](./phase-1-foundation.md) | NestJS + Postgres + Auth | Core infra, user/workspace CRUD |
| [2 — InfluxDB](./phase-2-influxdb.md) | Time-series ingestion + query | Sensor telemetry pipeline |
| [3 — Sensors & Models](./phase-3-sensors-models.md) | Sensor registry, model CRUD, linking | Domain entities |
| [4 — Analytics API](./phase-4-analytics.md) | Aggregations, dashboards, predictions | Query layer for the frontend |
| [5 — Realtime & Deploy](./phase-5-realtime-deploy.md) | WebSocket, Docker, env config | Production-ready delivery |
