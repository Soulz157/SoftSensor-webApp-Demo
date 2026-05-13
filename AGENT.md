# AGENT.md — SoftSensor Project Rules

This document outlines **"what to do"** and **"what never to do"** for any AI agent working in this repository. (Read `CLAUDE.md` for commands and architecture overview.)

## 1. Before You Start

* **When in Doubt, Ask First:** If you are unsure about a requirement, lack information, or are uncertain about the best approach, **you must outline a plan and ask the user for confirmation before making any changes.** Do not guess or make assumptions.
* **Check the Code:** Always run `pnpm lint` before touching any code. Fix existing errors before introducing new ones.
* **Shadcn UI:**
  * **Never modify** files in `components/ui/**` directly. Treat them as third-party code.
  * To add a new component, use `pnpm dlx shadcn@latest add <component>` — never write them by hand.
* **Backend Planning:** Always check the `.planning/` folder before adding backend features. These plans define module structures, database boundaries, and API shapes.

---

## 2. Frontend (Next.js / React)

* **Component Size:** If a component becomes too large, deeply nested, or overly complex, break it down into smaller, manageable, and reusable sub-components.
* **Required Directives:** Always put `"use client"` at the top of any file that uses hooks, event handlers, or browser APIs.
* **Layout:** Every new page must use `<AppLayout>` from `@/components/app-layout` (It handles the Sidebar, Header, and global dialogs). Never inject `<Sidebar>` + `<Header>` manually.
* **Hydration:**
  * **Never render** the value from `useTheme()` without a `mounted` guard (e.g., `mounted && theme === 'dark'`).
  * Do not remove `suppressHydrationWarning` from the `<html>` tag.
* **Tailwind CSS 4:**
  * Use canonical Tailwind 4 class names only (e.g., use `shrink-0` instead of `flex-shrink-0`, `bg-linear-to-br` instead of `bg-gradient-to-br`).
  * Use CSS variables defined in `app/globals.css` for colors (e.g., `bg-primary`). **Never hardcode hex or oklch values.**
  * Always use the `@/` path alias. Never use relative imports like `../../`.
* **Overflow Management:** Any scrollable content area inside a `flex-col` parent must include `<main className="flex-1 overflow-auto ...">` to prevent layout breaking or content clipping.

---

## 3. Backend (NestJS)

* **Module Structure:** One folder per domain (e.g., `auth/`, `sensors/`). Do not mix unrelated concerns in a single module.
* **Database Boundaries (Strict Rule):**

| Data Type | Target Database |
| :--- | :--- |
| Users, Workspaces, Model configs, Sensor registry, Alert rules | **PostgreSQL (via Prisma)** |
| Raw sensor readings, Model predictions, Time-series aggregations | **InfluxDB (via InfluxService)** |

* **DTOs & Validation:** All Request DTOs must use `class-validator` decorators. Never trust raw request body shapes.
* **Auth & Security:**
  * Always apply `JwtAuthGuard` and `WorkspaceMemberGuard` for restricted routes.
  * Store refresh tokens in `HttpOnly; SameSite=Strict` cookies. Never expose them in the JSON response body.
* **InfluxDB Queries:** All Flux queries must live inside `InfluxService` methods. **Never** write inline Flux strings inside a Controller.
* **Error Handling:** Use built-in NestJS HTTP exceptions. Never expose internal errors (e.g., stack traces, Prisma error codes) to clients in production.

---

## 4. TypeScript & Code Style

* **TypeScript:**
  * Write correctly typed code (even though `ignoreBuildErrors: true` allows builds to pass).
  * **No `any`.** Use `unknown` with type guards instead.
  * Use `interface` (not `type`) for object shapes.
  * Avoid using `!` (non-null assertions).
* **Comments:** Only comment to explain **"WHY"** something is done (e.g., hidden constraints). Let the variable/function names explain "WHAT" the code does.
* **Clean Code:**
  * No `console.log`, `debugger`, or emojis in committed code.
  * Delete unused code cleanly. Do not leave commented-out code, backward-compatibility shims, or `_unused` variable prefixes.
* **Abstraction:** Do not generalize code prematurely. Wait until a pattern repeats at least 3 times before abstracting it.

---

## 5. Security & Git

* **Security:**
  * **Never commit** `.env` files or any files containing secrets/tokens.
  * Never run destructive bash commands (e.g., `rm -rf`, `git push --force`, `DROP TABLE`) without explicit user confirmation.
  * Do not construct raw SQL strings with user input (let Prisma handle it).
* **Git:**
  * Use Conventional Commits formatting (e.g., `feat: ...`, `fix: ...`, `chore: ...`).
  * Always fix lint errors before committing. **Never** bypass hooks with `--no-verify`.
  * Stage specific files (`git add <file>`) instead of using `git add -A` blindly.

---

## 6. Hooks & Skills

* **Automated Hooks (`.claude/hooks/`):**
  * `pre-bash.sh`: Blocks dangerous commands (requires user confirmation).
  * `post-edit.sh`: Automatically runs `eslint --fix` on modified TS/TSX files.
  * `on-stop.sh`: Logs session history.
  * `on-notification.sh`: Triggers desktop notifications when tasks finish.
* **Skills:** Use `/scaffold-page <route-slug>` to instantly generate a new page with `<AppLayout>` and correct boilerplate.

---

## 🚫 The Absolute "Never Do" Summary

* Never guess or make assumptions if yo are unsure; always outline a plan and ask the uuser first.
* Never edit `components/ui/**` directly.
* Never use Tailwind 3 class names.
* Never render `useTheme()` without a `mounted` guard.
* Never manually inline `<Sidebar>` + `<Header>` (use `<AppLayout>`).
* Never store time-series data in PostgreSQL.
* Never write Flux queries outside of `InfluxService`.
* Never use the `any` type or leave `console.log` in code.
* Never commit `.env` files or skip `pnpm lint`.
