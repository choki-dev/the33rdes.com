// Server-only helpers for the /api routes (runs on the Cloudflare Worker).
import { env } from 'cloudflare:workers';

type Bindings = {
  DB?: D1Database;
  RESEND_API_KEY?: string;
  RESERVATIONS_EMAIL?: string;
  MAIL_FROM?: string;
};

export const bindings = env as unknown as Bindings;

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

/** Short, human-friendly reference such as "33R-7KQ4MZ". */
export function makeRef(prefix: string) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `${prefix}-${[...bytes].map((b) => alphabet[b % alphabet.length]).join('')}`;
}

export const escapeHtml = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const clean = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/** True when at least one place to deliver bookings (database or email) is configured. */
export const canDeliver = () => Boolean(bindings.DB || bindings.RESEND_API_KEY);

export async function sendMail(opts: { to: string | string[]; subject: string; html: string; replyTo?: string }) {
  if (!bindings.RESEND_API_KEY) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${bindings.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: bindings.MAIL_FROM ?? 'The 33rd Executive Suites <onboarding@resend.dev>',
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      reply_to: opts.replyTo,
    }),
  });
  if (!res.ok) console.error('Resend error', res.status, await res.text());
  return res.ok;
}

/** Minimal branded email shell. `rows` are [label, value] pairs (values are escaped). */
export function emailTemplate(title: string, intro: string, rows: [string, string][], outro = '') {
  const body = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid #e6dece;color:#6e6a63;font-size:13px;width:40%">${escapeHtml(k)}</td><td style="padding:10px 0;border-bottom:1px solid #e6dece;color:#1d1c1a;font-size:14px">${escapeHtml(v)}</td></tr>`,
    )
    .join('');
  return `<!doctype html><html><body style="margin:0;background:#faf7f1;font-family:Georgia,serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f1;padding:32px 16px"><tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border:1px solid #e6dece">
    <tr><td style="background:#1d1c1a;padding:28px 36px;color:#d8c79c;font-size:12px;letter-spacing:4px;text-transform:uppercase;font-family:Arial,sans-serif">The 33rd Executive Suites</td></tr>
    <tr><td style="padding:36px">
      <h1 style="margin:0 0 12px;font-weight:normal;font-size:28px;color:#1d1c1a">${escapeHtml(title)}</h1>
      <p style="margin:0 0 24px;color:#3a3836;font-size:15px;line-height:1.6;font-family:Arial,sans-serif">${escapeHtml(intro)}</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif">${body}</table>
      ${outro ? `<p style="margin:24px 0 0;color:#3a3836;font-size:14px;line-height:1.6;font-family:Arial,sans-serif">${escapeHtml(outro)}</p>` : ''}
    </td></tr>
    <tr><td style="padding:20px 36px;border-top:1px solid #e6dece;color:#6e6a63;font-size:12px;font-family:Arial,sans-serif">Babesa Highway, Thimphu, Bhutan · +975 16993333 · reservation@the33rdes.com</td></tr>
  </table></td></tr></table></body></html>`;
}
