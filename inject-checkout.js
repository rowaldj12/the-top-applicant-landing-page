const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (file === 'node_modules' || file === '.git') return;

    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // 1. Clean out all previous Firebase injected scripts
      content = content.replace(/<script type="module">[\s\S]*?window\.startCheckout[\s\S]*?<\/script>/g, '');
      content = content.replace(/<script>[\s\S]*?window\.startCheckout[\s\S]*?<\/script>/g, '');
      
      // 2. Inject the clean redirect function for the pricing buttons
      const redirectScript = `
        <script>
          window.startCheckout = function(priceId, event) {
            if (event) event.preventDefault();
            // Routes pricing button clicks directly to your main app
            window.location.href = 'https://thetopapplicant.com'; 
          };
        </script>
        </body>
      `;
      
      if (!content.includes('window.location.href = \'https://thetopapplicant.com\'')) {
        content = content.replace('</body>', redirectScript);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Wired pricing buttons to main app: ' + filePath);
      }
    }
  });
}

walkDir(__dirname);