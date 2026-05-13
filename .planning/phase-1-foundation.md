# Phase 1 — Foundation: NestJS + PostgreSQL + Auth

## Goals

- NestJS project scaffolded with TypeScript strict mode
- PostgreSQL connected via Prisma ORM
- User registration + login with JWT (access token 15 min, refresh token 7 days)
- Workspace CRUD (create, list, get, update, delete)
- Global exception filter, validation pipe, and request logging
- Docker Compose running Postgres locally

---

## 1.1 Project Setup

```bash
# inside /backend
pnpm add -g @nestjs/cli
nest new backend --package-manager pnpm

pnpm add @nestjs/config @nestjs/jwt @nestjs/passport
pnpm add passport passport-jwt passport-local bcryptjs
pnpm add @prisma/client
pnpm add -D prisma @types/bcryptjs @types/passport-jwt @types/passport-local
```

`main.ts` bootstrap:
```typescript
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
app.useGlobalFilters(new HttpExceptionFilter());
app.enableCors({ origin: 'http://localhost:3000', credentials: true });
app.setGlobalPrefix('api/v1');
```

---

## 1.2 Docker Compose (local dev)

`backend/docker-compose.yml`:
```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: softsensor
      POSTGRES_PASSWORD: softsensor
      POSTGRES_DB: softsensor
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  influxdb:
    image: influxdb:2.7-alpine
    environment:
      DOCKER_INFLUXDB_INIT_MODE: setup
      DOCKER_INFLUXDB_INIT_USERNAME: admin
      DOCKER_INFLUXDB_INIT_PASSWORD: adminadmin
      DOCKER_INFLUXDB_INIT_ORG: softsensor
      DOCKER_INFLUXDB_INIT_BUCKET: sensor-readings
      DOCKER_INFLUXDB_INIT_ADMIN_TOKEN: my-super-secret-token
    ports:
      - "8086:8086"
    volumes:
      - influx_data:/var/lib/influxdb2

volumes:
  postgres_data:
  influx_data:
```

---

## 1.3 Prisma Schema

`prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String
  passwordHash String   @map("password_hash")
  role         UserRole @default(MEMBER)
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  ownedWorkspaces  Workspace[]       @relation("WorkspaceOwner")
  memberships      WorkspaceMember[]
  refreshTokens    RefreshToken[]

  @@map("users")
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String   @map("user_id")
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
}

model Workspace {
  id          String   @id @default(cuid())
  name        String
  description String?
  ownerId     String   @map("owner_id")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  owner       User              @relation("WorkspaceOwner", fields: [ownerId], references: [id])
  members     WorkspaceMember[]
  sensors     SensorDevice[]
  models      SoftSensorModel[]

  @@map("workspaces")
}

model WorkspaceMember {
  workspaceId String          @map("workspace_id")
  userId      String          @map("user_id")
  role        WorkspaceRole   @default(VIEWER)
  joinedAt    DateTime        @default(now()) @map("joined_at")

  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([workspaceId, userId])
  @@map("workspace_members")
}

enum UserRole {
  ADMIN
  MEMBER
}

enum WorkspaceRole {
  OWNER
  EDITOR
  VIEWER
}
```

---

## 1.4 Auth Module

**Endpoints:**
```
POST /api/v1/auth/register   → create user, return tokens
POST /api/v1/auth/login      → validate credentials, return tokens
POST /api/v1/auth/refresh    → rotate refresh token
POST /api/v1/auth/logout     → invalidate refresh token
GET  /api/v1/auth/me         → return current user (JWT guard)
```

**Token strategy:**
- Access token: `Authorization: Bearer <token>`, 15 min TTL, signed with `JWT_SECRET`
- Refresh token: stored in `HttpOnly; SameSite=Strict` cookie, 7-day TTL, one-use (rotated on use)
- Refresh tokens table in Postgres — revoked on logout or re-use detection

---

## 1.5 Workspace Module

**Endpoints:**
```
GET    /api/v1/workspaces            → list workspaces for current user
POST   /api/v1/workspaces            → create workspace (owner = current user)
GET    /api/v1/workspaces/:id        → get workspace (member check)
PATCH  /api/v1/workspaces/:id        → update (owner/editor only)
DELETE /api/v1/workspaces/:id        → delete (owner only)
POST   /api/v1/workspaces/:id/invite → invite user by email
DELETE /api/v1/workspaces/:id/members/:userId → remove member
```

**Guards:**
- `JwtAuthGuard` on all routes
- `WorkspaceMemberGuard` injects workspace membership into request; downstream services check role

---

## Phase 1 Done Criteria

- [ ] `docker-compose up` starts Postgres + InfluxDB with no errors
- [ ] `prisma migrate dev` applies schema successfully
- [ ] `POST /auth/register` → creates user, returns `access_token` + sets refresh cookie
- [ ] `POST /auth/login` → valid creds return tokens; invalid creds return 401
- [ ] `POST /auth/refresh` → rotates refresh token
- [ ] `GET /auth/me` → 401 without token, 200 with valid token
- [ ] Workspace CRUD protected; 403 on unauthorized role actions
- [ ] `pnpm test` (unit) passes for auth and workspace services
