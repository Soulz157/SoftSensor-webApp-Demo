# Phase 4 — Analytics API

## Goals

- Aggregated time-series endpoints for the frontend dashboard and analytics page
- Model prediction output queries
- Workspace-level summary stats (for dashboard cards)
- All queries backed by InfluxDB `aggregates` bucket (written by Phase 2 downsample task)
- Response shape matches the existing `app/analytics/` page structure

---

## 4.1 Analytics Module Endpoints

```
GET /api/v1/analytics/workspaces/:wid/summary
    → active models count, online sensors count, avg accuracy, alert count

GET /api/v1/analytics/workspaces/:wid/sensors/:sid/timeseries
    ?start=ISO&end=ISO&window=1h|6h|1d|7d
    → downsampled mean/min/max for a sensor

GET /api/v1/analytics/workspaces/:wid/sensors/:sid/stats
    ?start=ISO&end=ISO
    → mean, stddev, min, max, percentiles (p50, p95, p99)

GET /api/v1/analytics/workspaces/:wid/models/:mid/predictions
    ?start=ISO&end=ISO&window=1h
    → predicted_value over time with confidence band

GET /api/v1/analytics/workspaces/:wid/models/:mid/accuracy-history
    → list of { trainedAt, accuracy } from Postgres model history
```

---

## 4.2 Summary Response Shape

```json
{
  "workspace": { "id": "ws-1", "name": "Acme Corporation" },
  "stats": {
    "activeModels": 6,
    "onlineSensors": 12,
    "totalSensors": 14,
    "avgAccuracy": 93.1,
    "alertCount": 2
  }
}
```

Dashboard cards in the frontend map directly to these fields.

---

## 4.3 Time-Series Response Shape

```json
{
  "sensorId": "sensor-abc",
  "window": "1h",
  "unit": "°C",
  "series": [
    { "time": "2024-01-15T00:00:00Z", "mean": 71.2, "min": 68.1, "max": 74.5 },
    { "time": "2024-01-15T01:00:00Z", "mean": 72.4, "min": 70.0, "max": 75.1 }
  ]
}
```

---

## 4.4 Flux Query Patterns

**Summary — online sensor count** (sensors with a reading in the last 5 min):
```flux
from(bucket: "sensor-readings")
  |> range(start: -5m)
  |> filter(fn: (r) => r.workspace_id == "ws-1")
  |> keep(columns: ["sensor_id"])
  |> distinct(column: "sensor_id")
  |> count()
```

**Timeseries with windowed aggregation:**
```flux
from(bucket: "aggregates")
  |> range(start: time(v: startISO), stop: time(v: endISO))
  |> filter(fn: (r) => r.sensor_id == "sensor-abc" and r._field == "mean")
  |> aggregateWindow(every: duration(v: window), fn: mean, createEmpty: false)
  |> yield(name: "mean")
```

**Stat summary (mean, stddev):**
```flux
data = from(bucket: "sensor-readings")
  |> range(start: time(v: startISO), stop: time(v: endISO))
  |> filter(fn: (r) => r.sensor_id == "sensor-abc" and r._field == "value")

union(tables: [
  data |> mean() |> map(fn: (r) => ({r with _field: "mean"})),
  data |> stddev() |> map(fn: (r) => ({r with _field: "stddev"})),
  data |> min() |> map(fn: (r) => ({r with _field: "min"})),
  data |> max() |> map(fn: (r) => ({r with _field: "max"})),
])
```

---

## 4.5 Alert Detection (basic threshold)

Store threshold rules in Postgres:

```prisma
model AlertRule {
  id          String    @id @default(cuid())
  sensorId    String    @map("sensor_id")
  condition   String    // "gt" | "lt" | "eq"
  threshold   Float
  severity    String    @default("warning") // "warning" | "critical"
  isActive    Boolean   @default(true) @map("is_active")
  createdAt   DateTime  @default(now()) @map("created_at")

  sensor SensorDevice @relation(fields: [sensorId], references: [id])

  @@map("alert_rules")
}

model Alert {
  id         String    @id @default(cuid())
  ruleId     String    @map("rule_id")
  sensorId   String    @map("sensor_id")
  value      Float
  severity   String
  triggeredAt DateTime @map("triggered_at")
  resolvedAt  DateTime? @map("resolved_at")

  rule AlertRule @relation(fields: [ruleId], references: [id])

  @@map("alerts")
}
```

A scheduled NestJS `@Cron('*/1 * * * *')` task:
1. Loads active alert rules from Postgres
2. Queries latest reading per sensor from InfluxDB
3. Evaluates threshold — inserts `Alert` row if triggered, resolves if value returned to normal

**Alert endpoints:**
```
GET  /api/v1/workspaces/:wid/alerts          → active alerts
POST /api/v1/workspaces/:wid/alerts/:id/resolve → mark resolved
GET  /api/v1/workspaces/:wid/alert-rules     → list rules
POST /api/v1/workspaces/:wid/alert-rules     → create rule
DELETE /api/v1/workspaces/:wid/alert-rules/:id → delete rule
```

---

## Phase 4 Done Criteria

- [ ] `GET /analytics/.../summary` returns correct counts (verify against known test data)
- [ ] `GET /analytics/.../timeseries?window=1h` returns downsampled series from `aggregates` bucket
- [ ] `GET /analytics/.../stats` returns mean/stddev/min/max
- [ ] Alert rule CRUD works; cron job triggers alert on threshold breach within 1 minute
- [ ] `GET /alerts` returns only unresolved alerts for the workspace
- [ ] All queries complete < 200 ms for 7-day range (index on sensor_id tag in InfluxDB confirmed)
