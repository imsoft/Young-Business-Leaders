-- YBL · esquema inicial
-- Ejecuta con `supabase db push` o pégalo en el SQL Editor del proyecto.

create extension if not exists "pgcrypto";

-- ---------- Tipos ----------
do $$ begin
  create type public.member_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

-- ---------- Perfiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  avatar_url text,
  headline text,
  bio text,
  company text,
  industry text,
  city text default 'Guadalajara',
  instagram text,
  linkedin text,
  website text,
  status public.member_status not null default 'pending',
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_status_idx on public.profiles (status);
create index if not exists profiles_industry_idx on public.profiles (industry);

-- Crea el perfil al registrarse (email, Google, etc.)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Helpers de autorización (security definer para no entrar en recursión de RLS)
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.is_approved_member()
returns boolean language sql security definer stable set search_path = public as $$
  select coalesce((select status = 'approved' from public.profiles where id = auth.uid()), false);
$$;

-- Un miembro no puede auto-aprobarse ni hacerse admin
create or replace function public.protect_profile_privileges()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    new.status := old.status;
    new.is_admin := old.is_admin;
    new.email := old.email;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_privileges on public.profiles;
create trigger profiles_protect_privileges
  before update on public.profiles
  for each row execute function public.protect_profile_privileges();

-- ---------- Eventos ----------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  address text,
  cover_url text,
  capacity integer check (capacity is null or capacity > 0),
  is_public boolean not null default true,       -- true: cualquiera se registra; false: solo miembros
  published boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_starts_at_idx on public.events (starts_at);
create index if not exists events_published_idx on public.events (published);

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete cascade,
  guest_name text,
  guest_email text,
  created_at timestamptz not null default now(),
  constraint registration_identity check (
    (user_id is not null and guest_email is null) or
    (user_id is null and guest_email is not null and guest_name is not null)
  )
);

create unique index if not exists event_registrations_user_unique
  on public.event_registrations (event_id, user_id) where user_id is not null;
create unique index if not exists event_registrations_guest_unique
  on public.event_registrations (event_id, lower(guest_email)) where guest_email is not null;

-- Conteo público de asistentes sin exponer quiénes son
create or replace function public.event_attendee_count(event uuid)
returns integer language sql security definer stable set search_path = public as $$
  select count(*)::int from public.event_registrations where event_id = event;
$$;

-- ---------- Galería ----------
create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  cover_url text,
  event_date date,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums (id) on delete cascade,
  url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists gallery_photos_album_idx on public.gallery_photos (album_id, sort_order);

-- ---------- Patrocinadores ----------
create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website text,
  tier text not null default 'aliado',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- Contacto ----------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.sponsors enable row level security;
alter table public.contact_messages enable row level security;

-- profiles
drop policy if exists "profiles: own read" on public.profiles;
create policy "profiles: own read" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles: approved members see approved members" on public.profiles;
create policy "profiles: approved members see approved members" on public.profiles
  for select using (status = 'approved' and public.is_approved_member());

drop policy if exists "profiles: admin read all" on public.profiles;
create policy "profiles: admin read all" on public.profiles
  for select using (public.is_admin());

drop policy if exists "profiles: own update" on public.profiles;
create policy "profiles: own update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles: admin update" on public.profiles;
create policy "profiles: admin update" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- events
drop policy if exists "events: public read published" on public.events;
create policy "events: public read published" on public.events
  for select using (published = true);

drop policy if exists "events: admin all" on public.events;
create policy "events: admin all" on public.events
  for all using (public.is_admin()) with check (public.is_admin());

-- event_registrations
drop policy if exists "registrations: member inserts own" on public.event_registrations;
create policy "registrations: member inserts own" on public.event_registrations
  for insert with check (
    auth.uid() = user_id
    and public.is_approved_member()
    and exists (select 1 from public.events e where e.id = event_id and e.published)
  );

drop policy if exists "registrations: member deletes own" on public.event_registrations;
create policy "registrations: member deletes own" on public.event_registrations
  for delete using (auth.uid() = user_id);

drop policy if exists "registrations: own read" on public.event_registrations;
create policy "registrations: own read" on public.event_registrations
  for select using (auth.uid() = user_id);

drop policy if exists "registrations: members see who goes" on public.event_registrations;
create policy "registrations: members see who goes" on public.event_registrations
  for select using (user_id is not null and public.is_approved_member());

drop policy if exists "registrations: admin all" on public.event_registrations;
create policy "registrations: admin all" on public.event_registrations
  for all using (public.is_admin()) with check (public.is_admin());

-- gallery
drop policy if exists "albums: public read published" on public.gallery_albums;
create policy "albums: public read published" on public.gallery_albums
  for select using (published = true);
drop policy if exists "albums: admin all" on public.gallery_albums;
create policy "albums: admin all" on public.gallery_albums
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "photos: public read of published albums" on public.gallery_photos;
create policy "photos: public read of published albums" on public.gallery_photos
  for select using (exists (select 1 from public.gallery_albums a where a.id = album_id and a.published));
drop policy if exists "photos: admin all" on public.gallery_photos;
create policy "photos: admin all" on public.gallery_photos
  for all using (public.is_admin()) with check (public.is_admin());

-- sponsors
drop policy if exists "sponsors: public read active" on public.sponsors;
create policy "sponsors: public read active" on public.sponsors
  for select using (active = true);
drop policy if exists "sponsors: admin all" on public.sponsors;
create policy "sponsors: admin all" on public.sponsors
  for all using (public.is_admin()) with check (public.is_admin());

-- contact (solo admin lee; inserta el servidor con service role)
drop policy if exists "contact: admin read" on public.contact_messages;
create policy "contact: admin read" on public.contact_messages
  for select using (public.is_admin());

-- ---------- Storage ----------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "avatars: public read" on storage.objects;
create policy "avatars: public read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars: user manages own folder" on storage.objects;
create policy "avatars: user manages own folder" on storage.objects
  for all using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "media: public read" on storage.objects;
create policy "media: public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media: admin writes" on storage.objects;
create policy "media: admin writes" on storage.objects
  for all using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());
