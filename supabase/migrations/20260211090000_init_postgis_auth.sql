-- Enable PostGIS extension for geospatial types and operators
create extension if not exists postgis;

-- App role enum used by profile records and zone write controls
create type public.app_role as enum ('user', 'admin');

-- Profiles: one row per auth user
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- User-owned point locations
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  geom geography(point, 4326) not null,
  created_at timestamptz not null default now()
);

-- Optional shared zones (polygons)
create table if not exists public.zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  geom geography(multipolygon, 4326) not null,
  created_at timestamptz not null default now()
);

create index if not exists locations_geom_gix on public.locations using gist (geom);
create index if not exists zones_geom_gix on public.zones using gist (geom);

-- Keep updated_at current for profile updates
create or replace function public.handle_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row
execute procedure public.handle_profile_updated_at();

alter table public.profiles enable row level security;
alter table public.locations enable row level security;
alter table public.zones enable row level security;

-- Profiles: users can read/update their own profile only
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = user_id);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Locations: users can CRUD only their own records
create policy "locations_select_own"
on public.locations
for select
to authenticated
using (auth.uid() = owner_user_id);

create policy "locations_insert_own"
on public.locations
for insert
to authenticated
with check (auth.uid() = owner_user_id);

create policy "locations_update_own"
on public.locations
for update
to authenticated
using (auth.uid() = owner_user_id)
with check (auth.uid() = owner_user_id);

create policy "locations_delete_own"
on public.locations
for delete
to authenticated
using (auth.uid() = owner_user_id);

-- Zones: all authenticated users may read; only admin role may write
create policy "zones_select_authenticated"
on public.zones
for select
to authenticated
using (true);

create policy "zones_insert_admin"
on public.zones
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "zones_update_admin"
on public.zones
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "zones_delete_admin"
on public.zones
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'admin'
  )
);
