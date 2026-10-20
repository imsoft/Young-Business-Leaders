-- YBL · Mis emprendimientos (20 oct 2026)
-- Cada miembro puede registrar varios emprendimientos. Pégalo en Supabase → SQL Editor → Run. Es idempotente.

create table if not exists public.member_ventures (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  tagline text,
  role text,
  stage text,
  industry text,
  website text,
  logo_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ventures_lengths check (
    char_length(name) between 1 and 80
    and coalesce(char_length(tagline), 0) <= 140
    and coalesce(char_length(industry), 0) <= 60
  ),
  constraint ventures_role check (role is null or role in ('fundador', 'cofundador', 'socio', 'equipo', 'inversionista')),
  constraint ventures_stage check (stage is null or stage in ('idea', 'validando', 'operando', 'creciendo')),
  constraint ventures_urls check (
    (website is null or (website ~* '^https?://[^\s<>"]+$' and char_length(website) <= 300))
    and (logo_url is null or (logo_url ~* '^https://[^\s<>"]+$' and char_length(logo_url) <= 500))
  )
);

create index if not exists member_ventures_profile_idx on public.member_ventures (profile_id, sort_order);
create index if not exists member_ventures_industry_idx on public.member_ventures (industry);

drop trigger if exists member_ventures_set_updated_at on public.member_ventures;
create trigger member_ventures_set_updated_at
  before update on public.member_ventures
  for each row execute function public.set_updated_at();

-- Máximo 10 emprendimientos por persona
create or replace function public.limit_member_ventures()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.member_ventures where profile_id = new.profile_id) >= 10 then
    raise exception 'Máximo 10 emprendimientos por perfil' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;
drop trigger if exists member_ventures_limit on public.member_ventures;
create trigger member_ventures_limit
  before insert on public.member_ventures
  for each row execute function public.limit_member_ventures();

-- profiles.company refleja el emprendimiento principal (menor sort_order):
-- así la tarjeta del directorio, la búsqueda y el panel admin siguen funcionando.
create or replace function public.sync_profile_company()
returns trigger language plpgsql security definer set search_path = public as $$
declare pid uuid := coalesce(new.profile_id, old.profile_id);
begin
  update public.profiles
     set company = (select name from public.member_ventures where profile_id = pid order by sort_order, created_at limit 1)
   where id = pid;
  return null;
end;
$$;
drop trigger if exists member_ventures_sync_company on public.member_ventures;
create trigger member_ventures_sync_company
  after insert or update or delete on public.member_ventures
  for each row execute function public.sync_profile_company();

-- Lo que ya estaba en "Empresa o proyecto" pasa a ser su primer emprendimiento
insert into public.member_ventures (profile_id, name, industry, website, sort_order)
select p.id, left(p.company, 80), p.industry, p.website, 0
from public.profiles p
where p.company is not null and btrim(p.company) <> ''
  and not exists (select 1 from public.member_ventures v where v.profile_id = p.id);

-- RLS: misma visibilidad que los perfiles
alter table public.member_ventures enable row level security;

drop policy if exists "ventures: own all" on public.member_ventures;
create policy "ventures: own all" on public.member_ventures
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

drop policy if exists "ventures: approved members read approved" on public.member_ventures;
create policy "ventures: approved members read approved" on public.member_ventures
  for select using (
    public.is_approved_member()
    and exists (select 1 from public.profiles p where p.id = profile_id and p.status = 'approved')
  );

drop policy if exists "ventures: admin all" on public.member_ventures;
create policy "ventures: admin all" on public.member_ventures
  for all using (public.is_admin()) with check (public.is_admin());

grant select, insert, update, delete on public.member_ventures to authenticated;
