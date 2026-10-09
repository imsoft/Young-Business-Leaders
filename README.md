# YBL · Young Business Leaders MX

Sitio público + comunidad de miembros para YBL. Next.js 16 (Cache Components), Tailwind v4, shadcn/ui (Base UI), Supabase.

## Arranque

```sh
pnpm install
cp .env.example .env.local   # llena las keys de Supabase
pnpm dev
```

Sin keys de Supabase el sitio corre con listas vacías (útil para maquetar).

## Supabase

1. Crea un proyecto en supabase.com (o `supabase start` para local).
2. Ejecuta `supabase/migrations/20261008000000_init.sql` en el SQL Editor (o `supabase db push`).
3. Opcional: `supabase/seed.sql` para eventos y álbumes de ejemplo.
4. Auth → Providers: activa **Google** y agrega `https://<tu-dominio>/auth/callback` y `http://localhost:3000/auth/callback` como redirect URLs.
5. Pega en `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
6. Hazte admin: regístrate en el sitio y corre en SQL
   `update public.profiles set is_admin = true, status = 'approved' where email = 'tu@correo';`

## Estructura

| Ruta | Qué es |
|---|---|
| `/`, `/nosotros`, `/eventos`, `/galeria`, `/contacto` | Sitio público (cacheado con `use cache` + tags) |
| `/login`, `/registro`, `/pendiente` | Auth (Google + correo) |
| `/comunidad`, `/comunidad/[id]`, `/comunidad/perfil`, `/comunidad/eventos` | Red de miembros (solo aprobados) |
| `/admin/*` | Panel: aprobar miembros, eventos, galería, patrocinadores, mensajes |

- `src/lib/auth.ts`: capa de sesión (`getCurrentProfile`, `requireMember`, `requireAdmin`).
- `src/lib/data/public.ts`: lecturas públicas cacheadas; los server actions de admin invalidan con `updateTag`.
- `src/actions/*`: server actions con validación zod.
- `src/proxy.ts`: refresca sesión y redirige rutas protegidas.
- RLS en Supabase es la autorización real; el service role solo se usa tras `requireAdmin()` o para registros de invitados validados.

## Scripts

```sh
pnpm dev · pnpm build · pnpm lint · pnpm typecheck · pnpm test
```

## Pendientes de contenido

- Número de WhatsApp y correo reales en `src/lib/constants.ts`.
- Logo oficial en `public/brand/` (hoy es un trazo aproximado) y fotos para galería.
