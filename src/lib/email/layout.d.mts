export const C: Record<"gold" | "goldDeep" | "ink" | "text" | "muted" | "cream" | "line", string>;
export function esc(value: unknown): string;
export function button(href: string, label: string): string;
export function code(token: string): string;
export function p(html: string): string;
export function details(rows: [string, string][]): string;
export function layout(opts: { preheader: string; title: string; body: string; footnote?: string; siteUrl: string }): string;
