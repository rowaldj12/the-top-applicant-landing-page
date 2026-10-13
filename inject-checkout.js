const fs = require('fs');
const path = require('path');

function bruteForceRedirects(dir) {
  let updatedFiles = 0;
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    if (file === 'node_modules' || file === '.git') return;

    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      bruteForceRedirects(filePath);
    } else if (filePath.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // 1. Override any onclick attributes calling startCheckout
      if (content.match(/onclick=["']startCheckout[^"']*["']/g)) {
        content = content.replace(/onclick=["']startCheckout[^"']*["']/g, `onclick="window.location.href='https://thetopapplicant.com'; return false;"`);
        modified = true;
      }

      // 2. Override any hardcoded Stripe payment links
      if (content.match(/href=["']https:\/\/buy\.stripe\.com[^"']*["']/g)) {
        content = content.replace(/href=["']https:\/\/buy\.stripe\.com[^"']*["']/g, `href="https://thetopapplicant.com"`);
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Brute-forced redirects in: ' + filePath);
        updatedFiles++;
      }
    }
  });
  
  if (dir === __dirname && updatedFiles === 0) {
    console.log('No buttons or Stripe links found to update.');
  }
}

bruteForceRedirects(__dirname);