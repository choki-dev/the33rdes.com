import type { APIRoute } from 'astro';
import { site } from '../data/site';

// Search engines and AI assistants (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…) are all welcome:
// being quoted in AI answers is part of how guests find the hotel. (The 404 page is noindex, so it is not blocked.)
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site.url)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
