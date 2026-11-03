// UTMify UTM loader, registered in <head> and invoked after marketing consent.
window.MATHE_LOAD_UTMIFY = () => {
  if (!document.getElementById('mathe-utmify-sdk')) {
    const script = document.createElement('script');
    script.id = 'mathe-utmify-sdk';
    script.src = 'https://cdn.utmify.com.br/scripts/utms/latest.js';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-utmify-prevent-subids', '');
    document.head.appendChild(script);
  }
};
