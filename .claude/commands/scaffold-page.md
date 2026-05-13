---
description: Scaffold a new Next.js App Router page with the SoftSensor layout (AppLayout wrapper, Tailwind 4, shadcn/ui new-york).
---

Scaffold a new page for the SoftSensor web app.

**Arguments:** `$ARGUMENTS`
- Expected format: a route slug like `reports`, `sensors/overview`, or `admin/users`
- If no argument is given, ask the user for the route slug before proceeding.

## Steps

1. **Derive names from the slug:**
   - Route path → `app/<slug>/page.tsx`
   - Component name → PascalCase from the last segment (e.g., `sensors/overview` → `OverviewPage`)
   - Page title → Title-case with spaces (e.g., `sensors/overview` → `Sensors Overview`)

2. **Create the file** at `app/<slug>/page.tsx` with this exact structure:

```tsx
"use client";

import { AppLayout } from "@/components/app-layout";

export default function <ComponentName>() {
  return (
    <AppLayout>
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page header */}
          <div>
            <h1 className="text-2xl font-semibold text-foreground"><Page Title></h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and monitor your <page title lowercase>.
            </p>
          </div>

          {/* Content placeholder */}
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground"><Page Title> content goes here.</p>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
```

3. **Rules to follow:**
   - Use `"use client"` directive — all pages in this project are client components
   - Use `<AppLayout>` from `@/components/app-layout` — it handles Sidebar, Header, and dialogs; never inline them manually
   - `<main>` must have `flex-1 overflow-auto` so it fills the remaining height and scrolls correctly
   - Use Tailwind 4 canonical class names: `shrink-0` not `flex-shrink-0`, `bg-linear-to-br` not `bg-gradient-to-br`
   - Use shadcn/ui components (`@/components/ui/`) for cards, buttons, tables, etc.
   - Do NOT add `useTheme()` or any theme-dependent rendering without a `mounted` guard (SSR hydration will fail)
   - Do NOT write comments explaining obvious structure

4. **After creating the file**, tell the user:
   - The created file path
   - How to navigate to it (`/slug` in the browser)
   - One sentence on what to add next (e.g., data fetching, a table, a chart)
