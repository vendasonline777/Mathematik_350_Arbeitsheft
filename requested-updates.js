document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.getElementById('purchase-dialog');
  let checkout = '';
  try {
    const url = new URL(window.MATHE_CONFIG?.checkoutUrl || '');
    if (url.protocol === 'https:') checkout = url.href;
  } catch {}
  document.querySelectorAll('[data-product-checkout]').forEach(link => {
    if (checkout) link.href = checkout;
    link.addEventListener('click', event => {
      if (!checkout) { event.preventDefault(); dialog.showModal(); }
    });
  });
  document.getElementById('purchase-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  // Keep expanded state aligned with the original accordion behavior.
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      document.querySelectorAll('.faq-trigger').forEach(button => {
        button.setAttribute('aria-expanded', String(button.closest('.faq-item').classList.contains('active')));
      });
    });
  });
});
