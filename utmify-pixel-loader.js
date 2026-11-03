// UTMify pixel loader, registered in <head> and invoked after marketing consent.
window.MATHE_LOAD_UTMIFY_PIXEL = () => {
  if (document.getElementById('mathe-utmify-pixel-sdk')) return;
  window.pixelId = '6aea2947160e2449f6da9d43';
  const pixel = document.createElement('script');
  pixel.id = 'mathe-utmify-pixel-sdk';
  pixel.src = 'https://cdn.utmify.com.br/scripts/pixel/pixel.js';
  pixel.async = true;
  pixel.defer = true;
  document.head.appendChild(pixel);
};
