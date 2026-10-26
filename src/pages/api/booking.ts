import type { APIRoute } from 'astro';
import { addons, rooms } from '../../data/site';
import { addonNames, nightsBetween, validateStay, type StayInput } from '../../lib/stay';
import { bindings, canDeliver, clean, emailTemplate, isEmail, json, makeRef, sendMail } from '../../lib/server';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  // Honeypot: bots fill hidden fields.
  if (body.website) return json({ ref: makeRef('33R'), ok: true });

  const s = body.stay ?? {};
  const stay: StayInput = {
    checkIn: clean(s.checkIn, 10),
    checkOut: clean(s.checkOut, 10),
    rooms: Number(s.rooms),
    adults: Number(s.adults),
    children: Number(s.children ?? 0),
    roomSlug: clean(s.roomSlug, 40),
    addons: Array.isArray(s.addons) ? s.addons.filter((a: unknown) => typeof a === 'string').slice(0, addons.length) : [],
  };
  const stayError = validateStay(stay);
  if (stayError) return json({ error: stayError }, 422);

  const g = body.guest ?? {};
  const guest = {
    firstName: clean(g.firstName, 80),
    lastName: clean(g.lastName, 80),
    email: clean(g.email, 160),
    phone: clean(g.phone, 40),
    country: clean(g.country, 80),
    arrivalTime: clean(g.arrivalTime, 40),
    purpose: clean(g.purpose, 20),
    requests: clean(g.requests, 1500),
  };
  if (!guest.firstName || !guest.lastName) return json({ error: 'Please enter your full name.' }, 422);
  if (!isEmail(guest.email)) return json({ error: 'Please enter a valid email address.' }, 422);
  if (guest.phone.length < 6) return json({ error: 'Please enter a phone number we can reach you on.' }, 422);
  if (g.acceptTerms !== true) return json({ error: 'Please accept the booking conditions.' }, 422);

  const room = rooms.find((r) => r.slug === stay.roomSlug)!;
  const nights = nightsBetween(stay.checkIn, stay.checkOut);
  const extras = addonNames(stay.addons);

  if (!canDeliver()) {
    if (import.meta.env.DEV) {
      console.warn('[booking] No DB or RESEND_API_KEY configured — booking not persisted.', { stay, guest });
    } else {
      return json({ error: 'Online booking is temporarily unavailable. Please call or WhatsApp +975 16993333.' }, 503);
    }
  }

  const ref = makeRef('33R');
  const fullName = `${guest.firstName} ${guest.lastName}`;

  if (bindings.DB) {
    await bindings.DB.prepare(
      `INSERT INTO bookings (ref, check_in, check_out, nights, rooms, adults, children, room_slug, addons,
        guest_name, guest_email, guest_phone, guest_country, arrival_time, requests, payload)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        ref, stay.checkIn, stay.checkOut, nights, stay.rooms, stay.adults, stay.children, stay.roomSlug,
        JSON.stringify(extras), fullName, guest.email, guest.phone, guest.country, guest.arrivalTime, guest.requests,
        JSON.stringify({ stay, guest }),
      )
      .run();
  }

  const rows: [string, string][] = [
    ['Reference', ref],
    ['Guest', fullName],
    ['Email', guest.email],
    ['Phone', guest.phone],
    ['Country', guest.country || '—'],
    ['Arrival', stay.checkIn],
    ['Departure', stay.checkOut],
    ['Nights', String(nights)],
    ['Room', `${room.name} × ${stay.rooms}`],
    ['Guests', `${stay.adults} adults, ${stay.children} children`],
    ['Extras', extras.length ? extras.join(', ') : '—'],
    ['Estimated arrival', guest.arrivalTime || '—'],
    ['Purpose', guest.purpose || '—'],
    ['Requests', guest.requests || '—'],
  ];

  const staffTo = bindings.RESERVATIONS_EMAIL ?? 'choki@abit.bt';
  const [staffSent] = await Promise.all([
    sendMail({
      to: staffTo,
      replyTo: guest.email,
      subject: `New booking request ${ref} — ${room.name}, ${stay.checkIn} → ${stay.checkOut}`,
      html: emailTemplate('New booking request', 'A new reservation request was submitted on the website. Please reply with availability and the rate.', rows),
    }),
    sendMail({
      to: guest.email,
      replyTo: staffTo,
      subject: `Your reservation request ${ref} — The 33rd Executive Suites`,
      html: emailTemplate(
        `Thank you, ${guest.firstName}`,
        'We have received your reservation request. Our reservations team will confirm availability and send you our best rate shortly.',
        rows.filter(([k]) => !['Email', 'Phone'].includes(k)),
        'No payment has been taken. If you need anything before your arrival, simply reply to this email or WhatsApp us on +975 16993333.',
      ),
    }),
  ]);

  // Without a database the email is the only record, so a failed send must not look like success.
  if (!staffSent && !bindings.DB && !import.meta.env.DEV) {
    return json({ error: 'We could not send your request just now. Please call or WhatsApp +975 16993333.' }, 502);
  }

  return json({ ok: true, ref });
};
