const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      // Example: Check if it already has the handler to avoid duplicates
      if (!content.includes('ext-firestore-stripe-payments')) {
        // Insert your injection snippet right before </body> or inside a specific script tag
        content = content.replace('</body>', `
          <script type="module">
            import { collection, addDoc, getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
            const db = getFirestore();
            window.startCheckout = async (priceId) => {
              await addDoc(collection(db, 'customers/USER_ID/checkout_sessions'), {
                price: priceId,
                success_url: window.location.origin,
                cancel_url: window.location.href,
              });
            };
          </script>
          </body>
        `);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
      }
    }
  });
}

walkDir(path.join(__dirname, 'public'));