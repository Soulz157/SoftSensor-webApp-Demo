# Phase 2 — InfluxDB: Time-Series Ingestion & Query

## Goals

- NestJS InfluxDB module wrapping the `@influxdata/influxdb-client` SDK
- Sensor reading ingestion endpoint (single + batch)
- Basic time-range query for a sensor
- Retention policy: raw data 30 days, downsampled 1 year
- Health check endpoint confirms InfluxDB connectivity

---

## 2.1 InfluxDB Data Model

### Buckets

| Bucket | TTL | Content |
|--------|-----|---------|
| `sensor-readings` | 30 days | Raw telemetry from sensors |
| `model-outputs` | 30 days | Soft sensor prediction results |
| `aggregates` | 1 year | Downsampled hourly/daily summaries (task writes here) |

### Measurement: `reading` (bucket: `sensor-readings`)

| Field / Tag | Kind | Type | Example |
|-------------|------|------|---------|
| `sensor_id` | tag | string | `"sensor-abc123"` |
| `workspace_id` | tag | string | `"ws-xyz"` |
| `unit` | tag | string | `"°C"` |
| `value` | field | float | `72.4` |
| `quality` | field | float | `0.98` (0–1 confidence) |
| `_time` | timestamp | — | RFC3339 |

### Measurement: `prediction` (bucket: `model-outputs`)

| Field / Tag | Kind | Type |
|-------------|------|------|
| `model_id` | tag | string |
| `sensor_id` | tag | string |
| `workspace_id` | tag | string |
| `predicted_value` | field | float |
| `confidence` | field | float |
| `_time` | timestamp | — |

---

## 2.2 NestJS InfluxDB Module

```
src/
  influx/
    influx.module.ts      ← global module, exports InfluxService
    influx.service.ts     ← write + query helpers
    influx.health.ts      ← HealthIndicator for /health endpoint
```

`influx.service.ts` key methods:
```typescript
writeReadings(points: SensorReadingDto[]): Promise<void>
queryReadings(sensorId: string, start: Date, stop: Date): Promise<FluxRecord[]>
queryLatest(sensorId: string): Promise<FluxRecord | null>
queryAggregated(sensorId: string, windowPeriod: string): Promise<FluxRecord[]>
writePredictions(points: PredictionDto[]): Promise<void>
queryPredictions(modelId: string, start: Date, stop: Date): Promise<FluxRecord[]>
```

All write errors are caught and re-thrown as `ServiceUnavailableException`. Query errors propagate as `InternalServerErrorException`.

---

## 2.3 Telemetry Module (Ingestion)

**Endpoints:**
```
POST /api/v1/telemetry/ingest          → single reading
POST /api/v1/telemetry/ingest/batch    → up to 1000 readings
GET  /api/v1/telemetry/:sensorId       → time-range query (query params: start, end, limit)
GET  /api/v1/telemetry/:sensorId/latest → most recent reading
```

**Ingest DTO:**
```typescript
class SensorReadingDto {
  @IsString() sensorId: string;
  @IsNumber() value: number;
  @IsOptional() @IsNumber() @Min(0) @Max(1) quality?: number;
  @IsOptional() @IsISO8601() timestamp?: string; // defaults to server time
}
```

**Batch endpoint guards:**
- Max 1000 records per request (validated in pipe)
- All `sensorId` values must belong to the same workspace (checked against Postgres sensor registry)
- Rate limit: 100 req/min per workspace (using `@nestjs/throttler`)

---

## 2.4 Flux Queries (examples)

**Last 24 h for a sensor:**
```flux
from(bucket: "sensor-readings")
  |> range(start: -24h)
  |> filter(fn: (r) => r._measurement == "reading" and r.sensor_id == "sensor-abc123")
  |> filter(fn: (r) => r._field == "value")
  |> sort(columns: ["_time"])
```

**Hourly mean for downsampling:**
```flux
from(bucket: "sensor-readings")
  |> range(start: -7d)
  |> filter(fn: (r) => r.sensor_id == "sensor-abc123" and r._field == "value")
  |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
```

**InfluxDB Task (automated downsampling — run every hour):**
```flux
option task = { name: "hourly-downsample", every: 1h }

from(bucket: "sensor-readings")
  |> range(start: -2h)
  |> filter(fn: (r) => r._measurement == "reading" and r._field == "value")
  |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
  |> to(bucket: "aggregates", org: "softsensor")
```

---

## 2.5 .env Variables Added

```env
INFLUX_URL=http://localhost:8086
INFLUX_TOKEN=my-super-secret-token
INFLUX_ORG=softsensor
INFLUX_BUCKET_READINGS=sensor-readings
INFLUX_BUCKET_OUTPUTS=model-outputs
INFLUX_BUCKET_AGGREGATES=aggregates
```

---

## Phase 2 Done Criteria

- [ ] `GET /health` returns `{ influxdb: "up", postgres: "up" }`
- [ ] `POST /telemetry/ingest` writes a point; verify via InfluxDB UI at `localhost:8086`
- [ ] `POST /telemetry/ingest/batch` with 500 points completes < 500 ms
- [ ] Batch > 1000 records returns 400
- [ ] `GET /telemetry/:sensorId?start=2024-01-01&end=2024-01-02` returns correct records
- [ ] `GET /telemetry/:sensorId/latest` returns the most recent point
- [ ] Hourly downsample task created in InfluxDB UI
