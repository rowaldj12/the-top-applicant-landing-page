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
      
      // Clean up older scripts
      content = content.replace(/<script type="module">[\s\S]*?window\.startCheckout[\s\S]*?<\/script>/g, '');
      
      if (!content.includes('signInAnonymously')) {
        content = content.replace('</body>', `
          <script type="module">
            import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
            import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
            import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
            
            const firebaseConfig = {
              apiKey: "AIzaSyDYieylXKPAcdw4HmmbZdwlfShJXrRM7S4",
              projectId: "top-applicant-8a716",
              appId: "1:382307733734:web:8292eb9ace8cb93cde2b27"
            };
            
            const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
            const db = getFirestore(app);
            const auth = getAuth(app);
            
            window.startCheckout = async (priceId, event) => {
              if (event) event.preventDefault(); // Prevent standard static link redirect
              
              try {
                // 1. Sign in anonymously to pass Firestore security rules
                const userCredential = await signInAnonymously(auth);
                const uid = userCredential.user.uid;
                
                // 2. Create the checkout session document with trial parameters
                const docRef = await addDoc(collection(db, 'customers/' + uid + '/checkout_sessions'), {
                  price: priceId,
                  success_url: window.location.origin + '/success.html',
                  cancel_url: window.location.origin,
                  subscription_data: { trial_period_days: 4 }
                });
                
                // 3. Listen for Stripe to generate the custom trial URL and redirect
                onSnapshot(docRef, (snap) => {
                  const data = snap.data();
                  if (data && data.url) {
                    window.location.assign(data.url);
                  }
                });
              } catch (error) {
                console.error("Firebase Auth/Firestore Error:", error);
              }
            };
          </script>
          </body>
        `);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated with Auth, Trial, and Redirect Listener: ' + filePath);
      }
    }
  });
}

walkDir(__dirname);