-- Auto-create profile rows for new auth users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Example geospatial helper: list current user's locations within a radius.
create or replace function public.locations_within_radius(
  p_lat double precision,
  p_lon double precision,
  p_radius_meters double precision default 10000
)
returns table (
  id uuid,
  owner_user_id uuid,
  name text,
  created_at timestamptz,
  distance_meters double precision
)
language sql
security invoker
set search_path = public
as $$
  select
    l.id,
    l.owner_user_id,
    l.name,
    l.created_at,
    st_distance(
      l.geom::geometry,
      st_setsrid(st_makepoint(p_lon, p_lat), 4326)::geometry
    ) as distance_meters
  from public.locations l
  where l.owner_user_id = auth.uid()
    and st_dwithin(
      l.geom::geometry,
      st_setsrid(st_makepoint(p_lon, p_lat), 4326)::geometry,
      p_radius_meters
    )
  order by distance_meters asc;
$$;
