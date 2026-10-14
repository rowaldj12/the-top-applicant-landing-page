// Redirect all landing page CTAs (handleCheckout & startCheckout) directly to the main app
window.handleCheckout = function() {
  window.location.href = 'https://thetopapplicant.com';
  return false;
};

window.startCheckout = function() {
  window.location.href = 'https://thetopapplicant.com';
  return false;
};

function attachRedirects() {
  document.querySelectorAll('button[onclick*="handleCheckout"], button[onclick*="startCheckout"], a[href*="stripe.com"]').forEach(el => {
    el.setAttribute('onclick', "if(typeof fbq==='function')fbq('track','Lead'); window.location.href='https://thetopapplicant.com'; return false;");
    if (el.tagName === 'A') el.href = 'https://thetopapplicant.com';
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachRedirects);
} else {
  attachRedirects();
}
