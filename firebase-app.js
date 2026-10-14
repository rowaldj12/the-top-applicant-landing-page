// Redirect all landing page CTAs and form submissions directly to the main app
window.startCheckout = function() {
  window.location.href = 'https://thetopapplicant.com';
  return false;
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Intercept any form submissions (e.g., email capture / trial forms)
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      window.location.href = 'https://thetopapplicant.com';
    }, true);
  });

  // 2. Intercept any checkout buttons or Stripe links
  document.querySelectorAll('button, a[href*="stripe.com"], a[href*="#"]').forEach(el => {
    const text = (el.textContent || '').toLowerCase();
    const onclickAttr = el.getAttribute('onclick') || '';
    if (
      onclickAttr.includes('startCheckout') ||
      (el.href && el.href.includes('stripe.com')) ||
      text.includes('trial') ||
      text.includes('start') ||
      text.includes('join') ||
      text.includes('access') ||
      text.includes('get ') ||
      text.includes('subscribe') ||
      text.includes('founding')
    ) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        window.location.href = 'https://thetopapplicant.com';
      }, true);
    }
  });
});
