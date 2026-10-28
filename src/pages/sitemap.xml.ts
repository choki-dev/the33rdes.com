import type { APIRoute } from 'astro';
import { indexablePaths, pageUrl } from '../lib/urls';

export const GET: APIRoute = () => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = indexablePaths
    .map((p) => {
      const priority = p === '/' ? '1.0' : p.split('/').length > 3 ? '0.8' : '0.9';
      return `  <url><loc>${pageUrl(p)}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`;
    })
    .join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
