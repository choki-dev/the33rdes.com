import type { APIRoute } from 'astro';
import { bindings, canDeliver, clean, emailTemplate, isEmail, json, makeRef, sendMail } from '../../lib/server';

export const prerender = false;

const KINDS = { general: 'General enquiry', dining: 'Table reservation', spa: 'Spa appointment', event: 'Event enquiry' } as const;

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }
  if (body.website) return json({ ok: true, ref: makeRef('ENQ') });

  const kind = clean(body.kind, 20) as keyof typeof KINDS;
  if (!(kind in KINDS)) return json({ error: 'Invalid request type.' }, 422);

  const data = {
    name: clean(body.name, 120),
    email: clean(body.email, 160),
    phone: clean(body.phone, 40),
    venue: clean(body.venue, 80),
    date: clean(body.date, 10),
    time: clean(body.time, 10),
    guests: Number(body.guests) || null,
    message: clean(body.message, 2000),
  };
  if (!data.name) return json({ error: 'Please enter your name.' }, 422);
  if (!isEmail(data.email)) return json({ error: 'Please enter a valid email address.' }, 422);
  if (kind === 'general' && !data.message) return json({ error: 'Please enter a message.' }, 422);
  if (kind !== 'general' && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) return json({ error: 'Please choose a date.' }, 422);

  if (!canDeliver()) {
    if (import.meta.env.DEV) console.warn('[enquiry] No DB or RESEND_API_KEY configured — enquiry not persisted.', data);
    else return json({ error: 'Our form is temporarily unavailable. Please call or WhatsApp +975 16993333.' }, 503);
  }

  const ref = makeRef('ENQ');
  if (bindings.DB) {
    await bindings.DB.prepare(
      'INSERT INTO enquiries (ref, kind, name, email, phone, date, time, guests, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    )
      .bind(ref, kind, data.name, data.email, data.phone, data.date || null, data.time || null, data.guests, `${data.venue ? `[${data.venue}] ` : ''}${data.message}`)
      .run();
  }

  const rows: [string, string][] = [
    ['Reference', ref],
    ['Type', KINDS[kind]],
    ...(data.venue ? [['Venue', data.venue] as [string, string]] : []),
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone || '—'],
    ...(kind !== 'general'
      ? ([['Date', data.date], ['Time', data.time || '—'], ['Guests', String(data.guests ?? '—')]] as [string, string][])
      : []),
    ['Message', data.message || '—'],
  ];
  await sendMail({
    to: bindings.RESERVATIONS_EMAIL ?? 'choki@abit.bt',
    replyTo: data.email,
    subject: `${KINDS[kind]}${data.venue ? ` — ${data.venue}` : ''} (${ref})`,
    html: emailTemplate(KINDS[kind], 'A new request was submitted on the website.', rows),
  });

  return json({ ok: true, ref });
};
