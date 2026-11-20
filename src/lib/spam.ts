// Spam protection shared by the booking and enquiry forms (both post to Web3Forms).
// - Honeypot: a hidden "website" field people never see. When a bot fills it, the form shows success and sends nothing.
// - Time trap: a form sent within 3 seconds of the page opening is a bot, treated the same way.
// - hCaptcha with Web3Forms' free shared sitekey. Web3Forms checks the token once hCaptcha is switched on for the
//   access key in its dashboard. The widget loads the first time a guest touches the form, so pages stay fast.

const SITEKEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2';
const MIN_FILL_MS = 3000;

type HCaptcha = { render(el: HTMLElement, opts: { sitekey: string }): string; getResponse(id: string): string; reset(id: string): void };
const w = window as unknown as { hcaptcha?: HCaptcha; onHCaptchaLoad?: () => void };

let api: Promise<HCaptcha> | null = null;
const loadApi = () =>
  (api ??= new Promise<HCaptcha>((resolve, reject) => {
    w.onHCaptchaLoad = () => resolve(w.hcaptcha!);
    const script = document.createElement('script');
    script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit&onload=onHCaptchaLoad';
    script.async = true;
    script.onerror = reject;
    document.head.appendChild(script);
  }));

export function protectForm(form: HTMLFormElement) {
  const openedAt = Date.now();
  const box = form.querySelector<HTMLElement>('[data-captcha]')!;
  let widget: string | undefined;
  let unavailable = false;

  const start = () =>
    loadApi()
      .then((h) => (widget ??= h.render(box, { sitekey: SITEKEY })))
      .catch(() => (unavailable = true));
  form.addEventListener('focusin', start, { once: true });
  form.addEventListener('pointerdown', start, { once: true });

  return {
    /** The submission looks automated: show success and send nothing. */
    isBot: () => Boolean(form.querySelector<HTMLInputElement>('input[name="website"]')?.value) || Date.now() - openedAt < MIN_FILL_MS,
    /** The hCaptcha token; null when the guest still has to tick the box. If hCaptcha could not load, Web3Forms decides. */
    token: (): string | null => {
      if (unavailable) return '';
      const t = widget !== undefined ? w.hcaptcha!.getResponse(widget) : '';
      return t || null;
    },
    reset: () => widget !== undefined && w.hcaptcha!.reset(widget),
  };
}
