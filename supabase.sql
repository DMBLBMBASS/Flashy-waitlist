-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security. The app uses the service-role key (server-side
-- only) which bypasses RLS, so no public read/write policies are needed.
alter table waitlist enable row level security;
