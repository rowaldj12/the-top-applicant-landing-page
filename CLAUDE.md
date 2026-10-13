# The Top Applicant Group, Inc. - Landing Page

## What this app does
ATS-optimized resume builder and career intelligence platform for job seekers. The app serves marketing landing pages, interactive tools (quiz), blog articles about ATS systems, and converts visitors to paid subscriptions ($29/mo or $149 lifetime).

## Stack
Static HTML/CSS/JS + Firebase (Firestore & Auth) + Stripe Checkout + GitHub Pages Deployment

## Directory map
- `/` — Root directory containing all static HTML pages (index, blog, quiz, ATS guides)
- `firebase-app.js` — Core client-side logic for Analytics, Email Capture, and Stripe Checkout
- `assets/` or `images/` — Static images and branding assets

## Database & Backend (Firebase)
Serverless architecture using Firebase. 
- **Database:** Firestore (`customers`, `subscriptions`, `page_events`, `subscribers`)
- **Auth:** Firebase Anonymous Auth (to bridge users to Stripe)
- **Payments:** Firebase Stripe Extension (webhooks handled automatically by Firebase Cloud Functions)

## External integrations
- Stripe (direct payment links via Firebase Extension)
- Meta Pixel (fbq tracking) for conversion analytics
- Google Fonts (Space Grotesk, DM Sans)
- IndexNow for sitemap ping

## Recent changes
- [Add today's date]: Migrated landing page architecture to static HTML hosted on GitHub Pages. Replaced Node.js/Express/PostgreSQL backend with serverless Firebase Client SDK. Consolidated all analytics, email capture, and Stripe checkout logic into a single `firebase-app.js` module. Removed all legacy Polsia dependencies and APIs.