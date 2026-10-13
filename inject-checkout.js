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
      
      // 1. Clean up the old, broken script if it exists from the previous run
      content = content.replace(/<script type="module">[\s\S]*?window\.startCheckout[\s\S]*?<\/script>/g, '');
      
      // 2. Inject the new self-contained script with Firebase initialized
      if (!content.includes('AIzaSyDYieylXKPAcdw4HmmbZdwlfShJXrRM7S4')) {
        content = content.replace('</body>', `
          <script type="module">
            import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
            import { collection, addDoc, getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
            
            const firebaseConfig = {
              apiKey: "AIzaSyDYieylXKPAcdw4HmmbZdwlfShJXrRM7S4",
              projectId: "top-applicant-8a716",
              appId: "1:382307733734:web:8292eb9ace8cb93cde2b27"
            };
            
            const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
            const db = getFirestore(app);
            
            window.startCheckout = async (priceId) => {
              const uid = 'anonymous_checkout'; 
              await addDoc(collection(db, 'customers/' + uid + '/checkout_sessions'), {
                price: priceId,
                success_url: window.location.origin + '/success.html',
                cancel_url: window.location.origin,
                subscription_data: {
                  trial_period_days: 4
                }
              });
            };
          </script>
          </body>
        `);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated with Firebase init and trial parameters: ' + filePath);
      }
    }
  });
}

walkDir(__dirname);