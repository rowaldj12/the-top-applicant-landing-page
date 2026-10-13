/**
 * One-off script: generates the quiz OG share image at 2x density (2400x1260px).
 * SVG viewBox stays 1200x630 for coordinate simplicity; output PNG is 2x for crisp
 * rendering on high-DPI screens and Facebook/Twitter feeds.
 * Outputs to public/images/quiz-og.png for static serving.
 *
 * Usage: node scripts/generate-og-image.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// SVG logical dimensions (viewBox)
const SVG_WIDTH = 1200;
const SVG_HEIGHT = 630;
// Output PNG at 2x for crisp rendering
const OUT_WIDTH = 2400;
const OUT_HEIGHT = 1260;

function buildSvg() {
  // Matches quiz page dark theme: --dark-bg: #0c0c0e, --gold: #c8a84e, --red: #e8412a
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${OUT_WIDTH}" height="${OUT_HEIGHT}" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}">
  <defs>
    <!-- Dark radial gradient background -->
    <radialGradient id="bg" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#1a1a1e"/>
      <stop offset="100%" stop-color="#0c0c0e"/>
    </radialGradient>

    <!-- Subtle scan-line overlay -->
    <pattern id="scanlines" patternUnits="userSpaceOnUse" width="4" height="4">
      <rect width="4" height="2" fill="rgba(255,255,255,0.015)"/>
    </pattern>

    <!-- Gold accent glow -->
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c8a84e" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#c8a84e" stop-opacity="0"/>
    </radialGradient>

    <!-- Red accent glow (bottom right) -->
    <radialGradient id="redglow" cx="80%" cy="70%" r="40%">
      <stop offset="0%" stop-color="#e8412a" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#e8412a" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${SVG_WIDTH}" height="${SVG_HEIGHT}" fill="url(#bg)"/>
  <rect width="${SVG_WIDTH}" height="${SVG_HEIGHT}" fill="url(#scanlines)"/>
  <rect width="${SVG_WIDTH}" height="${SVG_HEIGHT}" fill="url(#glow)"/>
  <rect width="${SVG_WIDTH}" height="${SVG_HEIGHT}" fill="url(#redglow)"/>

  <!-- Decorative geometric lines (circuit/data aesthetic) -->
  <line x1="80" y1="0" x2="80" y2="${SVG_HEIGHT}" stroke="#c8a84e" stroke-opacity="0.06" stroke-width="1"/>
  <line x1="1120" y1="0" x2="1120" y2="${SVG_HEIGHT}" stroke="#c8a84e" stroke-opacity="0.06" stroke-width="1"/>
  <line x1="0" y1="100" x2="${SVG_WIDTH}" y2="100" stroke="#c8a84e" stroke-opacity="0.04" stroke-width="1"/>
  <line x1="0" y1="530" x2="${SVG_WIDTH}" y2="530" stroke="#c8a84e" stroke-opacity="0.04" stroke-width="1"/>

  <!-- Corner accents -->
  <rect x="60" y="80" width="30" height="2" fill="#c8a84e" opacity="0.3"/>
  <rect x="60" y="80" width="2" height="30" fill="#c8a84e" opacity="0.3"/>
  <rect x="1110" y="80" width="30" height="2" fill="#c8a84e" opacity="0.3"/>
  <rect x="1138" y="80" width="2" height="30" fill="#c8a84e" opacity="0.3"/>
  <rect x="60" y="548" width="30" height="2" fill="#e8412a" opacity="0.2"/>
  <rect x="60" y="520" width="2" height="30" fill="#e8412a" opacity="0.2"/>
  <rect x="1110" y="548" width="30" height="2" fill="#e8412a" opacity="0.2"/>
  <rect x="1138" y="520" width="2" height="30" fill="#e8412a" opacity="0.2"/>

  <!-- Small decorative dots (data nodes) -->
  <circle cx="120" cy="160" r="3" fill="#c8a84e" opacity="0.15"/>
  <circle cx="160" cy="180" r="2" fill="#c8a84e" opacity="0.1"/>
  <circle cx="1060" cy="440" r="3" fill="#e8412a" opacity="0.12"/>
  <circle cx="1090" cy="470" r="2" fill="#e8412a" opacity="0.08"/>

  <!-- Section label -->
  <text x="600" y="180" text-anchor="middle"
        font-family="DejaVu Sans, sans-serif"
        font-size="16" font-weight="600" letter-spacing="4"
        fill="#c8a84e" opacity="0.8">
    FREE QUIZ · 5 QUESTIONS · 2 MINUTES
  </text>

  <!-- Main headline line 1 -->
  <text x="600" y="270" text-anchor="middle"
        font-family="DejaVu Sans, sans-serif"
        font-size="52" font-weight="800" letter-spacing="-1"
        fill="#faf9f7">
    Which Applicant Tracking System
  </text>

  <!-- Main headline line 2 — "Assassinated" in red -->
  <text x="600" y="340" text-anchor="middle"
        font-family="DejaVu Sans, sans-serif"
        font-size="52" font-weight="800" letter-spacing="-1">
    <tspan fill="#e8412a">Assassinated</tspan>
    <tspan fill="#faf9f7"> Your Resume?</tspan>
  </text>

  <!-- Thin divider line -->
  <line x1="500" y1="380" x2="700" y2="380" stroke="#c8a84e" stroke-opacity="0.3" stroke-width="1.5"/>

  <!-- Subtext -->
  <text x="600" y="420" text-anchor="middle"
        font-family="DejaVu Sans, sans-serif"
        font-size="20" font-weight="400"
        fill="#8a8884">
    Five questions. Uncomfortably accurate results.
  </text>

  <!-- Stats row -->
  <text x="330" y="490" text-anchor="middle"
        font-family="DejaVu Sans, sans-serif"
        font-size="28" font-weight="700"
        fill="#c8a84e">
    0.002s
  </text>
  <text x="330" y="512" text-anchor="middle"
        font-family="DejaVu Sans, sans-serif"
        font-size="12" font-weight="400"
        fill="#8a8884">
    avg ATS review time
  </text>

  <text x="600" y="490" text-anchor="middle"
        font-family="DejaVu Sans, sans-serif"
        font-size="28" font-weight="700"
        fill="#c8a84e">
    75%
  </text>
  <text x="600" y="512" text-anchor="middle"
        font-family="DejaVu Sans, sans-serif"
        font-size="12" font-weight="400"
        fill="#8a8884">
    rejected before a human sees them
  </text>

  <text x="870" y="490" text-anchor="middle"
        font-family="DejaVu Sans, sans-serif"
        font-size="28" font-weight="700"
        fill="#c8a84e">
    $0
  </text>
  <text x="870" y="512" text-anchor="middle"
        font-family="DejaVu Sans, sans-serif"
        font-size="12" font-weight="400"
        fill="#8a8884">
    the ATS paid for your effort
  </text>

  <!-- Brand -->
  <text x="600" y="580" text-anchor="middle"
        font-family="DejaVu Sans, sans-serif"
        font-size="18" font-weight="700" letter-spacing="0.5">
    <tspan fill="#c8a84e">The Top </tspan>
    <tspan fill="#faf9f7" opacity="0.6">Applicant</tspan>
  </text>
</svg>`;
}

async function main() {
  const outDir = path.join(__dirname, '..', 'public', 'images');
  const outPath = path.join(outDir, 'quiz-og.png');

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('Building SVG...');
  const svg = buildSvg();

  console.log(`Converting SVG to PNG (${OUT_WIDTH}x${OUT_HEIGHT}, 2x density)...`);
  const pngBuffer = await sharp(Buffer.from(svg), { density: 144 })
    .resize(OUT_WIDTH, OUT_HEIGHT)
    .png({ compressionLevel: 6 })
    .toBuffer();

  fs.writeFileSync(outPath, pngBuffer);
  console.log(`PNG saved: ${outPath} (${(pngBuffer.length / 1024).toFixed(1)} KB)`);
}

main().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
