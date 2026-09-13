# Architecture

Decisions and conventions for this codebase. The product rules they implement
are in [`Website + Automation Generator/MASTER_PROMPT.md`](<Website + Automation Generator/MASTER_PROMPT.md>);
rule numbers below refer to its sections.

## Shape of the system

A modular monolith on Next.js (rule 75). One deployment serves two distinct
surfaces that must stay conceptually separate (rule 66):

- **Platform dashboard** — authenticated, tenant-scoped, desktop-first.
- **Generated websites** — public, lightweight, SSR/SSG, one configuration per
  business.

Generated sites are not generated code. A site is a configuration object
rendered by a shared template engine and component library (rule 2). Adding a
business type, template or feature means registering data, not editing the
engine.

## Folder structure

The target layout (rule 76). Directories appear as the phase that needs them
lands, so the tree below is larger than what is on disk today:

```
src/
  app/            Routes, layouts, error and loading boundaries
  components/     Shared UI
    ui/           Design system primitives (shadcn conventions)
  features/       Feature modules: auth, organizations, websites, templates,
                  builder, crm, ai, whatsapp, calendar, automation, billing,
                  analytics
  lib/            Cross-cutting building blocks
    validation/   Zod schemas and parsers
    db/ auth/ ai/ integrations/ security/
  server/         Server-only entry points
  config/         Typed configuration and environment
  registry/       Business type, template and feature registries
  hooks/ types/ utils/
```

Business logic does not live in components. It belongs in a service layer
(`LeadService`, `AppointmentService`, …) that routes and server actions call
(rule 77).

## Environment and secrets

Two modules, one boundary (rules 36, 80):

| Module                     | Holds                    | Guard                                      |
| -------------------------- | ------------------------ | ------------------------------------------ |
| `src/config/env.ts`        | `NEXT_PUBLIC_*` only     | Safe to import anywhere                    |
| `src/config/env.server.ts` | Everything else, secrets | `server-only`; client import = build error |

Both parse through `parseEnv` (`src/lib/validation/parse-env.ts`), which throws
on the first invalid variable and reports names only — never values, so a
malformed secret cannot end up in a log or a CI transcript.

`NEXT_PUBLIC_*` variables are read as static property accesses, because that is
the only form Next.js inlines at build time.

## Errors

`src/lib/errors.ts` defines `AppError`: a code (`not_found`, `forbidden`,
`rate_limited`, …) mapped to an HTTP status and a user-facing message.

The split that matters (rules 37, 159): `message` and `context` are for logs,
`userMessage` is the only thing rendered. `toAppError` collapses anything
unknown into `internal_error`, so an upstream message can never reach a user by
accident.

Route-level boundaries live in `src/app/`: `error.tsx`, `global-error.tsx`,
`not-found.tsx`, `loading.tsx`. In production the server strips error detail
before it reaches the client and leaves only `digest`, which the boundaries
surface as the request ID a user can quote in a support request.

## Logging

`src/lib/logger.ts` emits one JSON object per line (rule 157) with level, event
name and timestamp. `child()` binds context such as `organizationId` once so
every downstream record carries it.

Redaction is deny-by-default on the key name: anything ending in `key`, plus
password, secret, token, authorization, cookie, session, credential and
signature, is replaced with `[redacted]`. Over-redacting a log line costs
nothing; one unlisted credential name costs a leaked secret.

## Registries

`src/registry/` holds the configuration backbone: business types, features and
(later) templates. They share one typed `createRegistry` factory. Registration
happens at module load, and a duplicate id throws rather than shadowing the
first entry — it is a programming error, not a runtime condition.

Ids are string-literal unions, so a typo in a feature list is a compile error
rather than a silently dropped capability. Adding an entry means adding a
definition and one union member; no engine code changes (rules 44-46).

Features declare dependencies. `resolveDependencies` expands a selection over
that graph and reports what it added and why, which is what lets the
configurator say "AI on WhatsApp requires WhatsApp" instead of silently
enabling something the user did not tick (rule 97). It takes the graph as a
function rather than reaching for a registry, so it is exercised against
synthetic graphs — cycles included, where the visited set makes it terminate.

Business types carry a recommended feature set that is deliberately _not_
dependency-complete: recommendations say what the trade needs, and resolution
fills in the plumbing (rules 40, 94, 98).

## Validation

Zod is the standard for every external input (rule 69): forms, query params,
request bodies, webhooks, OAuth callbacks and AI output. AI output in
particular is untrusted input and is validated before it is stored or rendered
(rule 150).

## Type safety

TypeScript strict, plus `noUncheckedIndexedAccess`, `noUnusedLocals`,
`noUnusedParameters` and `noFallthroughCasesInSwitch`. `any` is not used; reach
for `unknown` and validate (rule 60).

## Design system

Tailwind v4 with the theme exposed as CSS custom properties in
`src/app/globals.css` and mapped through `@theme inline`. Components consume
semantic tokens (`bg-background`, `text-muted-foreground`), never raw colors,
which is what will let per-tenant themes swap the palette without touching
components (rule 17).

Primitives follow shadcn/ui conventions and are owned by this repo in
`src/components/ui/`. `ui.shadcn.com` is blocked by the environment's network
policy, so the CLI cannot install them; they are added by hand against
`components.json`.

## Testing

Vitest for unit tests, colocated as `*.test.ts` next to the code. FAZA 1 covers
env parsing, error normalization and log redaction — the pieces every later
phase builds on. Integration and E2E layers arrive in their own phases (rule
58).

`vitest.config.mts` aliases `server-only` to its no-op build, matching how the
Next.js server resolves it through the `react-server` export condition.
