document.addEventListener('DOMContentLoaded', () => {
  const pixelId = '2175878289972586';
  const consentKey = 'mathe_marketing_consent_v1';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const banner = document.getElementById('marketing-consent');
  const settings = document.getElementById('cookie-settings');
  if (!banner || !settings) return;
  let installed = false;
  let choice = null;

  const readChoice = () => {
    try {
      const value = JSON.parse(localStorage.getItem(consentKey));
      if (!value || !['granted', 'denied'].includes(value.choice) || !Number.isFinite(value.savedAt) || value.savedAt > Date.now() || Date.now() - value.savedAt >= lifetime) return null;
      return value.choice;
    } catch { return null; }
  };
  const saveChoice = value => {
    choice = value;
    try { localStorage.setItem(consentKey, JSON.stringify({choice:value, savedAt:Date.now()})); } catch {}
  };
  const show = visible => {
    banner.hidden = !visible;
    document.body.classList.toggle('marketing-choice-open', visible);
    settings.setAttribute('aria-expanded', String(visible));
  };
  const loadPixel = () => {
    if (installed || choice !== 'granted') return;
    installed = true;
    // Standard Meta queue; the SDK is not requested until marketing is accepted.
    if (!window.fbq) {
      const fbq = function () {
        fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
      };
      window.fbq = fbq;
      if (!window._fbq) window._fbq = fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
    }
    window.fbq('consent', 'grant');
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
    const script = document.createElement('script');
    script.id = 'mathe-meta-pixel-sdk';
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
  };
  const stopPixel = () => {
    if (!installed) return;
    window.fbq('consent', 'revoke');
    // Remove cookies on this site's own host, then unload the running SDK.
    ['_fbp', '_fbc'].forEach(name => {
      const base = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      document.cookie = base;
      document.cookie = `${base}; Domain=${location.hostname}`;
      document.cookie = `${base}; Domain=.${location.hostname}`;
    });
    location.reload();
  };
  document.getElementById('marketing-accept').addEventListener('click', () => {
    saveChoice('granted');
    show(false);
    loadPixel();
  });
  document.getElementById('marketing-reject').addEventListener('click', () => {
    saveChoice('denied');
    show(false);
    stopPixel();
  });
  settings.addEventListener('click', () => {
    show(true);
    document.getElementById('marketing-reject').focus();
  });
  window.addEventListener('storage', event => {
    if (event.key !== consentKey) return;
    choice = readChoice();
    if (choice === 'granted') { show(false); loadPixel(); }
    else { show(choice === null); stopPixel(); }
  });
  choice = readChoice();
  show(choice === null);
  if (choice === 'granted') loadPixel();
});
