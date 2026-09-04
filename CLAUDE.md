# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # dev server (Turbopack)
npm run build    # production build — also runs the TypeScript check
npm run lint     # eslint (flat config, no args — lints the project)
npm start        # serve the production build
```

- `npm run build` is the typecheck. There is no separate `tsc --noEmit` script.
- To lint a subset: `npx eslint src/components/ui/foo.tsx`
- **There is no test suite** — no test runner, no test files, no `test` script. Verify changes with `npm run build`, `npm run lint`, and by exercising the running app.

## Language conventions

UI strings, code comments, and commit messages in this repo are written in **Azerbaijani**. Match that when adding code.

## Architecture

### Next.js 16 middleware is `src/proxy.ts`

Middleware was renamed to `proxy.ts` in this Next version. It guards `/admin/*` and redirects unauthenticated users to `/admin/login`.

**It does not guard `/api/*`.** Any API route that requires an admin must check auth itself — see `src/app/api/campaigns/send/route.ts` for the pattern.

### Three Supabase clients — choose deliberately

| Import | Key | Use for |
| --- | --- | --- |
| `supabase` from `@/lib/supabase` | anon, browser cookies | client components; admin CRUD. Constrained by RLS. |
| `createServerSupabaseClient()` from `@/lib/supabase` | **service role — bypasses RLS** | data access in server components and API routes |
| `createSupabaseServerClient()` from `@/lib/supabase-server` | anon, request cookies | reading the logged-in user (auth checks only) |

`SUPABASE_SERVICE_ROLE_KEY` must never gain a `NEXT_PUBLIC_` prefix.

### Read/write split

- **Reads:** server components using the service-role client.
- **Admin writes:** straight from the browser with the anon key, relying on `authenticated` RLS policies in the migrations.
- **Public writes:** never from the browser. They go through API routes (`/api/contact`, `/api/subscribe`, `/api/track`) which validate input (`src/lib/validation.ts`), rate-limit (`src/lib/rate-limit.ts`), then write with the service role. Migration `13` removes the anon `INSERT` policies these routes replaced.

`src/lib/rate-limit.ts` keeps counters in process memory — on serverless each instance counts separately, so the effective limit multiplies by instance count.

### Migrations are applied by hand

`src/lib/sql/NN_*.sql` are run manually in the Supabase SQL Editor in numeric order. There is no migration runner and no Supabase CLI wiring, so **the deployed schema can lag behind the repo.**

Because of that, code must degrade gracefully when a table is missing:

- Detect it with `isMissingTableError()` from `@/lib/supabase-errors` (matches PostgREST `PGRST205`, `"schema cache"`, and `relation ... does not exist`).
- Do **not** `console.error` for that case — in dev, Next renders it as a full-screen error overlay and the page looks broken. Surface an in-UI setup notice instead (`src/app/admin/suallar/` shows the pattern).

Related fallback: `FAQSection` falls back to hardcoded content, and page routes render empty states rather than throwing.

### i18n: Azerbaijani + Russian only

`Language = "az" | "ru"` — there is no English, despite some unused `_en` columns elsewhere in the schema.

- `useLanguage()` returns `{ lang, setLang, toggleLang, t }`.
- Translations are flat string keys in `src/lib/i18n/translations.ts`. `TranslationKey` is derived from the `az` block, so **every new key must be added to `az`**; `t()` falls back `ru → az → key`.
- Localized DB content uses a `_ru` column alongside the base column (`title` / `title_ru`, `question` / `question_ru`, …). The convention everywhere is: use `_ru` when `lang === "ru"` and the value is non-blank, otherwise fall back to the base Azerbaijani column.

### Theming

- CSS custom properties in `src/app/globals.css`: `:root` holds light values, `.dark` overrides them. `@theme inline` maps them onto Tailwind color tokens.
- `next-themes` with `attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}`. Tailwind 4 needs the dark variant declared explicitly — `@custom-variant dark (&:where(.dark, .dark *))`.
- Style with the variables (`bg-[var(--card)]`, `text-[var(--muted)]`, the `gradient-text` utility) rather than hardcoded palette colors, so components follow the theme.
- Keyframes and multi-step animations belong in `globals.css`, not injected at runtime via `document.createElement("style")`.

### Optional integrations degrade, they don't crash

`RESEND_API_KEY` + `EMAIL_FROM` power `/api/campaigns/send`. Missing keys return 503 from that route while the rest of the site works. `.env.example` documents every variable.
