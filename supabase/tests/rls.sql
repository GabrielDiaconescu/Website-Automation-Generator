-- Tenant isolation assertions for the FAZA 2 schema.
--
-- Every scenario runs in its own transaction and rolls back, so this file is
-- safe to run against any database that carries the demo seed — a local
-- cluster or a hosted project's staging data.
--
-- Identity is switched the way PostgREST does it: the JWT claims go on the
-- session and auth.uid() reads them. Nothing here depends on the local shim.
--
-- Any failure raises, which makes psql -v ON_ERROR_STOP=1 exit non-zero.

\set org_a '''aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'''
\set org_b '''bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'''
\set biz_a '''cccccccc-cccc-4ccc-8ccc-cccccccccccc'''
\set biz_b '''dddddddd-dddd-4ddd-8ddd-dddddddddddd'''
\set owner_a '''11111111-1111-4111-8111-111111111111'''
\set staff_a '''22222222-2222-4222-8222-222222222222'''
\set owner_b '''33333333-3333-4333-8333-333333333333'''

-- ---------------------------------------------------------------------------
-- T1 — an owner sees only their own organization
-- ---------------------------------------------------------------------------
begin;
set local request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111"}';
set local role authenticated;
do $$
declare
  seen int;
  seen_id uuid;
begin
  select count(*) into seen from public.organizations;
  if seen <> 1 then
    raise exception 'FAIL T1: owner A sees % organizations, expected 1', seen;
  end if;

  select id into seen_id from public.organizations;
  if seen_id <> 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid then
    raise exception 'FAIL T1: owner A sees the wrong organization %', seen_id;
  end if;

  raise notice 'PASS T1 organizations select is scoped to the tenant';
end
$$;
rollback;

-- ---------------------------------------------------------------------------
-- T2 — tenant data is invisible across organizations, both directions
-- ---------------------------------------------------------------------------
begin;
set local request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111"}';
set local role authenticated;
do $$
declare
  own_rows int;
  foreign_rows int;
begin
  select count(*) into own_rows
  from public.business_profiles
  where organization_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid;

  select count(*) into foreign_rows
  from public.business_profiles
  where organization_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid;

  if own_rows <> 1 then
    raise exception 'FAIL T2: owner A sees % of its own businesses, expected 1', own_rows;
  end if;
  if foreign_rows <> 0 then
    raise exception 'FAIL T2: owner A can read % rows of tenant B', foreign_rows;
  end if;

  raise notice 'PASS T2a tenant A cannot read tenant B business data';
end
$$;
rollback;

begin;
set local request.jwt.claims = '{"sub":"33333333-3333-4333-8333-333333333333"}';
set local role authenticated;
do $$
declare
  own_rows int;
  foreign_rows int;
begin
  select count(*) into own_rows
  from public.business_profiles
  where organization_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid;

  select count(*) into foreign_rows
  from public.business_profiles
  where organization_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid;

  if own_rows <> 1 then
    raise exception 'FAIL T2: owner B sees % of its own businesses, expected 1', own_rows;
  end if;
  if foreign_rows <> 0 then
    raise exception 'FAIL T2: owner B can read % rows of tenant A', foreign_rows;
  end if;

  raise notice 'PASS T2b tenant B cannot read tenant A business data';
end
$$;
rollback;

-- ---------------------------------------------------------------------------
-- T3/T4 — cross-tenant writes match no rows rather than silently succeeding
-- ---------------------------------------------------------------------------
begin;
set local request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111"}';
set local role authenticated;
do $$
declare
  touched int;
begin
  update public.business_profiles
  set name = 'hijacked'
  where id = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'::uuid;
  get diagnostics touched = row_count;
  if touched <> 0 then
    raise exception 'FAIL T3: cross-tenant update touched % rows', touched;
  end if;

  delete from public.business_profiles
  where id = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'::uuid;
  get diagnostics touched = row_count;
  if touched <> 0 then
    raise exception 'FAIL T4: cross-tenant delete touched % rows', touched;
  end if;

  raise notice 'PASS T3/T4 cross-tenant update and delete affect no rows';
end
$$;
rollback;

-- ---------------------------------------------------------------------------
-- T5 — writing into another tenant is refused outright
-- ---------------------------------------------------------------------------
begin;
set local request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111"}';
set local role authenticated;
do $$
declare
  denied boolean := false;
begin
  begin
    insert into public.business_profiles (organization_id, name)
    values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid, 'Injected by tenant A');
  exception when insufficient_privilege then
    denied := true;
  end;

  if not denied then
    raise exception 'FAIL T5: tenant A inserted a row into tenant B';
  end if;

  raise notice 'PASS T5 cross-tenant insert is refused';
end
$$;
rollback;

-- ---------------------------------------------------------------------------
-- T6/T7 — role gating inside a tenant
-- ---------------------------------------------------------------------------
begin;
set local request.jwt.claims = '{"sub":"22222222-2222-4222-8222-222222222222"}';
set local role authenticated;
do $$
declare
  denied boolean := false;
  touched int;
begin
  begin
    insert into public.business_profiles (organization_id, name)
    values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'Created by staff');
  exception when insufficient_privilege then
    denied := true;
  end;
  if not denied then
    raise exception 'FAIL T6: staff created a business profile';
  end if;

  update public.organizations
  set name = 'Renamed by staff'
  where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid;
  get diagnostics touched = row_count;
  if touched <> 0 then
    raise exception 'FAIL T7: staff renamed the organization';
  end if;

  raise notice 'PASS T6/T7 staff cannot create businesses or rename the tenant';
end
$$;
rollback;

-- ---------------------------------------------------------------------------
-- T8/T9 — membership cannot be granted into, or moved to, another tenant
-- ---------------------------------------------------------------------------
begin;
set local request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111"}';
set local role authenticated;
do $$
declare
  denied boolean := false;
begin
  begin
    insert into public.organization_members (organization_id, user_id, role)
    values (
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid,
      '11111111-1111-4111-8111-111111111111'::uuid,
      'admin'
    );
  exception when insufficient_privilege then
    denied := true;
  end;
  if not denied then
    raise exception 'FAIL T8: owner A granted itself membership in tenant B';
  end if;

  denied := false;
  begin
    update public.organization_members
    set organization_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid
    where organization_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid
      and user_id = '22222222-2222-4222-8222-222222222222'::uuid;
  exception when insufficient_privilege then
    denied := true;
  end;
  if not denied then
    raise exception 'FAIL T9: a membership row was moved into tenant B';
  end if;

  raise notice 'PASS T8/T9 membership cannot cross the tenant boundary';
end
$$;
rollback;

-- ---------------------------------------------------------------------------
-- T10 — staff cannot promote itself
-- ---------------------------------------------------------------------------
begin;
set local request.jwt.claims = '{"sub":"22222222-2222-4222-8222-222222222222"}';
set local role authenticated;
do $$
declare
  touched int;
begin
  update public.organization_members
  set role = 'owner'
  where user_id = '22222222-2222-4222-8222-222222222222'::uuid;
  get diagnostics touched = row_count;
  if touched <> 0 then
    raise exception 'FAIL T10: staff escalated its own role';
  end if;

  raise notice 'PASS T10 staff cannot escalate its own role';
end
$$;
rollback;

-- ---------------------------------------------------------------------------
-- T11 — profiles are visible to teammates only
-- ---------------------------------------------------------------------------
begin;
set local request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111"}';
set local role authenticated;
do $$
declare
  seen int;
  sees_foreign int;
begin
  select count(*) into seen from public.profiles;
  if seen <> 2 then
    raise exception 'FAIL T11: owner A sees % profiles, expected 2', seen;
  end if;

  select count(*) into sees_foreign
  from public.profiles
  where id = '33333333-3333-4333-8333-333333333333'::uuid;
  if sees_foreign <> 0 then
    raise exception 'FAIL T11: owner A can read a profile from tenant B';
  end if;

  raise notice 'PASS T11 profiles are limited to teammates';
end
$$;
rollback;

-- ---------------------------------------------------------------------------
-- T12 — anonymous callers have no access to tenant tables at all
-- ---------------------------------------------------------------------------
begin;
set local role anon;
do $$
declare
  denied boolean := false;
begin
  begin
    perform 1 from public.organizations;
  exception when insufficient_privilege then
    denied := true;
  end;
  if not denied then
    raise exception 'FAIL T12: anon can query organizations';
  end if;

  denied := false;
  begin
    perform 1 from public.business_profiles;
  exception when insufficient_privilege then
    denied := true;
  end;
  if not denied then
    raise exception 'FAIL T12: anon can query business_profiles';
  end if;

  raise notice 'PASS T12 anon is denied on every tenant table';
end
$$;
rollback;

-- ---------------------------------------------------------------------------
-- T13 — provisioning binds the creator as sole owner and is the only path in
-- ---------------------------------------------------------------------------
begin;
set local request.jwt.claims = '{"sub":"33333333-3333-4333-8333-333333333333"}';
set local role authenticated;
do $$
declare
  created public.organizations;
  owner_count int;
  denied boolean := false;
begin
  created := public.create_organization('Owner B Second Business', 'owner-b-second');

  if created.created_by <> '33333333-3333-4333-8333-333333333333'::uuid then
    raise exception 'FAIL T13: created_by is % , expected the caller', created.created_by;
  end if;

  select count(*) into owner_count
  from public.organization_members
  where organization_id = created.id
    and user_id = '33333333-3333-4333-8333-333333333333'::uuid
    and role = 'owner';

  if owner_count <> 1 then
    raise exception 'FAIL T13: creator did not become owner of the new organization';
  end if;

  -- The function returns the row, which means RETURNING passed the SELECT
  -- policy: the caller can see what it just created.
  if created.name <> 'Owner B Second Business' then
    raise exception 'FAIL T13: the new organization was not readable by its creator';
  end if;

  begin
    insert into public.organizations (name, slug, created_by)
    values ('Direct insert', 'direct-insert', '33333333-3333-4333-8333-333333333333'::uuid);
  exception when insufficient_privilege then
    denied := true;
  end;
  if not denied then
    raise exception 'FAIL T13: organizations accepted a direct insert';
  end if;

  raise notice 'PASS T13 provisioning binds the creator as sole owner and blocks direct inserts';
end
$$;
rollback;

-- ---------------------------------------------------------------------------
-- T14 — provisioning refuses an unauthenticated caller
-- ---------------------------------------------------------------------------
begin;
set local role anon;
do $$
declare
  denied boolean := false;
begin
  begin
    perform public.create_organization('Anonymous Org', 'anonymous-org');
  exception when insufficient_privilege then
    denied := true;
  end;
  if not denied then
    raise exception 'FAIL T14: anon provisioned an organization';
  end if;

  raise notice 'PASS T14 provisioning refuses unauthenticated callers';
end
$$;
rollback;

\echo 'All tenant isolation assertions passed.'
