// GitHub Pages serves this site under a sub-path (https://choki-dev.github.io/the33rdes.com/), but the pages link
// with plain root paths ("/rooms", "/book?…"). After `astro build` with BASE_PATH set, this prefixes those links in
// dist/*.html. Astro's own asset URLs already carry the base and are left alone. Does nothing when BASE_PATH is unset or "/".
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const base = (process.env.BASE_PATH || "/").replace(/\/$/, "");
if (!base) process.exit(0);

const esc = base.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// href="/x" / src="/x" / action="/x" / poster="/x", not protocol-relative "//" and not already prefixed
const attr = new RegExp(`\\b(href|src|action|content|poster)="/(?!/|${esc}(?:/|"))`, "g");

let files = 0;
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) {
      const html = readFileSync(p, "utf8");
      const out = html.replace(attr, `$1="${base}/`);
      if (out !== html) writeFileSync(p, out), files++;
    }
  }
};
walk("dist");
console.log(`prefix-base: prefixed root links with ${base} in ${files} HTML files`);
