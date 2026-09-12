# Database

PostgreSQL on Supabase. Schema, policies and seed live in `supabase/`;
migrations are the only way the schema changes (rule 55).

```
supabase/
  migrations/   Applied in filename order, never edited once deployed
  seed.sql      Demo data for local development
  tests/        RLS assertions and the local auth shim
```

## The tenant boundary

```
auth.users → profiles
             organizations
             └── organization_members (role: owner | admin | manager | staff | viewer)
             └── business_profiles
```

`organizations` is the tenant. Every tenant-scoped table carries
`organization_id` and cascades from it. A user reaches data only through an
`organization_members` row — there is no other path.

Defaults are Romanian-market (`Europe/Bucharest`, `RON`, `ro`) but they are
per-organization columns. No business logic may assume them (rules 180, 181).

## How isolation is enforced

RLS is enabled **and forced** on every tenant table, so even the table owner is
subject to policies. `anon` holds no privilege on any of them: public generated
websites will read their own published data through dedicated objects, never
through tenant tables.

Policies never query `organization_members` directly — a policy on that table
that reads that table recurses and fails at runtime. Three `security definer`
helpers do the lookup instead, each with `search_path = ''` so no caller can
redirect the names they resolve:

| Helper                                | Answers                                     |
| ------------------------------------- | ------------------------------------------- |
| `user_organization_ids()`             | which tenants the caller belongs to         |
| `has_organization_role(org, roles[])` | whether the caller holds one of these roles |
| `shares_organization_with(user)`      | whether the caller is that user's teammate  |

Write policies set both `USING` and `WITH CHECK`. Without `WITH CHECK` an admin
could move a row into an organization they do not administer — `USING` only
gates which rows they may touch, not what those rows may become.

## Creating an organization

Through `public.create_organization(name, slug, …)` only. `authenticated` has
no `INSERT` privilege on `organizations`.

Two reasons. First, the organization and its owner membership must appear
together: an organization with no owner cannot be administered by anyone.
Second, a direct insert cannot read its own row back — `RETURNING` is subject to
the `SELECT` policy, which passes only once the owner membership exists, and
that membership is created by an `AFTER INSERT` trigger that has not fired yet.
`supabase-js`'s `.insert().select()` would fail on exactly this.

The function takes no `created_by`: it binds the row to `auth.uid()`, so
impersonation is not expressible through the interface. It runs as the definer
and therefore bypasses RLS, which is why it checks authentication itself
(rule 152).

## Verifying isolation

```bash
npm run db:test                        # throwaway local PostgreSQL cluster
TEST_DATABASE_URL=postgres://… npm run db:test
```

Applies the migrations and seed, then runs `supabase/tests/rls.sql`: 14
assertions covering cross-tenant reads, writes, deletes, membership tampering,
role escalation, anonymous access and provisioning.

The assertions switch identity the way PostgREST does — JWT claims on the
session, read by `auth.uid()` — so the same file runs against a hosted Supabase
project. `supabase/tests/00_local_auth_shim.sql` recreates the minimum auth
surface for a plain PostgreSQL cluster and is skipped automatically when
`auth.uid()` already exists. **Never apply the shim to a Supabase project.**

## Applying to a Supabase project

Once the project exists:

1. Put its credentials in `.env.local` (see `.env.example`).
2. Apply `supabase/migrations/*.sql` in filename order, then `supabase/seed.sql`
   if demo data is wanted. Either through the Supabase SQL editor or
   `supabase db push` with the CLI linked to the project.
3. Run `TEST_DATABASE_URL=… npm run db:test` against a staging database to
   confirm the policies behave there as they do locally.

Never edit a production database by hand (rule 55). Never put the service role
key anywhere the browser can reach it — it bypasses RLS entirely (rule 148).

## Known gaps

- **Nothing protects the last owner.** An admin can delete the owner's
  membership and leave the organization unadministrable. The fix belongs with
  member management in FAZA 4, where the interaction with account deletion
  (a user cascade must still be allowed to remove their membership) can be
  handled properly rather than guessed at now.
- **No generated TypeScript types yet.** They come from the live project
  (`supabase gen types`), so they land when credentials do.
