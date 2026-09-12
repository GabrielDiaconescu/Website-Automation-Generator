# Website + Automation Generator

Multi-tenant SaaS platform that generates a business website, its content, lead
capture, CRM, AI assistant and follow-up automations from a single
configuration.

Product rules, architecture principles and the phased delivery plan live in
[`Website + Automation Generator/MASTER_PROMPT.md`](<Website + Automation Generator/MASTER_PROMPT.md>).
Architecture notes: [`ARCHITECTURE.md`](ARCHITECTURE.md).

**Current state: FAZA 1 — Foundation.** The app shell, design system tokens,
env validation, error handling and logging are in place. Database, auth and
every product feature land in later phases; see `deliveryPhases` in
`src/config/product.ts` for what is actually shipped.

## Requirements

- Node.js 22 or newer (`@types/node` is pinned to the 22 line)
- npm 10 or newer

## Setup

```bash
npm install
cp .env.example .env.local
```

`.env.local` needs nothing for local development — every FAZA 1 variable has a
working default. Variables for later phases are listed in `.env.example`,
commented out and grouped by the phase that introduces them.

Environment variables are validated at import time:

- `src/config/env.ts` — client-safe values (`NEXT_PUBLIC_*` only)
- `src/config/env.server.ts` — server values; guarded by `server-only`, so
  importing it from a client component is a build error

An invalid value fails fast with the offending variable names. Values are never
printed, so a bad secret cannot leak into logs or CI output.

## Commands

| Command                | What it does                                |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Development server on http://localhost:3000 |
| `npm run build`        | Production build                            |
| `npm start`            | Serve the production build                  |
| `npm run lint`         | ESLint                                      |
| `npm run typecheck`    | `tsc --noEmit`                              |
| `npm test`             | Unit tests (Vitest)                         |
| `npm run format`       | Prettier, writes                            |
| `npm run format:check` | Prettier, verify only                       |

Database, migration and seed commands arrive with FAZA 2; there is no database
in the project yet.

## Before pushing

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

## Stack

Next.js (App Router) · TypeScript strict · Tailwind CSS v4 · shadcn/ui
conventions · Zod · Vitest

`ui.shadcn.com` is not reachable from the build environment, so the shadcn CLI
cannot fetch its registry. Components follow the same conventions and live in
`src/components/ui/`; add new ones by hand against `components.json`.
