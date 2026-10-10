-- Datos de ejemplo para desarrollo. No correr en producción.
insert into public.events (slug, title, summary, description, starts_at, ends_at, location, address, is_public, published)
values
  ('reunion-mensual-noviembre', 'Reunión mensual de miembros', 'Networking y avances de los proyectos de la comunidad.',
   'Espacio exclusivo para miembros aprobados. Trae tu proyecto y tus preguntas.',
   '2026-11-14 18:30-06', '2026-11-14 21:00-06', 'CCJEJ', 'Guadalajara, Jalisco', false, true)
on conflict (slug) do nothing;

-- Álbumes y fotos: node scripts/photos-import.mjs <carpeta> <tmp>

insert into public.sponsors (name, website, tier, sort_order)
values
  ('CCJEJ', 'https://instagram.com/ccjejac', 'fundador', 1)
on conflict do nothing;
