// Equivalent to the supplied encoded loader: same URL, flags and attributes.
// Registered in <head>; invoked only after marketing consent is granted.
window.MATHE_LOAD_UTMIFY = () => {
  if (document.getElementById('mathe-utmify-sdk')) return;
  const script = document.createElement('script');
  script.id = 'mathe-utmify-sdk';
  script.src = 'https://cdn.utmify.com.br/scripts/utms/latest.js';
  script.async = true;
  script.defer = true;
  script.setAttribute('data-utmify-prevent-subids', '');
  (document.head || document.documentElement).appendChild(script);
};
