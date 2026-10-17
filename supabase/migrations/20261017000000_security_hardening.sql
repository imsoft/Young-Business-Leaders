-- YBL · endurecimiento de seguridad (17 oct 2026)
-- Pégalo completo en Supabase → SQL Editor → Run. Es idempotente.

-- 1) El correo de un miembro no debe ser legible por otros miembros vía API.
--    RLS filtra filas, no columnas: quitamos el permiso de lectura general y lo
--    damos columna por columna, sin `email`. El panel admin usa service role y no
--    se ve afectado; cada usuario obtiene su propio correo de su sesión de Auth.
revoke select on public.profiles from anon, authenticated;
grant select (
  id, full_name, avatar_url, headline, bio, company, industry, city,
  instagram, linkedin, website, status, is_admin, created_at, updated_at
) on public.profiles to authenticated;

-- 2) La base valida lo mismo que el sitio, aunque alguien llame a la API directo.
--    NOT VALID: aplica a escrituras nuevas sin bloquear por filas existentes.
alter table public.profiles drop constraint if exists profiles_lengths;
alter table public.profiles add constraint profiles_lengths check (
  char_length(full_name) <= 80
  and coalesce(char_length(headline), 0) <= 100
  and coalesce(char_length(bio), 0) <= 600
  and coalesce(char_length(company), 0) <= 80
  and coalesce(char_length(industry), 0) <= 60
  and coalesce(char_length(city), 0) <= 60
) not valid;

alter table public.profiles drop constraint if exists profiles_urls;
alter table public.profiles add constraint profiles_urls check (
  (website is null or (website ~* '^https?://[^\s<>"]+$' and char_length(website) <= 300))
  and (linkedin is null or (linkedin ~* '^https?://[^\s<>"]+$' and char_length(linkedin) <= 300))
  and (avatar_url is null or (avatar_url ~* '^https://[^\s<>"]+$' and char_length(avatar_url) <= 500))
  and (instagram is null or instagram ~ '^[A-Za-z0-9._-]{1,60}$')
) not valid;

alter table public.event_registrations drop constraint if exists registrations_lengths;
alter table public.event_registrations add constraint registrations_lengths check (
  coalesce(char_length(guest_name), 0) <= 80 and coalesce(char_length(guest_email), 0) <= 254
) not valid;

alter table public.contact_messages drop constraint if exists contact_lengths;
alter table public.contact_messages add constraint contact_lengths check (
  char_length(name) <= 80 and char_length(email) <= 254 and char_length(message) <= 2000
) not valid;

-- 3) Los buckets públicos sirven archivos por URL sin necesitar esta política;
--    con ella, cualquiera podía listar carpetas (y ver los IDs de los usuarios).
drop policy if exists "avatars: public read" on storage.objects;
drop policy if exists "media: public read" on storage.objects;
