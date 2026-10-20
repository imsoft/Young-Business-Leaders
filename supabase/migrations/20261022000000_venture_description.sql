-- YBL · Descripción larga de emprendimientos (22 oct 2026)
-- Pégalo en Supabase → SQL Editor → Run. Es idempotente.

alter table public.member_ventures add column if not exists description text;

alter table public.member_ventures drop constraint if exists ventures_description;
alter table public.member_ventures add constraint ventures_description
  check (description is null or char_length(description) <= 1000);

-- Búsqueda del directorio de emprendimientos por nombre y descripción corta
create index if not exists member_ventures_name_idx on public.member_ventures (lower(name));
