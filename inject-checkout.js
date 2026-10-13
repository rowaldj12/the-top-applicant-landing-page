const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (file === 'node_modules' || file === '.git') return;

    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      if (!content.includes('subscription_data')) {
        content = content.replace('</body>', `
          <script type="module">
            import { collection, addDoc, getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
            const db = getFirestore();
            window.startCheckout = async (priceId) => {
              await addDoc(collection(db, 'customers/USER_ID/checkout_sessions'), {
                price: priceId,
                success_url: window.location.origin,
                cancel_url: window.location.href,
                subscription_data: {
                  trial_period_days: 4
                }
              });
            };
          </script>
          </body>
        `);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated with trial parameters: ${filePath}`);
      }
    }
  });
}

walkDir(__dirname);