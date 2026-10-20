-- YBL · Contacto de emprendimientos (21 oct 2026)
-- Pégalo en Supabase → SQL Editor → Run. Es idempotente. Requiere 20261020000000_member_ventures.sql.

alter table public.member_ventures
  add column if not exists contact_phone text,
  add column if not exists contact_whatsapp boolean not null default false,
  add column if not exists contact_email text,
  add column if not exists instagram text,
  add column if not exists facebook text,
  add column if not exists linkedin text,
  add column if not exists tiktok text;

alter table public.member_ventures drop constraint if exists ventures_contact;
alter table public.member_ventures add constraint ventures_contact check (
  (contact_phone is null or contact_phone ~ '^\+?[0-9 ()-]{7,20}$')
  and (contact_email is null or (contact_email ~* '^[^@\s<>"]+@[^@\s<>"]+\.[a-z]{2,}$' and char_length(contact_email) <= 254))
  and (instagram is null or instagram ~ '^[A-Za-z0-9._]{1,30}$')
  and (tiktok is null or tiktok ~ '^[A-Za-z0-9._]{1,24}$')
  and (facebook is null or (facebook ~* '^https://([a-z0-9-]+\.)?(facebook|fb)\.com/[^\s<>"]+$' and char_length(facebook) <= 300))
  and (linkedin is null or (linkedin ~* '^https://([a-z0-9-]+\.)?linkedin\.com/[^\s<>"]+$' and char_length(linkedin) <= 300))
);
