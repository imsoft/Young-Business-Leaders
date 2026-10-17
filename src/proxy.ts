import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/comunidad", "/admin"];

function siteHost() {
  try {
    const host = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "").hostname;
    return host && !host.endsWith(".vercel.app") && host !== "localhost" ? host : null;
  } catch {
    return null;
  }
}

/**
 * Refresca la sesión de Supabase en cada request y hace un redirect optimista
 * en rutas protegidas. La autorización real vive en src/lib/auth.ts.
 */
export async function proxy(request: NextRequest) {
  // En producción, *.vercel.app sirve el mismo sitio: lo mandamos al dominio propio para no duplicar contenido.
  const canonicalHost = siteHost();
  if (process.env.VERCEL_ENV === "production" && canonicalHost && request.nextUrl.hostname.endsWith(".vercel.app")) {
    const target = new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, `https://${canonicalHost}`);
    return NextResponse.redirect(target, 308);
  }

  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser valida el token contra Supabase; no confíes en getSession aquí.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!user && isProtected) {
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }
  if (user && (pathname === "/login" || pathname === "/registro")) {
    return NextResponse.redirect(new URL("/comunidad", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
