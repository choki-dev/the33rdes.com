import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// GitHub Pages preview (see .github/workflows/deploy.yml) sets SITE_URL=https://choki-dev.github.io and
// BASE_PATH=/the33rdes.com; it is a plain static build, so the Cloudflare adapter is left out there.
const pages = Boolean(process.env.BASE_PATH && process.env.BASE_PATH !== '/');

export default defineConfig({
  site: process.env.SITE_URL || 'https://the33rdes.com',
  base: process.env.BASE_PATH || '/',
  // Every page is prerendered to static HTML.
  output: 'static',
  ...(pages
    ? {}
    : {
        adapter: cloudflare({
          // Optimise images with Sharp at build time; serve them as static assets.
          imageService: 'compile',
        }),
      }),
  session: false,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
