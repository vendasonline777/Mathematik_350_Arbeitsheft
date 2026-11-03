document.addEventListener('DOMContentLoaded', () => {
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
  const loadMarketing = () => {
    if (installed || choice !== 'granted') return;
    installed = true;
    window.MATHE_LOAD_UTMIFY_PIXEL?.();
    window.MATHE_LOAD_UTMIFY?.();
  };
  const stopMarketing = () => {
    if (!installed) return;
    // Reload with the saved rejection to unload both third-party SDKs.
    location.reload();
  };
  document.getElementById('marketing-accept').addEventListener('click', () => {
    saveChoice('granted');
    show(false);
    loadMarketing();
  });
  document.getElementById('marketing-reject').addEventListener('click', () => {
    saveChoice('denied');
    show(false);
    stopMarketing();
  });
  settings.addEventListener('click', () => {
    show(true);
    document.getElementById('marketing-reject').focus();
  });
  window.addEventListener('storage', event => {
    if (event.key !== consentKey) return;
    choice = readChoice();
    if (choice === 'granted') { show(false); loadMarketing(); }
    else { show(choice === null); stopMarketing(); }
  });
  choice = readChoice();
  show(choice === null);
  if (choice === 'granted') loadMarketing();
});
