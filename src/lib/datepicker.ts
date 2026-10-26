// Lightweight two-month range calendar used by the booking widgets.

export type Range = { start: string | null; end: string | null };

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const fromIso = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (s: string, n: number) => {
  const d = fromIso(s);
  d.setDate(d.getDate() + n);
  return iso(d);
};

export const today = () => iso(new Date());

export function formatParts(s: string | null) {
  if (!s) return { day: '—', month: 'Select date', weekday: '' };
  const d = fromIso(s);
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`,
    weekday: d.toLocaleDateString('en-GB', { weekday: 'long' }),
  };
}

export function formatLong(s: string) {
  return fromIso(s).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

type Options = {
  root: HTMLElement;
  initial: Range;
  onChange: (range: Range) => void;
  onComplete?: () => void;
};

export function createRangePicker({ root, initial, onChange, onComplete }: Options) {
  let range: Range = { ...initial };
  let hover: string | null = null;
  const min = today();
  const base = fromIso(range.start ?? min);
  let viewYear = base.getFullYear();
  let viewMonth = base.getMonth();

  root.classList.add('dp');
  root.addEventListener('click', (e) => e.stopPropagation());

  function monthGrid(year: number, month: number) {
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();
    let cells = '';
    for (let i = 0; i < offset; i++) cells += '<span class="dp__cell dp__cell--empty"></span>';
    for (let d = 1; d <= days; d++) {
      const value = iso(new Date(year, month, d));
      const disabled = value < min;
      const isStart = value === range.start;
      const isEnd = value === range.end;
      const rangeEnd = range.end ?? (range.start && hover && hover > range.start ? hover : null);
      const inRange = !!(range.start && rangeEnd && value > range.start && value < rangeEnd);
      const cls = [
        'dp__cell',
        disabled && 'is-disabled',
        isStart && 'is-start',
        (isEnd || (!range.end && value === rangeEnd)) && 'is-end',
        inRange && 'is-in-range',
        value === min && 'is-today',
      ].filter(Boolean).join(' ');
      cells += `<button type="button" class="${cls}" data-date="${value}" ${disabled ? 'disabled' : ''} aria-label="${fromIso(value).toDateString()}">${d}</button>`;
    }
    return `<div class="dp__month">
      <div class="dp__title">${MONTHS[month]} ${year}</div>
      <div class="dp__dow">${DOW.map((d) => `<span>${d}</span>`).join('')}</div>
      <div class="dp__grid">${cells}</div>
    </div>`;
  }

  function render() {
    const next = new Date(viewYear, viewMonth + 1, 1);
    const minDate = fromIso(min);
    const atMin = viewYear === minDate.getFullYear() && viewMonth === minDate.getMonth();
    const hint = !range.start || range.end ? 'Select your arrival date' : 'Now select your departure date';
    root.innerHTML = `
      <div class="dp__head">
        <button type="button" class="dp__nav" data-nav="-1" ${atMin ? 'disabled' : ''} aria-label="Previous month">&#8592;</button>
        <span class="dp__hint">${hint}</span>
        <button type="button" class="dp__nav" data-nav="1" aria-label="Next month">&#8594;</button>
      </div>
      <div class="dp__months">
        ${monthGrid(viewYear, viewMonth)}
        ${monthGrid(next.getFullYear(), next.getMonth())}
      </div>`;
  }

  root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const nav = target.closest<HTMLElement>('[data-nav]');
    if (nav) {
      const d = new Date(viewYear, viewMonth + Number(nav.dataset.nav), 1);
      viewYear = d.getFullYear();
      viewMonth = d.getMonth();
      render();
      return;
    }
    const cell = target.closest<HTMLElement>('[data-date]');
    if (!cell) return;
    const value = cell.dataset.date!;
    if (!range.start || range.end || value <= range.start) {
      range = { start: value, end: null };
    } else {
      range = { start: range.start, end: value };
    }
    onChange(range);
    render();
    if (range.start && range.end) onComplete?.();
  });

  root.addEventListener('mouseover', (e) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-date]');
    if (!cell || !range.start || range.end) return;
    if (hover !== cell.dataset.date) {
      hover = cell.dataset.date!;
      render();
    }
  });

  render();
  return {
    set(next: Range) {
      range = { ...next };
      if (range.start) {
        const d = fromIso(range.start);
        viewYear = d.getFullYear();
        viewMonth = d.getMonth();
      }
      render();
    },
  };
}
