import { addons, policies, rooms } from '../data/site';

export type StayInput = {
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  roomSlug: string;
  addons: string[];
};

const DAY = 86_400_000;

export function parseDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = parseDate(checkIn);
  const b = parseDate(checkOut);
  if (!a || !b) return 0;
  return Math.round((b.getTime() - a.getTime()) / DAY);
}

/** Names of the requested extras, ignoring unknown ids. */
export function addonNames(ids: string[]): string[] {
  return ids.map((id) => addons.find((a) => a.id === id)?.name).filter((n): n is string => Boolean(n));
}

/** Returns an error message, or null when the stay request is valid. Shared by the booking page and the API. */
export function validateStay(input: StayInput, today = new Date()): string | null {
  const a = parseDate(input.checkIn);
  const b = parseDate(input.checkOut);
  if (!a || !b) return 'Please choose your arrival and departure dates.';
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  // Allow one day of slack for guests in time zones ahead of UTC (Bhutan is UTC+6).
  if (a.getTime() < todayUtc - DAY) return 'Arrival date cannot be in the past.';
  const nights = nightsBetween(input.checkIn, input.checkOut);
  if (nights < 1) return 'Departure must be after arrival.';
  if (nights > policies.maxNights) return `For stays longer than ${policies.maxNights} nights, please contact us directly.`;
  if (!Number.isInteger(input.rooms) || input.rooms < 1 || input.rooms > policies.maxRooms)
    return `Online requests are limited to ${policies.maxRooms} rooms. For groups, please contact us.`;
  if (!Number.isInteger(input.adults) || input.adults < 1) return 'At least one adult is required.';
  if (!Number.isInteger(input.children) || input.children < 0) return 'Invalid number of children.';
  const room = rooms.find((r) => r.slug === input.roomSlug);
  if (!room) return 'Please choose a room.';
  // Children under 12 share with parents; adults are limited by room capacity.
  if (input.adults > room.capacity * input.rooms)
    return `The ${room.name} sleeps ${room.capacity} adults — please add another room.`;
  return null;
}
