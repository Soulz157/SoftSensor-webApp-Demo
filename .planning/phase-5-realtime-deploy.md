# Phase 5 — Realtime & Deployment

## Goals

- WebSocket gateway: push live sensor readings + alerts to connected frontend clients
- Swagger/OpenAPI docs auto-generated
- Environment-based config validated on startup
- Production Docker Compose (backend + postgres + influxdb)
- CORS, rate limiting, and security headers hardened for production
- Frontend API client wired to the NestJS backend

---

## 5.1 WebSocket Gateway

NestJS `@WebSocketGateway` backed by Socket.IO.

**Events emitted by server → client:**

| Event | Payload | When |
|-------|---------|------|
| `reading:new` | `{ sensorId, value, quality, timestamp }` | New reading ingested |
| `alert:triggered` | `{ alertId, sensorId, value, severity }` | Threshold breached |
| `alert:resolved` | `{ alertId, sensorId }` | Alert resolved |
| `model:status` | `{ modelId, status }` | Model start/stop/error |

**Client → server events:**

| Event | Payload | Effect |
|-------|---------|--------|
| `subscribe:workspace` | `{ workspaceId }` | Join workspace room |
| `unsubscribe:workspace` | `{ workspaceId }` | Leave room |

**Room strategy:** each workspace has a Socket.IO room (`workspace:{id}`). On `reading:new`, the ingestion service calls `gateway.emitToWorkspace(workspaceId, event, payload)` — only clients subscribed to that workspace receive it.

**Auth for WebSocket:** client sends JWT as `auth.token` in the handshake. Gateway `handleConnection` verifies it via `JwtService`; disconnects if invalid.

```typescript
@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URL } })
export class RealtimeGateway {
  @WebSocketServer() server: Server;

  emitReading(workspaceId: string, payload: ReadingEvent) {
    this.server.to(`workspace:${workspaceId}`).emit('reading:new', payload);
  }

  @SubscribeMessage('subscribe:workspace')
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() { workspaceId }: SubscribeDto,
  ) {
    // verify caller is a member of workspaceId, then:
    client.join(`workspace:${workspaceId}`);
  }
}
```

---

## 5.2 Swagger / OpenAPI

```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle('SoftSensor API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
const doc = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, doc);
```

Decorate all DTOs with `@ApiProperty()` and all controllers with `@ApiTags()` + `@ApiBearerAuth()`.

Docs available at `http://localhost:3001/api/docs`.

---

## 5.3 Config Validation

`src/config/env.validation.ts` using `class-validator`:
```typescript
class EnvironmentVariables {
  @IsString() @MinLength(32) JWT_SECRET: string;
  @IsUrl() DATABASE_URL: string;
  @IsUrl() INFLUX_URL: string;
  @IsString() INFLUX_TOKEN: string;
  @IsString() INFLUX_ORG: string;
  @IsUrl() FRONTEND_URL: string;
  @IsInt() @Min(1) @Max(65535) PORT: number = 3001;
}
```

NestJS will throw on startup if any required variable is missing or invalid — no silent misconfiguration in production.

---

## 5.4 Production Docker Compose

`backend/docker-compose.prod.yml`:
```yaml
services:
  backend:
    build: .
    environment:
      NODE_ENV: production
      PORT: 3001
      DATABASE_URL: ${DATABASE_URL}
      INFLUX_URL: ${INFLUX_URL}
      INFLUX_TOKEN: ${INFLUX_TOKEN}
      INFLUX_ORG: ${INFLUX_ORG}
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: ${FRONTEND_URL}
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
      influxdb:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      retries: 5

  influxdb:
    image: influxdb:2.7-alpine
    environment:
      DOCKER_INFLUXDB_INIT_MODE: setup
      DOCKER_INFLUXDB_INIT_USERNAME: ${INFLUX_ADMIN_USER}
      DOCKER_INFLUXDB_INIT_PASSWORD: ${INFLUX_ADMIN_PASSWORD}
      DOCKER_INFLUXDB_INIT_ORG: ${INFLUX_ORG}
      DOCKER_INFLUXDB_INIT_BUCKET: sensor-readings
      DOCKER_INFLUXDB_INIT_ADMIN_TOKEN: ${INFLUX_TOKEN}
    volumes:
      - influx_data:/var/lib/influxdb2
    healthcheck:
      test: ["CMD", "influx", "ping"]
      interval: 10s
      retries: 5

volumes:
  postgres_data:
  influx_data:
```

---

## 5.5 Frontend Integration

Add to the Next.js frontend (`lib/api.ts`):
```typescript
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include', // sends refresh token cookie
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) throw new ApiError(res.status, await res.json());
  return res.json() as T;
}
```

Socket.IO client hook (`hooks/use-realtime.ts`):
```typescript
export function useWorkspaceRealtime(workspaceId: string) {
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token: getAccessToken() },
    });
    socket.emit('subscribe:workspace', { workspaceId });
    socket.on('reading:new', handler);
    socket.on('alert:triggered', alertHandler);
    return () => { socket.disconnect(); };
  }, [workspaceId]);
}
```

---

## 5.6 Security Hardening

- `helmet()` — sets security headers (HSTS, CSP, X-Frame-Options)
- `@nestjs/throttler` — 100 req/min global; 10 req/min on `/auth/login` (brute-force protection)
- Refresh token rotation + reuse detection (invalidate all tokens for user on reuse)
- Passwords hashed with `bcryptjs` rounds = 12
- CORS restricted to `FRONTEND_URL` env variable only

---

## Phase 5 Done Criteria

- [ ] WebSocket: connecting frontend receives `reading:new` events within 1 s of ingestion
- [ ] WebSocket: invalid JWT on handshake → connection rejected
- [ ] Swagger UI reachable at `/api/docs`; all endpoints documented
- [ ] `docker-compose -f docker-compose.prod.yml up` starts all 3 services cleanly
- [ ] Invalid `JWT_SECRET` (< 32 chars) → server refuses to start with clear error
- [ ] Login rate limit: > 10 attempts/min returns 429
- [ ] Frontend `apiFetch` + `useWorkspaceRealtime` wired to at least one page (e.g., workspace detail)
