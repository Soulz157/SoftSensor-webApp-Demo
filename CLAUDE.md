# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # start dev server at localhost:3000
pnpm build      # production build (TS errors ignored — see next.config.mjs)
pnpm lint       # eslint
```

No test suite exists. `typescript.ignoreBuildErrors: true` in `next.config.mjs` — build succeeds even with TS errors.

## Architecture

**Stack:** Next.js 16 App Router, React 19, Tailwind CSS 4, shadcn/ui (new-york style), lucide-react icons, next-themes for dark/light mode.

**Layout pattern:** Most pages do NOT use `AppLayout`. Instead, each page component (`app/page.tsx`, `app/models/page.tsx`, `app/analytics/page.tsx`, etc.) independently renders `<Sidebar>` + `<Header>` + content and manages sidebar state locally. `components/app-layout.tsx` exists but is not currently used by any route — it was built as a reusable shell but pages inline the layout directly.

`app/workspace/[id]/page.tsx` is the most complex page — it has a full canvas with zoomable/pannable node graph, a Build Mode for drag-repositioning nodes, and a side panel for node detail views.

**Theme:** `app/layout.tsx` wraps everything in `<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>`. Theme state comes from `next-themes` — use `useTheme()` hook. `<html>` has `suppressHydrationWarning` required by next-themes.

**Component library:** `components/ui/` contains shadcn primitives — treat as third-party, edit sparingly. Custom app components live directly in `components/` (sidebar, header, app-layout, dashboard-content, dialogs).

**CSS variables:** Design tokens live in `app/globals.css` as CSS variables (`--sidebar`, `--sidebar-foreground`, `--primary`, etc.). Tailwind classes reference these via `bg-sidebar`, `text-sidebar-foreground`, `bg-primary`, etc.

**Tailwind 4 class names:** Use canonical Tailwind 4 names — `shrink-0` (not `flex-shrink-0`), `bg-linear-to-br` (not `bg-gradient-to-br`).

**Path alias:** `@/` maps to repo root (configured in `tsconfig.json`).

**shadcn config:** `components.json` — style `new-york`, base color `neutral`, icon library `lucide`. Add new components with `pnpm dlx shadcn@latest add <component>`.
