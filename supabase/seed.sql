-- Datos de ejemplo para desarrollo. No correr en producción.
-- Sin eventos de ejemplo: los eventos reales se crean desde /admin/eventos.

-- Álbumes y fotos: node scripts/photos-import.mjs <carpeta> <tmp>

insert into public.sponsors (name, website, tier, sort_order)
values
  ('CCJEJ', 'https://instagram.com/ccjejac', 'fundador', 1)
on conflict do nothing;
