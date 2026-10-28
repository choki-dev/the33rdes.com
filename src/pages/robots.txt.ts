import type { APIRoute } from 'astro';

// Search engines and AI assistants (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…) are all welcome:
// being quoted in AI answers is part of how guests find the hotel.
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return new Response(`User-agent: *\nAllow: /\nDisallow: /404\n\nSitemap: ${new URL(base + '/sitemap.xml', site)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
