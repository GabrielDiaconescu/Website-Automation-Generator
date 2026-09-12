-- FAZA 2 — Row level security for the tenancy core.
--
-- Rule: a member of organization A must not be able to read, write or even
-- detect anything belonging to organization B. This is enforced here, in the
-- database. Application code is not trusted to scope its own queries.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
-- A policy on organization_members that queries organization_members recurses
-- and fails at runtime. These helpers run as the definer, which bypasses RLS
-- on the lookup and breaks the cycle. `search_path = ''` forces every name to
-- be schema-qualified so the function cannot be hijacked by a caller-set path.

create or replace function public.user_organization_ids()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select organization_id
  from public.organization_members
  where user_id = (select auth.uid());
$$;

create or replace function public.has_organization_role(
  target_organization_id uuid,
  allowed_roles public.organization_role[]
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = target_organization_id
      and user_id = (select auth.uid())
      and role = any(allowed_roles)
  );
$$;

create or replace function public.shares_organization_with(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members as theirs
    join public.organization_members as mine
      on mine.organization_id = theirs.organization_id
    where theirs.user_id = target_user_id
      and mine.user_id = (select auth.uid())
  );
$$;

-- ---------------------------------------------------------------------------
-- Privileges
-- ---------------------------------------------------------------------------
-- RLS filters rows; it does not grant access. `anon` gets nothing here: public
-- generated websites will read their own published data through dedicated,
-- explicitly exposed objects, never through the tenant tables.

revoke all on public.profiles from anon, authenticated;
revoke all on public.organizations from anon, authenticated;
revoke all on public.organization_members from anon, authenticated;
revoke all on public.business_profiles from anon, authenticated;

grant select, update on public.profiles to authenticated;
-- No INSERT on organizations: creating one must also create its owner
-- membership, which only public.create_organization() does atomically.
grant select, update, delete on public.organizations to authenticated;
grant select, insert, update, delete on public.organization_members to authenticated;
grant select, insert, update, delete on public.business_profiles to authenticated;

revoke all on function public.user_organization_ids() from public, anon;
revoke all on function public.has_organization_role(uuid, public.organization_role[]) from public, anon;
revoke all on function public.shares_organization_with(uuid) from public, anon;

grant execute on function public.user_organization_ids() to authenticated;
grant execute on function public.has_organization_role(uuid, public.organization_role[]) to authenticated;
grant execute on function public.shares_organization_with(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.profiles force row level security;

create policy profiles_select_self_or_teammates
  on public.profiles for select
  to authenticated
  using (
    id = (select auth.uid())
    or public.shares_organization_with(id)
  );

create policy profiles_update_self
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- No INSERT or DELETE policy: rows follow auth.users through triggers and the
-- ON DELETE CASCADE, so the app never creates or removes them directly.

-- ---------------------------------------------------------------------------
-- organizations
-- ---------------------------------------------------------------------------
alter table public.organizations enable row level security;
alter table public.organizations force row level security;

create policy organizations_select_members
  on public.organizations for select
  to authenticated
  using (id in (select public.user_organization_ids()));

-- No INSERT policy by design. A direct insert would have to be read back with
-- RETURNING, and RETURNING is subject to the SELECT policy above — which fails,
-- because the owner membership that makes the row visible is created by an
-- AFTER INSERT trigger that has not fired yet. Organizations are created
-- through public.create_organization() instead.

create policy organizations_update_admins
  on public.organizations for update
  to authenticated
  using (
    public.has_organization_role(id, array['owner', 'admin']::public.organization_role[])
  )
  with check (
    public.has_organization_role(id, array['owner', 'admin']::public.organization_role[])
  );

create policy organizations_delete_owner
  on public.organizations for delete
  to authenticated
  using (
    public.has_organization_role(id, array['owner']::public.organization_role[])
  );

-- ---------------------------------------------------------------------------
-- organization_members
-- ---------------------------------------------------------------------------
alter table public.organization_members enable row level security;
alter table public.organization_members force row level security;

create policy organization_members_select_same_org
  on public.organization_members for select
  to authenticated
  using (organization_id in (select public.user_organization_ids()));

create policy organization_members_insert_admins
  on public.organization_members for insert
  to authenticated
  with check (
    public.has_organization_role(
      organization_id,
      array['owner', 'admin']::public.organization_role[]
    )
  );

-- Both USING and WITH CHECK are required: without WITH CHECK an admin could
-- move a row to an organization they do not administer.
create policy organization_members_update_admins
  on public.organization_members for update
  to authenticated
  using (
    public.has_organization_role(
      organization_id,
      array['owner', 'admin']::public.organization_role[]
    )
  )
  with check (
    public.has_organization_role(
      organization_id,
      array['owner', 'admin']::public.organization_role[]
    )
  );

create policy organization_members_delete_admins
  on public.organization_members for delete
  to authenticated
  using (
    public.has_organization_role(
      organization_id,
      array['owner', 'admin']::public.organization_role[]
    )
  );

-- ---------------------------------------------------------------------------
-- business_profiles
-- ---------------------------------------------------------------------------
alter table public.business_profiles enable row level security;
alter table public.business_profiles force row level security;

create policy business_profiles_select_members
  on public.business_profiles for select
  to authenticated
  using (organization_id in (select public.user_organization_ids()));

create policy business_profiles_insert_managers
  on public.business_profiles for insert
  to authenticated
  with check (
    public.has_organization_role(
      organization_id,
      array['owner', 'admin', 'manager']::public.organization_role[]
    )
  );

create policy business_profiles_update_managers
  on public.business_profiles for update
  to authenticated
  using (
    public.has_organization_role(
      organization_id,
      array['owner', 'admin', 'manager']::public.organization_role[]
    )
  )
  with check (
    public.has_organization_role(
      organization_id,
      array['owner', 'admin', 'manager']::public.organization_role[]
    )
  );

create policy business_profiles_delete_admins
  on public.business_profiles for delete
  to authenticated
  using (
    public.has_organization_role(
      organization_id,
      array['owner', 'admin']::public.organization_role[]
    )
  );
