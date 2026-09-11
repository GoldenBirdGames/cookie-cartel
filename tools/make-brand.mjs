/**
 * Cookie Cartel — brand marks, packaging and merch.
 *
 * Note on type: these files are consumed with <img>, which does NOT pull in the
 * page's webfonts. Every label therefore names a locally-available condensed
 * stack and is sized to still fit its plate in the widest fallback.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../assets/img');
mkdirSync(OUT, { recursive: true });
const w = (name, svg) => writeFileSync(resolve(OUT, name), svg.trim() + '\n');

const DISPLAY = "Impact, Haettenschweiler, 'Arial Narrow', 'DejaVu Sans Condensed', sans-serif";
const BODY = "'DejaVu Sans Condensed', 'Arial Narrow', Verdana, sans-serif";
const GOLD = '#F2B705';
const GOLD_HI = '#FFD75E';
const INK = '#0B0906';
const HAT = '#1F1913';
const CREAM = '#F8EFDD';
const RED = '#C8102E';

/* ---------------- the boss: a cookie in a fedora ---------------- */
function kingpinCookie(scale = 1) {
  return `<g transform="scale(${scale})">
    <circle cx="0" cy="10" r="54" fill="#2A1509"/>
    <circle cx="0" cy="8" r="50" fill="#7C5330"/>
    <circle cx="-5" cy="4" r="42" fill="#8E6237" opacity=".5"/>
    <circle cx="-22" cy="0" r="8" fill="#2A1509"/>
    <circle cx="20" cy="16" r="7" fill="#2A1509"/>
    <circle cx="-12" cy="32" r="6" fill="#2A1509"/>
    <circle cx="28" cy="-8" r="5.5" fill="#2A1509"/>
    <circle cx="6" cy="44" r="4.5" fill="#2A1509"/>
    <!-- shades -->
    <path d="M -40 2 H 40 V 9 H -40 Z" fill="${INK}"/>
    <rect x="-38" y="6" width="32" height="21" rx="8" fill="${INK}"/>
    <rect x="6" y="6" width="32" height="21" rx="8" fill="${INK}"/>
    <path d="M -34 11 l 10 0 l -10 13 z" fill="#FFFFFF" opacity=".38"/>
    <path d="M 10 11 l 10 0 l -10 13 z" fill="#FFFFFF" opacity=".38"/>
    <!-- fedora: charcoal with a gold band so it reads against a black plate -->
    <ellipse cx="0" cy="-28" rx="66" ry="13.5" fill="${HAT}" stroke="${GOLD}" stroke-width="2.5"/>
    <path d="M -39 -31 C -39 -66 -27 -77 0 -77 C 27 -77 39 -66 39 -31 Z" fill="${HAT}" stroke="${GOLD}" stroke-width="2.5"/>
    <path d="M -39 -42 H 39 V -31 H -39 Z" fill="${GOLD}"/>
    <path d="M -3 -75 C -16 -71 -24 -61 -26 -46" stroke="#000" stroke-width="4" fill="none" opacity=".35"/>
    <!-- cigar -->
    <g transform="rotate(-12)">
      <rect x="30" y="30" width="46" height="12" rx="6" fill="#4A2C18"/>
      <rect x="64" y="30" width="14" height="12" rx="5" fill="#B8B3A8"/>
      <circle cx="84" cy="36" r="3.6" fill="${RED}"/>
    </g>
  </g>`;
}

/* ---------------- primary logo: sealed emblem ---------------- */
w('logo-emblem.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420" role="img" aria-label="Cookie Cartel">
  <defs>
    <!-- left-to-right over the top -->
    <path id="arcTop" d="M 62 210 A 148 148 0 0 1 358 210" fill="none"/>
    <!-- left-to-right under the bottom, so the letters stay upright -->
    <path id="arcBot" d="M 62 210 A 148 148 0 0 0 358 210" fill="none"/>
    <linearGradient id="goldRing" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${GOLD_HI}"/>
      <stop offset="50%" stop-color="${GOLD}"/>
      <stop offset="100%" stop-color="#B07F02"/>
    </linearGradient>
  </defs>
  <circle cx="210" cy="210" r="204" fill="url(#goldRing)"/>
  <circle cx="210" cy="210" r="192" fill="${INK}"/>
  <circle cx="210" cy="210" r="186" fill="none" stroke="${GOLD}" stroke-width="3" stroke-dasharray="10 8"/>
  <text font-family=${JSON.stringify(DISPLAY)} font-size="36" fill="${GOLD}" letter-spacing="4">
    <textPath href="#arcTop" startOffset="50%" text-anchor="middle">COOKIE CARTEL</textPath>
  </text>
  <text font-family=${JSON.stringify(DISPLAY)} font-size="22" fill="${CREAM}" letter-spacing="4">
    <textPath href="#arcBot" startOffset="50%" text-anchor="middle">BAKED FRESH ON ORDER</textPath>
  </text>
  <g transform="translate(210 218)">${kingpinCookie(1.05)}</g>
  <g fill="${GOLD}">
    <path d="M 44 236 l 5 11 12 1 -9 8 3 12 -11 -6 -11 6 3 -12 -9 -8 12 -1 z"/>
    <path d="M 376 236 l 5 11 12 1 -9 8 3 12 -11 -6 -11 6 3 -12 -9 -8 12 -1 z"/>
  </g>
</svg>`);

/* compact, text-free mark for the sticky header */
w('logo-mark.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="Cookie Cartel">
  <circle cx="100" cy="100" r="98" fill="${GOLD}"/>
  <circle cx="100" cy="100" r="88" fill="${INK}"/>
  <circle cx="100" cy="100" r="82" fill="none" stroke="${GOLD}" stroke-width="2" stroke-dasharray="7 6"/>
  <g transform="translate(100 108)">${kingpinCookie(0.86)}</g>
</svg>`);

w('favicon.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="32" fill="${GOLD}"/>
  <circle cx="32" cy="32" r="27" fill="${INK}"/>
  <circle cx="32" cy="36" r="16" fill="#7C5330"/>
  <circle cx="26" cy="32" r="3.2" fill="#2A1509"/><circle cx="38" cy="40" r="2.8" fill="#2A1509"/>
  <circle cx="39" cy="29" r="2.2" fill="#2A1509"/><circle cx="28" cy="44" r="2.4" fill="#2A1509"/>
  <rect x="22" y="30" width="9" height="6" rx="2.5" fill="${INK}"/>
  <rect x="34" y="30" width="9" height="6" rx="2.5" fill="${INK}"/>
  <ellipse cx="32" cy="23" rx="24" ry="5" fill="${HAT}"/>
  <path d="M 18 22 C 18 10 24 6 32 6 C 40 6 46 10 46 22 Z" fill="${HAT}"/>
  <path d="M 18 18 H 46 V 22 H 18 Z" fill="${GOLD}"/>
</svg>`);

/* ---------------- packaging: the tins ---------------- */
function tin({ lidTop, lidSide, label, sub, contents }) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img">
  <defs>
    <linearGradient id="tinMetal" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#181411"/><stop offset="16%" stop-color="#4A4038"/>
      <stop offset="38%" stop-color="#7D6F60"/><stop offset="58%" stop-color="#39312A"/>
      <stop offset="80%" stop-color="#544940"/><stop offset="100%" stop-color="#141110"/>
    </linearGradient>
    <linearGradient id="lidMetal" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${lidSide}"/><stop offset="42%" stop-color="${lidTop}"/>
      <stop offset="100%" stop-color="${lidSide}"/>
    </linearGradient>
    <filter id="tinShadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="12"/></filter>
  </defs>
  <ellipse cx="206" cy="340" rx="146" ry="24" fill="#000" opacity=".5" filter="url(#tinShadow)"/>
  ${contents}
  <!-- body -->
  <path d="M 62 168 H 338 V 300 A 138 32 0 0 1 62 300 Z" fill="url(#tinMetal)"/>
  <ellipse cx="200" cy="168" rx="138" ry="32" fill="#0D0B09"/>
  <ellipse cx="200" cy="168" rx="138" ry="32" fill="none" stroke="${GOLD}" stroke-width="3" opacity=".85"/>
  <path d="M 62 300 A 138 32 0 0 0 338 300" fill="none" stroke="${GOLD}" stroke-width="2.5" opacity=".5"/>
  <rect x="62" y="176" width="276" height="7" fill="#fff" opacity=".1"/>
  <!-- gold label band -->
  <rect x="62" y="208" width="276" height="62" fill="${GOLD}"/>
  <rect x="62" y="208" width="276" height="62" fill="url(#tinMetal)" opacity=".1"/>
  <text x="200" y="240" text-anchor="middle" font-family=${JSON.stringify(DISPLAY)} font-size="30" fill="${INK}" letter-spacing="1.5">${label}</text>
  <text x="200" y="259" text-anchor="middle" font-family=${JSON.stringify(BODY)} font-size="9.5" fill="${INK}" letter-spacing="1.6" opacity=".85">${sub}</text>
  <!-- lid, tipped up behind the tin -->
  <g transform="translate(300 104) rotate(16)">
    <ellipse rx="86" ry="24" fill="url(#lidMetal)"/>
    <ellipse rx="86" ry="24" fill="none" stroke="${GOLD}" stroke-width="3.5"/>
    <ellipse rx="66" ry="16" fill="none" stroke="${GOLD}" stroke-width="1.6" opacity=".7" stroke-dasharray="7 6"/>
    <text y="6" text-anchor="middle" font-family=${JSON.stringify(DISPLAY)} font-size="17" fill="${GOLD}" letter-spacing="2.5">CARTEL</text>
  </g>
</svg>`;
}

w('tin-cartel.svg', tin({
  lidTop: '#332C26', lidSide: '#0E0B09',
  label: 'THE CARTEL TIN', sub: '600 G · MILK CHOC · WAFFLE · SEA SALT',
  contents: `<g>
    <ellipse cx="128" cy="136" rx="56" ry="18" fill="#5A3A20"/>
    <ellipse cx="128" cy="124" rx="56" ry="18" fill="#8A5F36"/>
    <circle cx="106" cy="118" r="7" fill="#2A1509"/><circle cx="146" cy="128" r="6" fill="#2A1509"/>
    <circle cx="128" cy="136" r="5" fill="#2A1509"/>
    <ellipse cx="204" cy="128" rx="50" ry="16" fill="#452716"/>
    <ellipse cx="204" cy="116" rx="50" ry="16" fill="#7C5330"/>
    <circle cx="188" cy="111" r="6" fill="#26140A"/><circle cx="220" cy="120" r="5" fill="#26140A"/>
  </g>`,
}));

w('tin-brookie.svg', tin({
  lidTop: '#33231A', lidSide: '#0B0705',
  label: 'THE BROOKIE TIN', sub: '600 G · FUDGE BROWNIE · COOKIE DOUGH',
  contents: `<g>
    <rect x="88" y="104" width="92" height="38" rx="6" fill="#2E1809"/>
    <rect x="88" y="94" width="92" height="32" rx="6" fill="#47240F"/>
    <rect x="88" y="94" width="92" height="9" rx="4.5" fill="#66391C"/>
    <circle cx="112" cy="110" r="5" fill="#22110A"/><circle cx="152" cy="114" r="4.4" fill="#22110A"/>
    <ellipse cx="220" cy="130" rx="52" ry="17" fill="#452716"/>
    <ellipse cx="220" cy="118" rx="52" ry="17" fill="#7C5330"/>
    <circle cx="202" cy="113" r="6" fill="#26140A"/><circle cx="236" cy="122" r="5" fill="#26140A"/>
  </g>`,
}));

/* ---------------- merch ---------------- */
function mug(bodyFill, rimFill, printFill, rimLight) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img">
  <defs><filter id="mugShadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter></defs>
  <ellipse cx="205" cy="330" rx="112" ry="20" fill="#000" opacity=".5" filter="url(#mugShadow)"/>
  <path d="M 292 154 h 20 a 50 50 0 0 1 0 100 h -20" fill="none" stroke="${bodyFill}" stroke-width="27"/>
  <path d="M 292 154 h 20 a 50 50 0 0 1 0 100 h -20" fill="none" stroke="${rimLight}" stroke-width="3" opacity=".5"/>
  <path d="M 98 120 H 296 V 290 A 99 27 0 0 1 98 290 Z" fill="${bodyFill}"/>
  <path d="M 98 120 H 138 V 293 A 99 27 0 0 1 98 290 Z" fill="#fff" opacity=".09"/>
  <path d="M 284 120 H 296 V 290 A 99 27 0 0 1 282 296 Z" fill="${rimLight}" opacity=".35"/>
  <ellipse cx="197" cy="120" rx="99" ry="27" fill="${rimFill}"/>
  <ellipse cx="197" cy="120" rx="99" ry="27" fill="none" stroke="${rimLight}" stroke-width="2" opacity=".6"/>
  <ellipse cx="197" cy="121" rx="82" ry="21" fill="#1B1410"/>
  <ellipse cx="197" cy="124" rx="76" ry="18" fill="#3E2617"/>
  <g transform="translate(197 216)">
    <circle r="52" fill="none" stroke="${printFill}" stroke-width="3"/>
    <circle r="43" fill="none" stroke="${printFill}" stroke-width="1.4" stroke-dasharray="6 5"/>
    <text y="-8" text-anchor="middle" font-family=${JSON.stringify(DISPLAY)} font-size="21" fill="${printFill}" letter-spacing="1">COOKIE</text>
    <text y="14" text-anchor="middle" font-family=${JSON.stringify(DISPLAY)} font-size="21" fill="${printFill}" letter-spacing="1">CARTEL</text>
    <text y="32" text-anchor="middle" font-family=${JSON.stringify(BODY)} font-size="8" fill="${printFill}" letter-spacing="2">EST. 2020</text>
  </g>
</svg>`;
}
w('merch-mug-black.svg', mug('#15110E', '#241D18', GOLD, '#6D625A'));
w('merch-mug-white.svg', mug('#F4EFE6', '#FFFFFF', '#15110E', '#FFFFFF'));

w('merch-cap.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img">
  <defs>
    <filter id="capShadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>
    <pattern id="mesh" width="9" height="9" patternUnits="userSpaceOnUse">
      <rect width="9" height="9" fill="#F4EFE6"/>
      <path d="M 0 0 H 9 M 0 0 V 9" stroke="#D5CCBC" stroke-width="1"/>
    </pattern>
  </defs>
  <ellipse cx="206" cy="300" rx="140" ry="18" fill="#000" opacity=".45" filter="url(#capShadow)"/>
  <!-- crown, seen from the side -->
  <path d="M 62 254 C 62 160 104 112 176 112 C 248 112 286 162 288 254 Z" fill="url(#mesh)"/>
  <path d="M 176 112 C 232 112 272 160 276 254 L 176 254 Z" fill="#E6DECE" opacity=".75"/>
  <path d="M 176 112 C 120 112 78 162 74 254 L 176 254 Z" fill="#FFFFFF" opacity=".45"/>
  <path d="M 176 112 C 150 118 134 168 132 254" stroke="#D5CCBC" stroke-width="2.5" fill="none" opacity=".8"/>
  <path d="M 176 112 C 202 118 220 168 222 254" stroke="#D5CCBC" stroke-width="2.5" fill="none" opacity=".8"/>
  <circle cx="176" cy="108" r="9" fill="#EDE6D6"/>
  <!-- brim, projecting forward -->
  <path d="M 268 244 C 312 240 356 254 366 274 C 372 288 348 296 312 294
           C 282 292 266 278 264 258 Z" fill="#E4DCCB"/>
  <path d="M 268 244 C 312 240 356 254 366 274 C 356 262 314 252 266 256 Z" fill="#FFFFFF" opacity=".55"/>
  <path d="M 62 250 C 120 240 230 240 280 250 L 280 262 C 230 252 120 252 62 262 Z" fill="#0B0906" opacity=".13"/>
  <g transform="translate(168 190)">
    <circle r="46" fill="${INK}"/>
    <circle r="46" fill="none" stroke="${GOLD}" stroke-width="3"/>
    <text y="-4" text-anchor="middle" font-family=${JSON.stringify(DISPLAY)} font-size="20" fill="${GOLD}" letter-spacing="1">EL JEFE</text>
    <text y="16" text-anchor="middle" font-family=${JSON.stringify(BODY)} font-size="7.5" fill="${CREAM}" letter-spacing="1.4">COOKIE CARTEL</text>
  </g>
</svg>`);

/* founder's bundle — a crate of contraband */
w('bundle-founder.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img">
  <defs><filter id="crateShadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="11"/></filter></defs>
  <ellipse cx="206" cy="332" rx="146" ry="22" fill="#000" opacity=".5" filter="url(#crateShadow)"/>
  <g>
    <ellipse cx="126" cy="162" rx="58" ry="18" fill="#452716"/>
    <ellipse cx="126" cy="148" rx="58" ry="18" fill="#7C5330"/>
    <circle cx="104" cy="142" r="7" fill="#26140A"/><circle cx="146" cy="152" r="6" fill="#26140A"/>
    <circle cx="126" cy="160" r="5" fill="#26140A"/>
    <ellipse cx="256" cy="158" rx="54" ry="17" fill="#8E5A21"/>
    <ellipse cx="256" cy="144" rx="54" ry="17" fill="#D19A4E"/>
    <circle cx="236" cy="138" r="6.4" fill="#3E2415"/><circle cx="272" cy="148" r="5.4" fill="#3E2415"/>
  </g>
  <path d="M 58 176 H 342 V 308 H 58 Z" fill="#432D18"/>
  <path d="M 58 176 H 342 V 198 H 58 Z" fill="#5C3F21"/>
  <path d="M 58 176 L 342 308 M 342 176 L 58 308" stroke="#2E1E0F" stroke-width="8" opacity=".4"/>
  <path d="M 58 222 H 342 V 234 H 58 Z" fill="#2E1E0F" opacity=".6"/>
  <path d="M 58 272 H 342 V 284 H 58 Z" fill="#2E1E0F" opacity=".6"/>
  <rect x="124" y="228" width="152" height="52" rx="4" fill="${GOLD}"/>
  <text x="200" y="252" text-anchor="middle" font-family=${JSON.stringify(DISPLAY)} font-size="22" fill="${INK}" letter-spacing="1">EL JEFE</text>
  <text x="200" y="270" text-anchor="middle" font-family=${JSON.stringify(BODY)} font-size="9" fill="${INK}" letter-spacing="1.5">FOUNDER'S BUNDLE</text>
</svg>`);

/* paper grain laid over the whole page */
w('grain.svg', `
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">
  <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="4" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/></filter>
  <rect width="240" height="240" filter="url(#g)" opacity=".55"/>
</svg>`);

console.log('brand marks written');
