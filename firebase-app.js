import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, serverTimestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDYieylXKPAcdw4HmmbZdwlfShJXrRM7S4",
  authDomain: "top-applicant-8a716.firebaseapp.com",
  projectId: "top-applicant-8a716",
  storageBucket: "top-applicant-8a716.firebasestorage.app",
  messagingSenderId: "382307733734",
  appId: "1:382307733734:web:8292eb9ace8cb93cde2b27",
  measurementId: "G-9SR8Y80ER0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// 1. STRIPE CHECKOUT
// ==========================================
window.handleCheckout = async function(planType) {
  const priceId = planType === 'monthly' ? 'price_1Sore1K9pHvXlrFKhvKdbxaq' : 'price_1SorVLK9pHvXlrFK85lnsoc2';
  try {
    const userCredential = await signInAnonymously(auth);
    const uid = userCredential.user.uid;
    const checkoutSessionRef = await addDoc(collection(db, `customers/${uid}/checkout_sessions`), {
      price: priceId,
      success_url: window.location.origin + '/?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: window.location.origin + '#pricing',
    });

    onSnapshot(checkoutSessionRef, (snap) => {
      const data = snap.data();
      if (data?.url) window.location.assign(data.url);
      if (data?.error) alert(`Checkout error: ${data.error.message}`);
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    alert("Failed to initialize checkout. Please check your connection.");
  }
};

// ==========================================
// 2. ANALYTICS (Replaces /api/track)
// ==========================================
function sendEventToFirestore(eventType, buttonLabel = '', section = '') {
  const p = new URLSearchParams(window.location.search);
  addDoc(collection(db, 'page_events'), {
    event_type: eventType,
    page_url: window.location.href,
    referrer: document.referrer,
    utm_source: p.get('utm_source') || null,
    utm_medium: p.get('utm_medium') || null,
    utm_campaign: p.get('utm_campaign') || null,
    button_label: buttonLabel,
    section: section,
    timestamp: serverTimestamp()
  }).catch(e => console.error("Analytics error:", e));
}

// Track initial pageview
sendEventToFirestore('pageview');

// Track clicks globally
document.addEventListener('click', function(e) {
  const el = e.target.closest('a[href*="buy.stripe.com"], .nav-cta, .btn-primary, .btn-secondary, .btn-gold, .btn-white');
  if (!el) return;
  const isCheckout = el.hasAttribute('onclick') && el.getAttribute('onclick').includes('handleCheckout');
  sendEventToFirestore(
    isCheckout ? 'checkout_initiated' : 'cta_click', 
    el.textContent.trim().replace(/\s+/g, ' ').slice(0, 50), 
    el.closest('section')?.className || 'unknown'
  );
});

// ==========================================
// 3. EMAIL CAPTURE (Replaces /api/subscribe)
// ==========================================
const subscribeForm = document.getElementById('subscribe-form');
if (subscribeForm) {
  subscribeForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const emailInput = document.getElementById('subscribe-email');
    const msg = document.getElementById('subscribe-msg');
    const btn = document.getElementById('subscribe-btn');
    const email = emailInput.value.trim().toLowerCase();
    
    if (!email) return;
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
      // Save directly to Firestore
      await setDoc(doc(db, 'subscribers', email), {
        email: email,
        source: 'homepage_cheatsheet',
        timestamp: serverTimestamp()
      }, { merge: true });

      sendEventToFirestore('email_capture', 'subscribe_btn', 'homepage_cheatsheet');
      if (typeof fbq === 'function') fbq('track', 'Lead');

      msg.style.color = '#3d7a55'; // green
      msg.textContent = 'Done — check your inbox.';
      emailInput.value = '';
    } catch (err) {
      msg.style.color = '#dc2626'; // red
      msg.textContent = 'Something went wrong. Try again.';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send It →';
    }
  });
}