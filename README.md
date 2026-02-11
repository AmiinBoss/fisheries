# Fisheries Supabase + PostGIS Starter

This repository is now a **Next.js App Router** app integrated end-to-end with Supabase:

- Supabase Auth (email/password)
- Supabase Postgres with PostGIS-enabled geospatial tables
- Strict Row Level Security (RLS)
- Browser/server/admin client separation with secure key usage
- Supabase migration workflow for local and remote projects

## 1) Environment variables

Copy `.env.example` to `.env.local` and fill values from your Supabase dashboard.

```bash
cp .env.example .env.local
```

Required variables:

- `SUPABASE_URL` (Project Settings → API → Project URL)
- `SUPABASE_ANON_KEY` (Project Settings → API → Project API keys → `anon`)
- `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API → Project API keys → `service_role`) **server-only**
- `DATABASE_URL` (optional direct DB connection string)
- `NEXT_PUBLIC_SUPABASE_URL` (same as `SUPABASE_URL`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (same as `SUPABASE_ANON_KEY`)
- `NEXT_PUBLIC_SITE_URL` (for auth redirects, e.g. `http://localhost:3000`)

### Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

- Site URL: `http://localhost:3000` (local)
- Additional Redirect URLs: `http://localhost:3000/auth/callback`

For production, add your deployed origin and callback URL as well.

## 2) Install and run app

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 3) Supabase migration workflow

The repository includes `supabase/config.toml` and SQL migrations under `supabase/migrations`.

### Initialize CLI (first time only)

```bash
supabase init
```

### Link to hosted project

```bash
supabase link --project-ref <your-project-ref>
```

### Start local Supabase stack

```bash
supabase start
```

### Apply migrations locally

```bash
supabase db reset
```

### Create a new migration

```bash
supabase migration new <migration_name>
```

### Push migrations to remote

```bash
supabase db push
```

## 4) What is implemented

- Auth screens:
  - `/login`
  - `/signup`
  - `/account` (protected)
- Auth callback route:
  - `/auth/callback`
- Middleware route protection for `/account`
- Data helpers:
  - `getCurrentUser()`
  - `getProfile()`
  - `upsertProfile()`
  - `listLocations()`
  - `createLocation({ name, lat, lon })`
  - `deleteLocation(id)`

## 5) Security model

- Browser uses only public anon key.
- Server SSR logic uses anon key + secure cookies.
- Service role key exists only in `server-only` admin client.
- RLS enabled on app tables.
- Policies enforce per-user ownership and admin-only writes for zones.

## 6) Database schema

Migration `20260211090000_init_postgis_auth.sql` creates:

- `profiles` (one row per user, role enum)
- `locations` (user-owned points: `geography(point, 4326)`)
- `zones` (shared multipolygons: `geography(multipolygon, 4326)`)
- GiST indexes on spatial columns
- RLS + policies for `profiles`, `locations`, and `zones`
- PostGIS extension enablement

## 7) Notes / TODOs

- TODO: Add CI migration drift checks (e.g., run `supabase db diff` in CI).
- TODO: Add storage bucket + policies if file uploads are introduced.
- TODO: Generate database types from live project when connected:

```bash
supabase gen types typescript --linked --schema public > src/lib/database.types.ts
```
