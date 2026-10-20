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
4. Auth → Providers: activa **Google**. En URL Configuration: Site URL `https://yblmx.org` y redirect URLs `https://yblmx.org/auth/callback` y `http://localhost:3000/auth/callback`.
5. Pega en `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
6. Hazte admin: regístrate en el sitio y corre en SQL
   `update public.profiles set is_admin = true, status = 'approved' where email = 'tu@correo';`

## Dominio

Producción: **https://yblmx.org** (Namecheap como registrador, DNS en Cloudflare, hosting en Vercel).

- Cloudflare DNS: `A @ → IP que indica Vercel` y `CNAME www → valor que indica Vercel`, ambos en **DNS only** (nube gris).
- Vercel → Domains: `yblmx.org` principal y `www.yblmx.org` con redirección 308 al principal.
- Vercel → Environment Variables: `NEXT_PUBLIC_SITE_URL=https://yblmx.org`.
- Correo `hola@yblmx.org`: Cloudflare → Email Routing, reenvío al correo del equipo.

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

## Fotos y carteles

- **Galería (álbumes):** viven en Supabase Storage y en las tablas `gallery_albums` / `gallery_photos`. Se administran desde `/admin/galeria`. Todo lo que se sube pasa por `src/lib/images.ts`: se rota según EXIF, se limita a 2000 px, se convierte a WebP y se le quitan los metadatos.
- **Diseño del sitio y carteles de trayectoria:** viven en `public/media/` y se describen en `src/lib/data/site-media.json` (ruta, tamaño y placeholder borroso). Los lee `src/lib/media.ts`.
- **Importar un lote nuevo:** edita `scripts/photos-map.json` (qué archivo va a qué álbum, qué fotos usa el home y qué carteles hay) y corre:

```sh
node scripts/photos-contact-sheets.mjs <carpeta> <tmp>   # hojas numeradas para revisar el lote
node scripts/photos-import.mjs <carpeta> <tmp>            # comprime, sube álbumes y regenera public/media
```

  Acepta JPG, PNG y HEIC (HEIC se convierte con `sips`, solo macOS). El nombre de cada foto subida termina en `-ANCHOxALTO.webp`; la galería lee de ahí las dimensiones para reservar el espacio exacto.

## Logo

Logo oficial en `assets/brand/ybl-logo-source.json`: trazos extraídos del PDF original y el símbolo reconstruido como un solo contorno (el original usaba formas blancas encimadas que se notan sobre fondos de color). Dorado `#F7A500` y beige `#E2D6C0`.

```sh
node scripts/build-brand-assets.mjs   # SVG: símbolo, logo apilado, horizontal (texto negro y blanco) e icon.svg
node scripts/generate-icons.mjs       # favicon.ico, apple-icon, íconos del manifest y PNG para correos
```

## Tarjetas para compartir

Cada página tiene su imagen Open Graph generada con la plantilla de `src/lib/og/card.tsx` (Plus Jakarta Sans de `assets/fonts`, licencia OFL): páginas fijas en PNG con su título, eventos con nombre, fecha, lugar y portada, y álbumes con su foto de portada. Eventos y álbumes salen en JPEG (~100 KB) para que WhatsApp muestre la vista previa. Para refrescar una tarjeta en caché de Facebook/WhatsApp usa el [Sharing Debugger](https://developers.facebook.com/tools/debug/).

## Correos

Los correos de Supabase Auth (confirmación, invitación, enlace mágico, cambio de correo, recuperación, reautenticación y avisos de seguridad) usan plantillas con la marca en `supabase/templates/`. Se generan con `node scripts/build-email-templates.mjs` y se suben con:

```sh
SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/push-email-templates.mjs
```

Los enlaces apuntan a `/auth/confirm?token_hash=…`, que funciona aunque el correo se abra en otro dispositivo. El envío sale por SMTP de Resend como `no-reply@yblmx.org`.

## Scripts

```sh
pnpm dev · pnpm build · pnpm lint · pnpm typecheck · pnpm test
```

## Pendientes de contenido

- Número de WhatsApp y correo reales en `src/lib/constants.ts`.
- El evento "Reunión mensual de miembros" es un ejemplo: edítalo o bórralo desde `/admin/eventos`.
