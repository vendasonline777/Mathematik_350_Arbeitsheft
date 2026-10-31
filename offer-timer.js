document.addEventListener('DOMContentLoaded', () => {
  const key = 'mathe_offer_deadline_v1';
  const duration = 24 * 60 * 60 * 1000;
  const banner = document.querySelector('.promo-banner');
  const clock = document.getElementById('offer-countdown');
  const endDate = document.getElementById('offer-end-date');
  const label = document.getElementById('offer-timer-label');
  const dateLabel = document.getElementById('offer-date-label');
  if (!banner || !clock || !endDate || !label || !dateLabel) return;

  const asDeadline = value => {
    if (!value || !/^\d+$/.test(String(value))) return null;
    const number = Number(value);
    return Number.isSafeInteger(number) && number > 0 && number <= Date.now() + duration + 60000 ? number : null;
  };
  const storedDeadline = () => {
    const values = [];
    try {
      const cookie = document.cookie.split(';').map(part => part.trim()).find(part => part.startsWith(`${key}=`));
      if (cookie) values.push(asDeadline(cookie.slice(key.length + 1)));
    } catch {}
    try { values.push(asDeadline(localStorage.getItem(key))); } catch {}
    const valid = values.filter(value => value !== null);
    return valid.length ? Math.min(...valid) : null;
  };
  let deadline = storedDeadline() ?? Date.now() + duration;
  const persist = () => {
    try {
      // Keep the deadline after expiration so returning visitors do not get a reset.
      document.cookie = `${key}=${deadline}; Max-Age=31536000; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    } catch {}
    try { localStorage.setItem(key, String(deadline)); } catch {}
  };
  persist();
  const buttons = [...document.querySelectorAll('[data-product-checkout]')];
  const originalLabels = new Map(buttons.map(button => [button, button.textContent]));
  const update = () => {
    const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    clock.textContent = [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':');
    clock.setAttribute('aria-label', `${hours} Stunden, ${minutes} Minuten, ${seconds} Sekunden`);
    endDate.dateTime = new Date(deadline).toISOString();
    endDate.textContent = new Intl.DateTimeFormat('de-DE', {timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(deadline)) + ' Uhr';
    const expired = remaining === 0;
    label.textContent = expired ? 'Dieses Angebot ist abgelaufen.' : 'Dieses Angebot endet in';
    clock.hidden = expired;
    dateLabel.hidden = expired;
    banner.dataset.expired = String(expired);
    buttons.forEach(button => {
      if (expired) {
        button.setAttribute('aria-disabled', 'true');
        button.textContent = 'Angebot abgelaufen';
      } else {
        button.removeAttribute('aria-disabled');
        button.textContent = originalLabels.get(button);
      }
    });
  };
  buttons.forEach(button => button.addEventListener('click', event => {
    // Recheck the absolute timestamp at click time, including in background tabs.
    if (Date.now() >= deadline) {
      event.preventDefault();
      event.stopImmediatePropagation();
      update();
    }
  }, true));
  window.addEventListener('storage', event => {
    if (event.key !== key) return;
    const shared = storedDeadline();
    if (shared !== null && shared < deadline) { deadline = shared; persist(); }
    update();
  });
  window.addEventListener('pageshow', update);
  document.addEventListener('visibilitychange', update);
  update();
  setInterval(update, 1000);
});
