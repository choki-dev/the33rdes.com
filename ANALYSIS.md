# Project analysis — the33rdes.com

_Written 2026-10-30, at commit `b61b2af`._

## Overview

The website for **The 33rd Executive Suites** (Thimphu, Bhutan), built with Astro 7 and TypeScript. Every page is prebuilt as static HTML (`output: 'static'`), so the site needs no server at run time. The two forms (booking and contact) send their messages through **Web3Forms**.

- 23 pages built, type check (`astro check`) clean: 0 errors, 0 warnings
- 145 tracked files, 27 commits; photos are about 21 MB of source and about 40 MB in `dist/client` once converted to WebP

## Where the site is published

| Target | How | Notes |
| --- | --- | --- |
| GitHub Pages | `.github/workflows/deploy.yml` runs on every push to `main` and publishes to the `gh-pages` branch | https://choki-dev.github.io/the33rdes.com/ — `BASE_PATH=/the33rdes.com`, and `scripts/prefix-base.mjs` adds that prefix to root-relative links |
| Cloudflare Workers | `npm run deploy` (`wrangler.jsonc`) | Serves the static files; no Worker code is in use anymore |
| Apache host | Upload `dist/client` along with `deploy/.htaccess` | Forces https without www, 301 redirects from the old WordPress addresses, caching and compression |

## Code structure

| Area | Files (lines) |
| --- | --- |
| Pages | `index` (944), `book` (543), `destination` (226), `availability` (210), `travel-guide` (209), `rooms/[slug]` (164), `experiences/index` (155), `about`, `contact`, `gallery`, `404`, plus `sitemap.xml`, `robots.txt`, `llms.txt` |
| Layout & components | `Base` (150), `Header` (353), `BookingBar` (203), `Filmstrip`, `EnquiryForm`, `Footer`, `Lightbox`, `RoomCard`, `AmenityTiles`, hero sections, WhatsApp button, mobile booking bar |
| Content | `src/data/site.ts` (465): contact details, nav, rooms, policies, extras, experiences, form endpoint and key; `faqs.ts` |
| Logic | `lib/stay.ts` (booking checks), `datepicker.ts`, `stay-params.ts`, `schema.ts` (structured data), `urls.ts`, `images.ts` |
| Styles | `src/styles/global.css` (340), with the colours and fonts as `:root` tokens |

## How the forms work

1. **Booking (`/book`)** goes through 4 steps: dates → room → extras → guest details. In the browser, `validateStay()` checks the dates, the number of rooms and room capacity. The script then POSTs JSON to `https://api.web3forms.com/submit` with a reference such as `33R-7KQ4MZ`, and the guest's address is set as the reply-to.
2. **Contact (`/contact`)** uses `EnquiryForm` with `kind="general"` and the same Web3Forms flow.
3. Both forms include a hidden `website` field as a spam trap (`botcheck`). If sending fails, the guest is asked to call or WhatsApp +975 16993333.

## Problems found

### Out of date or misleading
1. **The README describes the old setup.** It mentions `/api/booking` and `/api/enquiry`, Resend email, D1 storage, and says submissions are refused in production until one of those is set up. None of that exists now; the forms post straight to Web3Forms.
2. **The README says restaurant, spa and event forms are on each experience page.** They aren't. `EnquiryForm` is used only on `/contact`, so its `dining`, `spa` and `event` options (and the `venue` field) are never used.
3. **Unused leftovers:** the `RESEND_*` / `MAIL_FROM` settings in `wrangler.jsonc`, `migrations/0001_init.sql`, `addonNames()` in `lib/stay.ts` (never called), and the comment on `validateStay` that mentions an API ("Shared by the booking page and the API").
4. **The README says the dev server runs on port 4321.** On this machine that port is used by another project.

### Behaviour and risk
5. **Booking checks run only in the browser.** With no server in between, anyone can POST anything to Web3Forms using the public key. In the Web3Forms dashboard, limit the key to the site's domains and turn on its spam protection (for example hCaptcha).
6. **The access key appears on every deploy target.** That's expected for Web3Forms, but the Cloudflare and Apache copies keep the key they were built with until they are deployed again. After a key change, redeploy all of them.
7. **No form submission has been tested since the key changed.** Send one real test from the live site.
8. **Three addresses serve the same site** (GitHub Pages, Workers, Apache). Make sure canonical tags and `site` point to `https://the33rdes.com`. The Pages build sets `SITE_URL` to github.io, so its canonical URLs point to the preview, which is fine as long as search engines don't index it.

### Smaller points
9. `index.astro` is 944 lines; moving its sections into components would make it easier to edit.
10. Photos are about 40 MB after the build. Check that the hero slideshow loads only the first slide eagerly.

## Suggested next steps

1. Rewrite the README "Going live" section for Web3Forms; remove the Resend and D1 instructions and the unused config and migration.
2. Either add `EnquiryForm` to the restaurant, spa and boardroom pages (the code already supports it) or remove the unused options.
3. Limit the Web3Forms key to the site's domains and send a test booking and a test enquiry.
4. Delete `addonNames()` and fix the `validateStay` comment.
