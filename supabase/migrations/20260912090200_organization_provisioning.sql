-- FAZA 2 — Organization provisioning.
--
-- Creating an organization and creating its owner membership must happen
-- together: an organization with no owner cannot be administered by anyone,
-- and a direct INSERT cannot read its own row back (the SELECT policy only
-- passes once the membership exists). This function is the single supported
-- path, and `authenticated` has no INSERT privilege on organizations.

create or replace function public.create_organization(
  organization_name text,
  organization_slug text,
  organization_timezone text default 'Europe/Bucharest',
  organization_currency text default 'RON',
  organization_locale text default 'ro'
)
returns public.organizations
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller uuid := (select auth.uid());
  new_id uuid := pg_catalog.gen_random_uuid();
  created public.organizations;
begin
  -- Running as the definer means RLS is bypassed, so authorization is checked
  -- here rather than inherited from a policy.
  if caller is null then
    raise exception 'authentication required'
      using errcode = '42501';
  end if;

  insert into public.organizations (
    id, name, slug, timezone, currency, locale, created_by
  )
  values (
    new_id,
    organization_name,
    organization_slug,
    organization_timezone,
    organization_currency,
    organization_locale,
    -- Bound to the caller, never taken as an argument: impersonation is not
    -- expressible through this interface.
    caller
  );

  select * into created from public.organizations where id = new_id;
  return created;
end;
$$;

revoke all on function public.create_organization(text, text, text, text, text)
  from public, anon;
grant execute on function public.create_organization(text, text, text, text, text)
  to authenticated;
