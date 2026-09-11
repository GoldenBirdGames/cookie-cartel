/**
 * Cookie Cartel — parametric artwork generator.
 * Draws every cookie, tin, merch item and brand mark as a standalone SVG so the
 * site ships with zero binary assets and stays crisp at any size.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../assets/img');
mkdirSync(OUT, { recursive: true });

/* ---------- deterministic randomness so every rebuild looks identical ---------- */
function rng(seed) {
  let h = 2166136261 >>> 0;
  for (const ch of String(seed)) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return () => {
    h ^= h << 13; h >>>= 0;
    h ^= h >> 17;
    h ^= h << 5; h >>>= 0;
    return h / 4294967296;
  };
}
const n = (v) => Math.round(v * 100) / 100;
const between = (r, lo, hi) => lo + r() * (hi - lo);

/* A craggy closed blob — the silhouette of a hand-torn NY style cookie. */
function blob(cx, cy, radius, points, wobble, r) {
  const pts = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const rad = radius * (1 + between(r, -wobble, wobble));
    pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
  }
  let d = `M ${n(pts[0][0])} ${n(pts[0][1])}`;
  for (let i = 0; i < pts.length; i++) {
    const cur = pts[i];
    const next = pts[(i + 1) % pts.length];
    const mid = [(cur[0] + next[0]) / 2, (cur[1] + next[1]) / 2];
    d += ` Q ${n(cur[0])} ${n(cur[1])} ${n(mid[0])} ${n(mid[1])}`;
  }
  return d + ' Z';
}

/* ---------- chunk vocabulary: the things stuffed into the dough ---------- */
function chocChunk(x, y, size, rot, top, side) {
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(rot)})">
    <path d="M ${-size} ${-size * 0.72} L ${size * 0.86} ${-size} L ${size} ${size * 0.7} L ${-size * 0.8} ${size * 0.9} Z" fill="${side}"/>
    <path d="M ${-size * 0.82} ${-size * 0.55} L ${size * 0.7} ${-size * 0.8} L ${size * 0.8} ${size * 0.42} L ${-size * 0.62} ${size * 0.6} Z" fill="${top}"/>
  </g>`;
}
function saltFlake(x, y, s, rot) {
  return `<path d="M ${n(x)} ${n(y - s)} L ${n(x + s * 0.8)} ${n(y)} L ${n(x)} ${n(y + s)} L ${n(x - s * 0.8)} ${n(y)} Z"
    fill="#FFFDF5" opacity=".92" transform="rotate(${n(rot)} ${n(x)} ${n(y)})"/>`;
}
function crumb(x, y, s, fill, op) {
  return `<circle cx="${n(x)}" cy="${n(y)}" r="${n(s)}" fill="${fill}" opacity="${op}"/>`;
}

/**
 * A full cookie portrait.
 * dough  : [outer, mid, inner] baked-tone ramp
 * ooze   : [fill, gloss] molten centre
 * chunks : array of [topFace, sideFace] pairs scattered through the dough
 * extras : 'salt' | 'coconut' | 'peanut' | 'oreo' | 'waffle'
 */
function cookie({ seed, dough, ooze, chunks, extras = [], oozeSize = 1 }) {
  const r = rng(seed);
  const cx = 200, cy = 200;
  const body = blob(cx, cy, 150, 16, 0.055, r);
  const rim = blob(cx, cy, 138, 15, 0.05, r);
  const inner = blob(cx, cy, 112, 14, 0.06, r);

  let parts = '';

  /* molten centre */
  const oz = blob(cx, cy + 4, 62 * oozeSize, 12, 0.16, r);
  const ozGloss = blob(cx - 12, cy - 10, 30 * oozeSize, 10, 0.2, r);
  parts += `<path d="${oz}" fill="${ooze[0]}"/>`;
  parts += `<path d="${oz}" fill="url(#oozeShade-${seed})" opacity=".55"/>`;
  parts += `<path d="${ozGloss}" fill="${ooze[1]}" opacity=".65"/>`;

  /* dough cracks radiating out of the centre */
  let cracks = '';
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + between(r, -0.3, 0.3);
    const r0 = between(r, 66, 78) * oozeSize;
    const r1 = between(r, 112, 140);
    const mx = cx + Math.cos(a + 0.22) * ((r0 + r1) / 2);
    const my = cy + Math.sin(a + 0.22) * ((r0 + r1) / 2);
    cracks += `<path d="M ${n(cx + Math.cos(a) * r0)} ${n(cy + Math.sin(a) * r0)}
      Q ${n(mx)} ${n(my)} ${n(cx + Math.cos(a) * r1)} ${n(cy + Math.sin(a) * r1)}"
      stroke="${dough[2]}" stroke-width="${n(between(r, 3, 7))}" fill="none" stroke-linecap="round" opacity=".7"/>`;
  }

  /* chunks pushed through the surface, avoiding the molten centre */
  let studs = '';
  for (let i = 0; i < 22; i++) {
    const a = r() * Math.PI * 2;
    const d = between(r, 74 * oozeSize, 142);
    const x = cx + Math.cos(a) * d;
    const y = cy + Math.sin(a) * d;
    const pair = chunks[Math.floor(r() * chunks.length)];
    studs += chocChunk(x, y, between(r, 9, 17), between(r, 0, 360), pair[0], pair[1]);
  }

  /* garnish */
  let garnish = '';
  if (extras.includes('salt')) {
    for (let i = 0; i < 14; i++) {
      const a = r() * Math.PI * 2, d = between(r, 40, 140);
      garnish += saltFlake(cx + Math.cos(a) * d, cy + Math.sin(a) * d, between(r, 2.5, 5), between(r, 0, 90));
    }
  }
  if (extras.includes('coconut')) {
    for (let i = 0; i < 30; i++) {
      const a = r() * Math.PI * 2, d = between(r, 45, 145);
      const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
      garnish += `<rect x="${n(x)}" y="${n(y)}" width="${n(between(r, 10, 20))}" height="3.4" rx="1.7"
        fill="#FFF6E2" opacity=".9" transform="rotate(${n(between(r, 0, 360))} ${n(x)} ${n(y)})"/>`;
    }
  }
  if (extras.includes('peanut')) {
    for (let i = 0; i < 12; i++) {
      const a = r() * Math.PI * 2, d = between(r, 60, 138);
      const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
      garnish += `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(between(r, 0, 360))})">
        <ellipse rx="11" ry="7" fill="#D9A05B"/><ellipse rx="9" ry="5.4" fill="#E8BC7C"/>
        <ellipse cx="-3.4" rx="3" ry="4.4" fill="#C98F45" opacity=".55"/></g>`;
    }
  }
  if (extras.includes('oreo')) {
    for (let i = 0; i < 9; i++) {
      const a = r() * Math.PI * 2, d = between(r, 62, 138);
      const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
      const s = between(r, 10, 15);
      garnish += `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(between(r, 0, 360))})">
        <rect x="${n(-s)}" y="${n(-s * 0.8)}" width="${n(s * 2)}" height="${n(s * 1.6)}" rx="3" fill="#1B1614"/>
        <rect x="${n(-s)}" y="${n(-s * 0.16)}" width="${n(s * 2)}" height="${n(s * 0.42)}" fill="#FBF4E4"/></g>`;
    }
  }
  if (extras.includes('waffle')) {
    for (let i = 0; i < 10; i++) {
      const a = r() * Math.PI * 2, d = between(r, 60, 140);
      const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
      const s = between(r, 11, 16);
      garnish += `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(between(r, 0, 360))})" opacity=".95">
        <rect x="${n(-s)}" y="${n(-s * 0.7)}" width="${n(s * 2)}" height="${n(s * 1.4)}" rx="2" fill="#C88A3E"/>
        <path d="M ${n(-s)} 0 H ${n(s)} M 0 ${n(-s * 0.7)} V ${n(s * 0.7)}" stroke="#9A6326" stroke-width="2.4"/></g>`;
    }
  }

  /* loose crumbs on the plate */
  let dust = '';
  for (let i = 0; i < 16; i++) {
    const a = r() * Math.PI * 2, d = between(r, 152, 186);
    dust += crumb(cx + Math.cos(a) * d, cy + Math.sin(a) * d, between(r, 1.6, 4.6), dough[2], between(r, 0.3, 0.75));
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img">
  <defs>
    <radialGradient id="bake-${seed}" cx="42%" cy="36%" r="72%">
      <stop offset="0%" stop-color="${dough[0]}"/>
      <stop offset="58%" stop-color="${dough[1]}"/>
      <stop offset="100%" stop-color="${dough[2]}"/>
    </radialGradient>
    <radialGradient id="oozeShade-${seed}" cx="38%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#fff" stop-opacity=".35"/>
      <stop offset="65%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity=".45"/>
    </radialGradient>
    <filter id="soft-${seed}" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="9"/>
    </filter>
  </defs>
  ${dust}
  <path d="${body}" transform="translate(7 13)" fill="#000" opacity=".38" filter="url(#soft-${seed})"/>
  <path d="${body}" fill="${dough[2]}"/>
  <path d="${rim}" fill="url(#bake-${seed})"/>
  <path d="${inner}" fill="${dough[0]}" opacity=".34"/>
  ${cracks}
  ${parts}
  ${studs}
  ${garnish}
</svg>`;
}

/* ---------- the menu ---------- */
const MENU = [
  { id: 'notorious-blackie', dough: ['#6A4426', '#452716', '#2A1509'], ooze: ['#6E3C17', '#C0803F'],
    chunks: [['#5B3A22', '#331D0F'], ['#7A4A28', '#4A2915']], extras: ['salt'] },

  { id: 'el-chappo', dough: ['#F0C177', '#D79B4C', '#A96F2C'], ooze: ['#C87A2C', '#F0B662'],
    chunks: [['#FFF3D6', '#E4CFA4'], ['#D89A4E', '#A96F2C']], extras: ['salt'] },

  { id: 'the-godfather', dough: ['#E2AE68', '#C2873F', '#8E5A21'], ooze: ['#D08A2E', '#F3C070'],
    chunks: [['#4A2C18', '#27140A'], ['#6B3F20', '#3A2010']], extras: ['peanut'] },

  { id: 'pablo-the-og', dough: ['#EBB96F', '#CE9145', '#96622A'], ooze: ['#3B2110', '#7A4A24'],
    chunks: [['#3E2415', '#22110A'], ['#FFF4DC', '#DCC69A']], extras: [] },

  { id: 'scarface', dough: ['#53321C', '#331C0E', '#1D0E06'], ooze: ['#C07A22', '#F2BC63'],
    chunks: [['#4A2A18', '#241209'], ['#6B3E20', '#381D0E']], extras: ['salt'], oozeSize: 1.12 },

  { id: 'griseldas-red-velvet', dough: ['#C0342F', '#96231F', '#671411'], ooze: ['#5E3216', '#A9703A'],
    chunks: [['#FFF3D9', '#E0CBA0'], ['#1B1614', '#0D0A09']], extras: ['oreo'] },

  { id: 'coco-cubano', dough: ['#EFC183', '#D29B53', '#9C6828'], ooze: ['#C8802F', '#F2BE6E'],
    chunks: [['#4A2C18', '#27140A'], ['#FFF6E2', '#DFCBA4']], extras: ['coconut'], oozeSize: 1.08 },

  { id: 'don-snickero', dough: ['#7A5028', '#4E2E15', '#2E1808'], ooze: ['#C67F2A', '#EFBB64'],
    chunks: [['#4A2C18', '#27140A'], ['#8A5A2E', '#4F3017']], extras: ['peanut'] },

  { id: 'the-cartel-tin-cookie', dough: ['#E9B86E', '#CB8F45', '#94602A'], ooze: ['#7A4A1E', '#C08A46'],
    chunks: [['#4A2C18', '#27140A'], ['#C88A3E', '#9A6326']], extras: ['waffle', 'salt'] },

  { id: 'the-brookie', dough: ['#4A2B18', '#2E1809', '#190C04'], ooze: ['#3B2110', '#8A5628'],
    chunks: [['#3E2415', '#22110A'], ['#E9B86E', '#B07C36']], extras: ['salt'] },
];

for (const m of MENU) {
  writeFileSync(resolve(OUT, `cookie-${m.id}.svg`), cookie({ ...m, seed: m.id, oozeSize: m.oozeSize || 1 }));
}
console.log(`cookies: ${MENU.length}`);
