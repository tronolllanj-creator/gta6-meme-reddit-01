/**
 * GTA 6 Release Delay Meme Generator
 * Creates a deterministic 1080x1080 SVG meme
 * Features make.fun ghost mascot in synthwave style
 * No external dependencies or runtime network calls
 * Output: meme.svg and POST.json in OUTPUT_DIR
 * Part 1: Scene setup (sky, sun, skyline, palms)
 */
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot'; // tuned
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output'; // tuned

function sky() {
  return `
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a0533" />
      <stop offset="50%" stop-color="#7b2d8b" />
      <stop offset="85%" stop-color="#ff7a18" />
      <stop offset="95%" stop-color="#ffd166" />
    </linearGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(#skyGrad)" />`;
}

function sun() {
  const slits = [];
  for (let i = 0; i < 5; i++) {
    const y = 690 + i * 20;
    const width = 420 - i * 30;
    const x = 540 - width / 2;
    slits.push(`<rect x="${x}" y="${y}" width="${width}" height="6" fill="#1a0533" />`);
  }
  return `
  <circle cx="540" cy="620" r="210" fill="#ffdf6b" />
  ${slits.join('\n  ')}`;
}

function skyline() {
  let buildings = '';
  let windows = '';
  const positions = [100, 250, 400, 600, 750, 900];
  const heights = [120, 80, 150, 100, 130, 90];
  
  positions.forEach((x, i) => {
    const h = heights[i];
    const y = 760 - h;
    const w = i % 2 === 0 ? 90 : 70;
    buildings += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#160a2e" />`;
    
    for (let wy = y + 20; wy < 740; wy += 30) {
      for (let wx = x + 15; wx < x + w - 15; wx += 20) {
        if ((wx * 7 + wy * 13) % 5 === 0) {
          windows += `<rect x="${wx}" y="${wy}" width="8" height="12" fill="#ffd166" />`;
        }
      }
    }
  });
  
  return `
  ${buildings}
  ${windows}`;
}

function palms() {
  return `
  <g id="leftPalm" fill="#0d0618">
    <path d="Q 300 900 320 950 Q 340 980 350 1080 L 360 1080 Q 350 980 330 950 Q 310 900 310 850 Q 320 800 350 750 L 370 750 Q 340 800 330 850 Q 330 900 310 950 Q 290 900 290 850 Z" />
    <path d="M 350 750 Q 400 700 450 680 Q 400 690 350 750 Z" />
    <path d="M 350 750 Q 380 680 400 620 Q 370 670 350 750 Z" />
    <path d="M 350 750 Q 350 670 360 600 Q 340 660 350 750 Z" />
    <path d="M 350 750 Q 320 680 300 620 Q 330 670 350 750 Z" />
    <path d="M 350 750 Q 300 700 250 680 Q 300 690 350 750 Z" />
    <path d="M 350 750 Q 370 720 390 740 Q 360 730 350 750 Z" />
  </g>
  <g id="rightPalm" fill="#0d0618">
    <path d="Q 800 880 820 930 Q 840 970 850 1080 L 860 1080 Q 850 970 830 930 Q 810 880 810 830 Q 820 780 850 730 L 870 730 Q 840 780 830 830 Q 830 880 810 930 Q 790 880 790 830 Z" />
    <path d="M 850 730 Q 900 680 950 660 Q 900 670 850 730 Z" />
    <path d="M 850 730 Q 880 660 900 600 Q 870 650 850 730 Z" />
    <path d="M 850 730 Q 850 650 860 580 Q 840 640 850 730 Z" />
    <path d="M 850 730 Q 820 660 800 600 Q 830 650 850 730 Z" />
    <path d="M 850 730 Q 800 680 750 660 Q 800 670 850 730 Z" />
    <path d="M 850 730 Q 870 700 890 720 Q 860 710 850 730 Z" />
  </g>`;
}
function ghost() {
  return `
  <path d="M 630 480 L 630 420 A 70 70 0 0 1 770 420 L 770 480 Q 752 452 735 480 Q 717 452 700 480 Q 682 452 665 480 Q 647 452 630 480 Z" fill="#ffffff" stroke="#d9c8ff" stroke-width="4"/>
  <path d="M 670 400 L 675 390 L 680 400 L 690 405 L 680 410 L 675 420 L 670 410 L 660 405 Z" fill="#1a0533"/>
  <path d="M 730 400 L 735 390 L 740 400 L 750 405 L 740 410 L 735 420 L 730 410 L 720 405 Z" fill="#1a0533"/>
  <path d="M 690 415 Q 700 425 710 415" stroke="#1a0533" stroke-width="2" fill="none"/>
  <circle cx="760" cy="470" r="42" fill="#ff2d78"/>
  <path d="M 760 435 L 768 455 L 790 455 L 772 468 L 780 490 L 760 478 L 740 490 L 748 468 L 730 455 L 752 455 Z" fill="#ffd166"/>
`;
}

function captions() {
  return `
  <text x="540" y="120" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="92" fill="#ffffff" stroke="#1a0533" stroke-width="10" paint-order="stroke" text-anchor="middle">WAITED 13 YEARS</text>
  <text x="540" y="215" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="92" fill="#ffffff" stroke="#1a0533" stroke-width="10" paint-order="stroke" text-anchor="middle">FOR GTA 6</text>
  <text x="540" y="955" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="64" fill="#ffffff" stroke="#1a0533" stroke-width="6" paint-order="stroke" text-anchor="middle">MY AGENT GOT PAID</text>
  <text x="540" y="1035" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="64" fill="#ff5da2" stroke="#1a0533" stroke-width="6" paint-order="stroke" text-anchor="middle">ON MAKE.FUN</text>
`;
}

function buildMemeSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
<defs>
  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1a0533"/>
    <stop offset="50%" stop-color="#7b2d8b"/>
    <stop offset="80%" stop-color="#ff7a18"/>
    <stop offset="100%" stop-color="#ffd166"/>
  </linearGradient>
</defs>
<rect width="1080" height="1080" fill="url(#skyGrad)"/>
<circle cx="540" cy="620" r="210" fill="#ffdf6b"/>
<rect x="330" y="680" width="420" height="10" fill="#1a0533"/>
<rect x="330" y="710" width="420" height="12" fill="#1a0533"/>
<rect x="330" y="740" width="420" height="14" fill="#1a0533"/>
<rect x="330" y="770" width="420" height="16" fill="#1a0533"/>
<rect x="330" y="800" width="420" height="18" fill="#1a0533"/>
<rect x="0" y="760" width="1080" height="100" fill="#1b2a6b"/>
<line x1="100" y1="800" x2="300" y2="800" stroke="#ff9e5e" stroke-width="2"/>
<line x1="700" y1="820" x2="900" y2="820" stroke="#ff9e5e" stroke-width="2"/>
<line x1="400" y1="840" x2="600" y2="840" stroke="#ff9e5e" stroke-width="2"/>
<rect x="0" y="860" width="1080" height="220" fill="#2a1a4a"/>
<line x1="0" y1="860" x2="1080" y2="860" stroke="#ffd166" stroke-width="2"/>
<path d="M 150 860 Q 140 700 180 600" stroke="#0d0618" stroke-width="12" fill="none"/>
<path d="M 180 600 Q 220 580 260 600" stroke="#0d0618" stroke-width="8" fill="none"/>
<path d="M 180 600 Q 200 550 240 560" stroke="#0d0618" stroke-width="8" fill="none"/>
<path d="M 180 600 Q 180 540 210 530" stroke="#0d0618" stroke-width="8" fill="none"/>
<path d="M 180 600 Q 150 540 130 550" stroke="#0d0618" stroke-width="8" fill="none"/>
<path d="M 180 600 Q 140 560 110 580" stroke="#0d0618" stroke-width="8" fill="none"/>
<path d="M 180 600 Q 120 590 90 620" stroke="#0d0618" stroke-width="8" fill="none"/>
<path d="M 180 600 Q 160 520 180 500" stroke="#0d0618" stroke-width="8" fill="none"/>
<path d="M 930 860 Q 940 700 900 600" stroke="#0d0618" stroke-width="12" fill="none"/>
<path d="M 900 600 Q 860 580 820 600" stroke="#0d0618" stroke-width="8" fill="none"/>
<path d="M 900 600 Q 880 550 840 560" stroke="#0d0618" stroke-width="8" fill="none"/>
<path d="M 900 600 Q 900 540 870 530" stroke="#0d0618" stroke-width="8" fill="none"/>
<path d="M 900 600 Q 930 540 950 550" stroke="#0d0618" stroke-width="8" fill="none"/>
<path d="M 900 600 Q 940 560 970 580" stroke="#0d0618" stroke-width="8" fill="none"/>
<path d="M 900 600 Q 960 590 990 620" stroke="#0d0618" stroke-width="8" fill="none"/>
<path d="M 900 600 Q 920 520 900 500" stroke="#0d0618" stroke-width="8" fill="none"/>
<rect x="50" y="640" width="40" height="120" fill="#160a2e"/>
<rect x="100" y="680" width="30" height="80" fill="#160a2e"/>
<rect x="150" y="620" width="50" height="140" fill="#160a2e"/>
<rect x="220" y="700" width="20" height="60" fill="#160a2e"/>
<rect x="260" y="650" width="40" height="110" fill="#160a2e"/>
<rect x="320" y="610" width="30" height="150" fill="#160a2e"/>
<rect x="380" y="690" width="25" height="70" fill="#160a2e"/>
<rect x="430" y="630" width="45" height="130" fill="#160a2e"/>
<rect x="500" y="670" width="35" height="90" fill="#160a2e"/>
<rect x="560" y="620" width="20" height="140" fill="#160a2e"/>
<rect x="620" y="680" width="40" height="80" fill="#160a2e"/>
<rect x="700" y="640" width="30" height="120" fill="#160a2e"/>
<rect x="760" y="610" width="50" height="150" fill="#160a2e"/>
<rect x="840" y="690" width="25" height="70" fill="#160a2e"/>
<rect x="900" y="630" width="40" height="130" fill="#160a2e"/>
<rect x="970" y="670" width="30" height="90" fill="#160a2e"/>
<rect x="1020" y="650" width="40" height="110" fill="#160a2e"/>
<rect x="60" y="660" width="4" height="4" fill="#ffd166"/>
<rect x="70" y="680" width="4" height="4" fill="#ffd166"/>
<rect x="60" y="700" width="4" height="4" fill="#ffd166"/>
<rect x="110" y="700" width="4" height="4" fill="#ffd166"/>
<rect x="160" y="640" width="4" height="4" fill="#ffd166"/>
<rect x="170" y="660" width="4" height="4" fill="#ffd166"/>
<rect x="160" y="680" width="4" height="4" fill="#ffd166"/>
<rect x="180" y="640" width="4" height="4" fill="#ffd166"/>
<rect x="270" y="670" width="4" height="4" fill="#ffd166"/>
<rect x="280" y="690" width="4" height="4" fill="#ffd166"/>
<rect x="330" y="630" width="4" height="4" fill="#ffd166"/>
<rect x="340" y="650" width="4" height="4" fill="#ffd166"/>
<rect x="330" y="670" width="4" height="4" fill="#ffd166"/>
<rect x="350" y="630" width="4" height="4" fill="#ffd166"/>
<rect x="440" y="650" width="4" height="4" fill="#ffd166"/>
<rect x="450" y="670" width="4" height="4" fill="#ffd166"/>
<rect x="440" y="690" width="4" height="4" fill="#ffd166"/>
<rect x="570" y="640" width="4" height="4" fill="#ffd166"/>
<rect x="580" y="660" width="4" height="4" fill="#ffd166"/>
<rect x="630" y="700" width="4" height="4" fill="#ffd166"/>
<rect x="710" y="660" width="4" height="4" fill="#ffd166"/>
<rect x="720" y="680" width="4" height="4" fill="#ffd166"/>
<rect x="770" y="630" width="4" height="4" fill="#ffd166"/>
<rect x="780" y="650" width="4" height="4" fill="#ffd166"/>
<rect x="770" y="670" width="4" height="4" fill="#ffd166"/>
<rect x="790" y="630" width="4" height="4" fill="#ffd166"/>
<rect x="910" y="650" width="4" height="4" fill="#ffd166"/>
<rect x="920" y="670" width="4" height="4" fill="#ffd166"/>
<rect x="910" y="690" width="4" height="4" fill="#ffd166"/>
<rect x="1030" y="670" width="4" height="4" fill="#ffd166"/>
<rect x="1040" y="690" width="4" height="4" fill="#ffd166"/>
${ghost()}
${captions()}
</svg>`;
}

function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  try {
    copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
  } catch (e) {
    console.error('Failed to copy POST.json:', e.message);
    process.exit(1);
  }
  writeFileSync(join(OUTPUT_DIR, 'meme.svg'), buildMemeSvg(), 'utf8'); // tuned
}

main();