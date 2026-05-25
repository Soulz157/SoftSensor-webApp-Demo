# Status Indicators & Models Dashboard Redesign

**Date:** 2026-05-24
**Scope:** `app/workspace/[id]/page.tsx`, `app/models/page.tsx`

## Summary

Three iterative changes landed in one session:

1. Per-model status dots on workspace canvas nodes.
2. Node card layout refactor for readability.
3. Models dashboard redesign with 4-state status, KPI panels, and a Status Details column.

## 1. Per-Model Status Dots — `app/workspace/[id]/page.tsx`

### Problem

Each node on the workspace canvas has 0–N attached AI models, but only an aggregate `node.status` dot was visible. No way to see model health at a glance — required clicking into the side panel.

### Changes

- Extended `Node.models[].status` type: `"running" | "warning" | "error" | "stopped"` (added `warning`).
- Added `getModelStatusColor()` helper mirroring `getStatusColor()` palette:
  - `running` → `bg-emerald-500`
  - `warning` → `bg-amber-500`
  - `error` → `bg-red-500`
  - `stopped` → `bg-zinc-500`
- Render one small dot per model (`h-2 w-2 rounded-full ring-1 ring-card`) inside the node card footer.
- Updated fixture: flipped `n1 → Vibration Analyzer` to `warning` so all 4 colors appear on canvas 1.

## 2. Node Card Layout Refactor — `app/workspace/[id]/page.tsx`

### Problem

Both the large `node.status` dot and the row of small model dots clustered at the top-right corner — visually crowded.

### New Layout

Vertical stack inside the node card:

1. **Icon row** — centered icon container with large `node.status` dot overlapping top-right (unchanged behavior).
2. **Title row** — `text-xs font-bold text-foreground max-w-32 truncate`.
3. **Footer row** — `w-full flex items-center justify-between gap-2`:
   - Left: `N model(s)` in `text-[10px] text-muted-foreground`
   - Right: model status dots in `flex items-center gap-1`

### Card Spec

`flex flex-col items-center gap-2 p-3 rounded-lg min-w-35 bg-card border border-border shadow-lg`. `min-w-35` uses canonical Tailwind 4 token (was `min-w-[140px]`).

Empty `models[]` → footer row omitted.

## 3. Models Dashboard Redesign — `app/models/page.tsx`

### Problem

Old dashboard had 4 generic stat cards (Total / Running / Stopped / Errors) and a 7-column table. No way to surface *why* a model was degraded.

### Status Model

Renamed `stopped → offline`, added `warning`. Added optional `statusDetails?: string`.

Final type:

```ts
interface Model {
  id: string;
  name: string;
  workspace: string;
  workspaceId: string;
  status: "running" | "warning" | "error" | "offline";
  statusDetails?: string;
  accuracy: string;
  lastTrained: string;
  lastRun: string;
  type: string;
}
```

### Color Palette (reuses workspace canvas tokens)

| Status  | Color       | Icon            |
|---------|-------------|-----------------|
| running | emerald-500 | CheckCircle2    |
| warning | amber-300   | AlertTriangle   |
| error   | amber-500   | AlertTriangle   |
| offline | zinc-500    | XCircle         |

### Fixture Redistribution (12 total)

| Status   | Count | Models                                                                          |
|----------|-------|---------------------------------------------------------------------------------|
| running  | 8     | Temperature Predictor, Demand Forecaster, Quality Classifier, Vibration Analyzer, Load Balancer AI, Cooling Optimizer, Traffic Analyzer, Compression AI |
| warning  | 2     | Energy Optimizer (`Production: High Latency alert`), Data Classifier (`Production: Data drift detected`) |
| error    | 1     | Anomaly Detector (`Deployment: Failed (missing input assets)`)                  |
| offline  | 1     | Maintenance Predictor                                                            |

### Layout

- **Header**: `Models` h1 + `□ 12 models` inline chip (`bg-primary/10 ring-1 ring-primary/20`) + description + blue `+ Import Model` button.
- **4 KPI panels** (Running / Error / Warning / Offline):
  - Large 3xl status count, status-colored.
  - Icon with `drop-shadow-[0_0_8px_currentColor]` glow.
  - Sub-text on Error (`Deployment failures (e.g., missing dependencies)`) and Warning (`Production issues (e.g., latency, data drift)`).
  - Clickable → applies status filter.
- **Filters**: search + status dropdown (All / Running / Warning / Error / Offline) + workspace dropdown.
- **Table** (9 cols): Model / Workspace / Type / Status / **Status Details** / Accuracy / Last Trained / Last Run / Actions.
  - Status Details cell: amber-500 for error, amber-300 for warning, `—` otherwise.

## Verification

- `pnpm lint` clean across all edits.
- `pnpm dev` → `/workspace/1` shows redesigned node cards with model dots; `/models` shows new dashboard.

## Files Touched

- `app/workspace/[id]/page.tsx`
- `app/models/page.tsx`
