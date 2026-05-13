# Phase 3 — Sensors & Soft Sensor Models

## Goals

- Sensor device registry in PostgreSQL (create, list, update, delete)
- Soft sensor model CRUD with status lifecycle (stopped → running → error)
- Many-to-many: models consume N sensor inputs, produce 1 virtual output
- Model configuration stored as JSONB (flexible per model type)
- API endpoints that match the existing frontend's data shape

---

## 3.1 Prisma Schema Additions

```prisma
model SensorDevice {
  id          String       @id @default(cuid())
  name        String
  type        String       // "temperature", "pressure", "vibration", etc.
  unit        String       // "°C", "bar", "mm/s"
  workspaceId String       @map("workspace_id")
  config      Json         @default("{}") // connection params, calibration
  isActive    Boolean      @default(true) @map("is_active")
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")

  workspace   Workspace    @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  modelInputs ModelSensor[]

  @@map("sensor_devices")
}

model SoftSensorModel {
  id             String        @id @default(cuid())
  name           String
  type           ModelType
  status         ModelStatus   @default(STOPPED)
  workspaceId    String        @map("workspace_id")
  config         Json          @default("{}") // model-specific params
  outputUnit     String        @map("output_unit")
  accuracy       Float?        // percentage, updated after training
  lastTrainedAt  DateTime?     @map("last_trained_at")
  lastRunAt      DateTime?     @map("last_run_at")
  createdAt      DateTime      @default(now()) @map("created_at")
  updatedAt      DateTime      @updatedAt @map("updated_at")

  workspace      Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  sensors        ModelSensor[]

  @@map("soft_sensor_models")
}

model ModelSensor {
  modelId   String      @map("model_id")
  sensorId  String      @map("sensor_id")
  inputRole String      @default("feature") @map("input_role") // "feature" | "target"
  order     Int         @default(0) // position in feature vector

  model     SoftSensorModel @relation(fields: [modelId], references: [id], onDelete: Cascade)
  sensor    SensorDevice    @relation(fields: [sensorId], references: [id], onDelete: Cascade)

  @@id([modelId, sensorId])
  @@map("model_sensors")
}

enum ModelType {
  REGRESSION
  TIME_SERIES
  CLASSIFICATION
  OPTIMIZATION
  SIGNAL_PROCESSING
  CONTROL
}

enum ModelStatus {
  RUNNING
  STOPPED
  ERROR
  TRAINING
}
```

---

## 3.2 Sensor Module

**Endpoints:**
```
GET    /api/v1/workspaces/:wid/sensors          → list sensors in workspace
POST   /api/v1/workspaces/:wid/sensors          → register new sensor
GET    /api/v1/workspaces/:wid/sensors/:id      → get sensor detail
PATCH  /api/v1/workspaces/:wid/sensors/:id      → update name/config
DELETE /api/v1/workspaces/:wid/sensors/:id      → deactivate (soft delete via isActive)
GET    /api/v1/workspaces/:wid/sensors/:id/status → latest reading + health from InfluxDB
```

**Create Sensor DTO:**
```typescript
class CreateSensorDto {
  @IsString() @MinLength(1) name: string;
  @IsString() type: string;
  @IsString() unit: string;
  @IsOptional() @IsObject() config?: Record<string, unknown>;
}
```

**Sensor status response** (combines Postgres + InfluxDB):
```json
{
  "id": "sensor-abc",
  "name": "Inlet Temperature",
  "type": "temperature",
  "unit": "°C",
  "isActive": true,
  "latestReading": {
    "value": 72.4,
    "quality": 0.98,
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "health": "online"
}
```
`health` = `"online"` if last reading < 5 min ago, `"stale"` if < 1 h, `"offline"` if older.

---

## 3.3 Model Module

**Endpoints:**
```
GET    /api/v1/workspaces/:wid/models           → list models
POST   /api/v1/workspaces/:wid/models           → create model
GET    /api/v1/workspaces/:wid/models/:id       → model detail + linked sensors
PATCH  /api/v1/workspaces/:wid/models/:id       → update name/config
DELETE /api/v1/workspaces/:wid/models/:id       → delete model

POST   /api/v1/workspaces/:wid/models/:id/start → status → RUNNING
POST   /api/v1/workspaces/:wid/models/:id/stop  → status → STOPPED
POST   /api/v1/workspaces/:wid/models/:id/sensors      → link sensor to model
DELETE /api/v1/workspaces/:wid/models/:id/sensors/:sid → unlink sensor
```

**Create Model DTO:**
```typescript
class CreateModelDto {
  @IsString() @MinLength(1) name: string;
  @IsEnum(ModelType) type: ModelType;
  @IsString() outputUnit: string;
  @IsOptional() @IsObject() config?: Record<string, unknown>;
  @IsOptional() @IsArray() @IsString({ each: true }) sensorIds?: string[];
}
```

**Model detail response** (matches frontend data shape in `app/models/page.tsx`):
```json
{
  "id": "model-abc",
  "name": "Temperature Predictor",
  "type": "REGRESSION",
  "status": "RUNNING",
  "accuracy": 94.2,
  "outputUnit": "°C",
  "lastTrainedAt": "2 days ago",
  "lastRunAt": "2 min ago",
  "workspace": { "id": "ws-1", "name": "Acme Corporation" },
  "sensors": [
    { "id": "sensor-1", "name": "Inlet Temp", "inputRole": "feature" }
  ]
}
```

---

## 3.4 Response Formatting

The frontend uses human-readable relative times (`"2 days ago"`, `"Just now"`). Two options:
1. Return ISO timestamps from API; let the frontend format with `date-fns` or `Intl.RelativeTimeFormat`
2. Format in the API response transformer

**Recommended: return ISO timestamps from API.** Add a frontend utility `formatRelative(isoString)` in `lib/utils.ts`.

---

## Phase 3 Done Criteria

- [ ] Sensor CRUD: create, list, update, soft-delete all work
- [ ] `GET /sensors/:id/status` returns `latestReading` from InfluxDB + computed `health`
- [ ] Model CRUD + start/stop status transitions work
- [ ] Linking / unlinking sensors to a model persists in `model_sensors` table
- [ ] `GET /models/:id` returns full sensor list via join
- [ ] 404 on cross-workspace access (sensor in workspace A, model in workspace B)
- [ ] All endpoints return 403 if caller is not a workspace member
