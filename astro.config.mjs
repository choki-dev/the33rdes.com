// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://the33rdes.com',
  // Pages are prerendered to static HTML; only /api/* runs on the Worker.
  output: 'static',
  adapter: cloudflare({
    // Optimise images with Sharp at build time; serve them as static assets.
    imageService: 'compile',
  }),
  session: false,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
