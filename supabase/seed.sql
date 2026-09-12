-- Demo data for local development and the RLS assertions (rule 56, 57).
--
-- Two organizations that share no members: every isolation assertion in
-- tests/rls.sql is written against this shape. Never load it into a
-- production project.
--
-- On a hosted project the auth users are normally created through Supabase
-- Auth; the direct inserts below exist so a local cluster has identities to
-- act as. They carry no password and cannot sign in.

insert into auth.users (id, email, raw_user_meta_data)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'owner@demo-auto.test',
    '{"full_name": "Demo Auto Owner"}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'staff@demo-auto.test',
    '{"full_name": "Demo Auto Staff"}'::jsonb
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'owner@demo-vet.test',
    '{"full_name": "Demo Vet Owner"}'::jsonb
  )
on conflict (id) do nothing;

-- created_by drives the trigger that makes the creator the owner member, so
-- the owner memberships below are not inserted by hand.
insert into public.organizations (id, name, slug, created_by)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'Demo Auto Service',
    'demo-auto',
    '11111111-1111-4111-8111-111111111111'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'Demo Veterinary Clinic',
    'demo-vet',
    '33333333-3333-4333-8333-333333333333'
  )
on conflict (id) do nothing;

insert into public.organization_members (organization_id, user_id, role)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '22222222-2222-4222-8222-222222222222',
    'staff'
  )
on conflict (organization_id, user_id) do nothing;

insert into public.business_profiles (
  id, organization_id, name, description, phone, email, city, country
)
values
  (
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'Demo Auto Service',
    'Service auto, diagnoza si revizii.',
    '+40700000001',
    'contact@demo-auto.test',
    'Bucuresti',
    'RO'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'Demo Veterinary Clinic',
    'Cabinet veterinar si consultatii.',
    '+40700000002',
    'contact@demo-vet.test',
    'Cluj-Napoca',
    'RO'
  )
on conflict (id) do nothing;
