-- Datos de ejemplo para desarrollo. No correr en producción.
insert into public.events (slug, title, summary, description, starts_at, ends_at, location, address, is_public, published)
values
  ('jalisco-al-grito-2026', 'Jalisco al Grito 2026', 'Tacos, tequila, lucha libre, música y comunidad.',
   'Jóvenes que conectan un Jalisco más grande. Una noche para celebrar lo nuestro y conocer a otros emprendedores.',
   '2026-09-11 20:00-06', '2026-09-12 01:00-06', 'Aguamarina 2580A', 'La Florida, Zapopan', true, true),
  ('finanzas-para-dummies', 'Finanzas para Dummies', 'Taller práctico de finanzas personales y de negocio para emprendedores.',
   'Aprende a leer tus números, separar finanzas personales de las del negocio y proyectar tu flujo. Sin tecnicismos.',
   '2026-10-24 10:00-06', '2026-10-24 13:00-06', 'CCJEJ', 'Guadalajara, Jalisco', true, true),
  ('reunion-mensual-noviembre', 'Reunión mensual de miembros', 'Networking y avances de los proyectos de la comunidad.',
   'Espacio exclusivo para miembros aprobados. Trae tu proyecto y tus preguntas.',
   '2026-11-14 18:30-06', '2026-11-14 21:00-06', 'CCJEJ', 'Guadalajara, Jalisco', false, true)
on conflict (slug) do nothing;

insert into public.gallery_albums (slug, title, description, event_date, sort_order, published)
values
  ('talleres', 'Talleres', 'Sesiones prácticas con expertos.', '2026-05-10', 1, true),
  ('conferencia-2', 'Conf #2 · La receta del triunfo', 'Segunda conferencia anual.', '2026-03-15', 2, true),
  ('conferencia-1', 'Conf #1 · Shots de éxito', 'Primera conferencia anual.', '2025-11-20', 3, true),
  ('reuniones', 'Reuniones', 'Nuestras reuniones mensuales.', '2026-06-01', 4, true)
on conflict (slug) do nothing;

insert into public.sponsors (name, website, tier, sort_order)
values
  ('CCJEJ', 'https://instagram.com/ccjejac', 'fundador', 1)
on conflict do nothing;
