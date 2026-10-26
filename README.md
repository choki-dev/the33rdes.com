# The 33rd Executive Suites — website

Astro 7 site deployed to **Cloudflare Workers** (static pages + a small Worker for bookings).

- **Design:** full-screen video hero (inspired by Bhutan Spirit Sanctuary), left side-drawer menu with a centred logo (inspired by Simtokha), EB Garamond headings with Montserrat Light text, palette taken from the logo (antique gold `#AE944F`, charcoal `#3A3836`, warm ivory).
- **Booking:** a hero booking bar with a range calendar and guest picker feeds a 4-step booking engine at `/book` (dates → room → extras → guest details → reference number). No rates are shown; the reservations team replies with availability and the rate. Restaurant, spa and event reservation forms are on each experience page, and there's a contact form.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at http://localhost:4321 |
| `npm run build` | Build to `dist/` |
| `npm run preview` | Build and run on the real Workers runtime (`wrangler dev`) |
| `npm run deploy` | Build and deploy to Cloudflare |

## Where to edit things

| What | File |
| --- | --- |
| Contact details, socials, hero video, nav | `src/data/site.ts` → `site`, `nav` |
| Room descriptions, sizes, photos | `src/data/site.ts` → `rooms` |
| Booking limits (max nights, max rooms) | `src/data/site.ts` → `policies` |
| Optional extras (airport transfer, spa, etc.) | `src/data/site.ts` → `addons` |
| Restaurant / bar / spa / boardroom copy & hours | `src/data/site.ts` → `experiences` |
| Colours & fonts | `src/styles/global.css` (`:root` tokens) |
| Photos | `src/assets/img/*.jpg` (optimised to WebP at build time) |
| Hero video | `public/video/hero.mp4` + `hero.webm` + `hero-poster.jpg` |

Booking requests are validated on both the page and the server with the same rules (`src/lib/stay.ts`).

## Going live: receiving bookings

Out of the box, `/api/booking` and `/api/enquiry` **refuse submissions in production** (and tell the guest to call or WhatsApp) until at least one delivery channel is set up. This keeps bookings from being lost silently.

**1. Email notifications (recommended)** via [Resend](https://resend.com):

```sh
npx wrangler secret put RESEND_API_KEY
```

Verify the `the33rdes.com` domain in Resend, then set `MAIL_FROM` and `RESERVATIONS_EMAIL` in `wrangler.jsonc`. The hotel gets every request, and the guest gets a branded acknowledgement.

**2. Database (optional, keeps a record)** with Cloudflare D1:

```sh
npx wrangler d1 create the33rdes          # copy the database_id it prints
# uncomment the d1_databases block in wrangler.jsonc and paste the id
npx wrangler d1 migrations apply the33rdes --remote
npm run cf-typegen
```

To view bookings: `npx wrangler d1 execute the33rdes --remote --command "SELECT * FROM bookings ORDER BY id DESC LIMIT 20"`.

## Deploy

```sh
npx wrangler login
npm run deploy
```

Then add the custom domain `the33rdes.com` to the Worker under **Workers & Pages → the33rdes → Settings → Domains & Routes** in the Cloudflare dashboard.
