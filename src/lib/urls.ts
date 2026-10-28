import { experiences, rooms, site } from '../data/site';

// Site base path ("" on the live domain, "/the33rdes.com" on the GitHub Pages preview).
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Canonical URL of a page: always the production site, with the trailing slash the built pages use. */
export const pageUrl = (path: string) => new URL(path.endsWith('/') ? path : path + '/', site.url).toString();

/** Absolute URL of a file, on whichever host serves this build (getImage() paths already carry the base). */
export const assetUrl = (path: string) =>
  new URL(path.startsWith(base + '/') ? path : base + path, import.meta.env.SITE ?? site.url).toString();

export const roomPath = (slug: string) => `/rooms/${slug}/`;
export const experiencePath = (slug: string) => `/experiences/${slug}/`;

/** Every indexable page (the booking and availability steps are noindex, so they are left out). */
export const indexablePaths = [
  '/',
  '/rooms/',
  ...rooms.map((r) => roomPath(r.slug)),
  '/experiences/',
  ...experiences.map((x) => experiencePath(x.slug)),
  '/destination/',
  '/travel-guide/',
  '/gallery/',
  '/about/',
  '/contact/',
];
