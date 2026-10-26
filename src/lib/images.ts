import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/img/*.jpg', { eager: true });

const byKey: Record<string, ImageMetadata> = {};
for (const [path, mod] of Object.entries(files)) {
  const key = path.split('/').pop()!.replace(/\.jpg$/, '');
  byKey[key] = mod.default;
}

/** Look up a photo in src/assets/img by file name (without extension). */
export function img(key: string): ImageMetadata {
  const found = byKey[key];
  if (!found) throw new Error(`Unknown image "${key}"`);
  return found;
}
