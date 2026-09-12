-- FAZA 2 — Tenancy core.
--
-- Every tenant-scoped table in this product hangs off `organizations` and
-- carries `organization_id`. Isolation is enforced in the database (RLS, next
-- migration), never in the client.

create type public.organization_role as enum (
  'owner',
  'admin',
  'manager',
  'staff',
  'viewer'
);

-- Sets updated_at on every UPDATE so callers cannot forget or spoof it.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles — application-visible mirror of auth.users
-- ---------------------------------------------------------------------------
-- auth.users is owned by Supabase Auth and is not queryable under RLS from the
-- app, so display data lives here and is keyed by the same id.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_full_name_length check (
    full_name is null or char_length(full_name) between 1 and 200
  )
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- A profile row must exist for every auth user; creating it in the app would
-- leave a window where a signed-in user has no profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- organizations — the tenant boundary
-- ---------------------------------------------------------------------------
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  -- Also the subdomain label, so it is constrained to what DNS accepts.
  slug text not null unique,
  -- Defaults target the Romanian market; both are per-organization settings
  -- and no business logic may assume them.
  timezone text not null default 'Europe/Bucharest',
  currency text not null default 'RON',
  locale text not null default 'ro',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organizations_name_length check (char_length(name) between 1 and 200),
  constraint organizations_slug_format check (slug ~ '^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$'),
  constraint organizations_currency_format check (currency ~ '^[A-Z]{3}$'),
  constraint organizations_locale_format check (locale ~ '^[a-z]{2}(-[A-Z]{2})?$')
);

create trigger organizations_set_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- organization_members — who may act inside a tenant, and as what
-- ---------------------------------------------------------------------------
create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.organization_role not null default 'staff',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index organization_members_user_id_idx
  on public.organization_members (user_id);

-- Exactly one owner per organization, so billing and account responsibility
-- always have an unambiguous holder. Transferring ownership means demoting the
-- current owner before promoting the next one.
create unique index organization_members_single_owner_idx
  on public.organization_members (organization_id)
  where role = 'owner';

create trigger organization_members_set_updated_at
  before update on public.organization_members
  for each row execute function public.set_updated_at();

-- The creator must become the owner in the same transaction, otherwise the
-- INSERT policy on organizations would let someone create a tenant they have
-- no membership in — an orphaned, unreachable organization.
create or replace function public.handle_new_organization()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.created_by is not null then
    insert into public.organization_members (organization_id, user_id, role)
    values (new.id, new.created_by, 'owner')
    on conflict (organization_id, user_id) do nothing;
  end if;
  return new;
end;
$$;

create trigger on_organization_created
  after insert on public.organizations
  for each row execute function public.handle_new_organization();

-- ---------------------------------------------------------------------------
-- business_profiles — the business a generated website represents
-- ---------------------------------------------------------------------------
create table public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  description text,
  phone text,
  email text,
  address text,
  city text,
  country text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint business_profiles_name_length check (char_length(name) between 1 and 200),
  constraint business_profiles_email_format check (
    email is null or email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  ),
  constraint business_profiles_country_format check (
    country is null or country ~ '^[A-Z]{2}$'
  )
);

create index business_profiles_organization_id_idx
  on public.business_profiles (organization_id);

create trigger business_profiles_set_updated_at
  before update on public.business_profiles
  for each row execute function public.set_updated_at();
