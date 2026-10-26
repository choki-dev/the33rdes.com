// Reads and writes a stay in the URL, shared by the booking bar and the /availability page.
// The availability link uses the form ?dates=22/10/2026 to 24/10/2026&adults=2&children=0;
// /book links use ?checkin=2026-10-22&checkout=2026-10-24, so both are accepted when reading.

export type StayParams = {
  checkIn: string | null;
  checkOut: string | null;
  adults: number | null;
  children: number | null;
  rooms: number | null;
};

const isoDate = (v: string | null) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);

/** "22/10/2026" → "2026-10-22" */
const fromDmy = (v: string) => {
  const m = v.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null;
};

/** "2026-10-22" → "22/10/2026" */
const toDmy = (iso: string) => iso.split('-').reverse().join('/');

const count = (v: string | null) => {
  const n = Number(v);
  return v !== null && v !== '' && Number.isInteger(n) && n >= 0 ? n : null;
};

export function readStayParams(search: string): StayParams {
  const p = new URLSearchParams(search);
  let checkIn = isoDate(p.get('checkin'));
  let checkOut = isoDate(p.get('checkout'));
  const dates = p.get('dates');
  if (dates) {
    const [a, b] = dates.split(/\s+to\s+/i);
    checkIn = (a && fromDmy(a)) || checkIn;
    checkOut = (b && fromDmy(b)) || checkOut;
  }
  return { checkIn, checkOut, adults: count(p.get('adults')), children: count(p.get('children')), rooms: count(p.get('rooms')) };
}

type Stay = { checkIn: string; checkOut: string; adults: number; children: number; rooms: number };

// Site base path ("" on the live domain, "/the33rdes.com" on the GitHub Pages preview).
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function availabilityUrl(s: Stay) {
  const p = new URLSearchParams({
    dates: `${toDmy(s.checkIn)} to ${toDmy(s.checkOut)}`,
    adults: String(s.adults),
    children: String(s.children),
    rooms: String(s.rooms),
  });
  return `${base}/availability/?${p}`;
}

export function bookUrl(s: Stay, room?: string) {
  const p = new URLSearchParams({
    checkin: s.checkIn,
    checkout: s.checkOut,
    adults: String(s.adults),
    children: String(s.children),
    rooms: String(s.rooms),
  });
  if (room) p.set('room', room);
  return `${base}/book?${p}`;
}
