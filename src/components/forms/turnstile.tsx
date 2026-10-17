"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Widget de Cloudflare Turnstile. Agrega el campo `cf-turnstile-response` al formulario.
 * Cambia `resetKey` (p. ej. el estado del action) para pedir un token nuevo tras un envío.
 */
export function Turnstile({ resetKey }: { resetKey?: unknown }) {
  const ref = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!SITE_KEY || !ready || !ref.current || !window.turnstile || widget.current) return;
    widget.current = window.turnstile.render(ref.current, { sitekey: SITE_KEY, language: "es", appearance: "interaction-only" });
    return () => {
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [ready]);

  useEffect(() => {
    if (widget.current) window.turnstile?.reset(widget.current);
  }, [resetKey]);

  if (!SITE_KEY) return null;
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={ref} />
    </>
  );
}
