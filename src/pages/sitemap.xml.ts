import type { APIRoute } from 'astro';
import { experiences, rooms } from '../data/site';

// Every indexable page, with the trailing slash the built pages (and their canonical tags) use; the canonical host comes from `site` in astro.config.mjs.
const paths = [
  '/',
  '/rooms/',
  ...rooms.map((r) => `/rooms/${r.slug}/`),
  '/experiences/',
  ...experiences.map((x) => `/experiences/${x.slug}/`),
  '/destination/',
  '/travel-guide/',
  '/gallery/',
  '/about/',
  '/availability/',
  '/book/',
  '/location/',
  '/contact/',
];

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);
  const urls = paths
    .map((p) => {
      const priority = p === '/' ? '1.0' : p.split('/').length > 3 ? '0.8' : '0.9';
      return `  <url><loc>${new URL(base + p, site)}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`;
    })
    .join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
