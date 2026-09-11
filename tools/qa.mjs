import { chromium } from 'playwright';
const OUT = '/tmp/claude-0/-home-user-cookie-cartel/7b6bf257-258b-5354-afd1-06f71c0424b2/scratchpad';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const errors = [];

async function page(w, h) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  p.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
  p.on('console', (m) => m.type() === 'error' && errors.push(`[console] ${m.text()}`));
  p.on('requestfailed', (r) => errors.push(`[404?] ${r.url()} — ${r.failure()?.errorText}`));
  return p;
}

/* 1. the logo popup, caught mid-stamp */
let p = await page(1440, 900);
await p.goto('http://localhost:8899/index.html');
await p.waitForTimeout(900);
await p.screenshot({ path: `${OUT}/qa-boot.png` });

/* 2. add three cookies, then open the bag */
await p.waitForTimeout(2600);
await p.locator('[data-add]').first().click();
await p.waitForTimeout(400);
await p.locator('[data-add]').nth(1).click();
await p.waitForTimeout(400);
await p.locator('[data-add]').nth(1).click();
await p.waitForTimeout(500);
const count = await p.locator('.cart-count').textContent();
await p.locator('.cart-btn').click();
await p.waitForTimeout(800);
await p.screenshot({ path: `${OUT}/qa-cart.png` });

/* 3. the 15% threshold at 7 items */
await p.locator('[data-close-cart]').click();
await p.waitForTimeout(400);
for (let i = 0; i < 5; i++) { await p.locator('[data-add]').nth(2).click(); await p.waitForTimeout(120); }
await p.locator('.cart-btn').click();
await p.waitForTimeout(700);
const discount = await p.locator('.total-row.save').count();
await p.screenshot({ path: `${OUT}/qa-cart-discount.png` });
await p.close();

/* 4. phone */
p = await page(390, 844);
await p.goto('http://localhost:8899/index.html');
await p.waitForTimeout(3200);
await p.screenshot({ path: `${OUT}/qa-mobile.png` });
await p.locator('.burger').click();
await p.waitForTimeout(700);
await p.screenshot({ path: `${OUT}/qa-mobile-nav.png` });
await p.close();

/* 5. the shop page grid + filters */
p = await page(1440, 900);
await p.goto('http://localhost:8899/shop.html');
await p.waitForTimeout(3000);
const before = await p.locator('.card').count();
await p.locator('[data-filter="merch"]').click();
await p.waitForTimeout(600);
const after = await p.locator('.card').count();
await p.evaluate(() => scrollTo(0, 700));
await p.waitForTimeout(700);
await p.screenshot({ path: `${OUT}/qa-shop.png` });
await p.close();

console.log(JSON.stringify({ cartCount: count, discountRowShown: discount, allCards: before, merchCards: after, errors }, null, 2));
await b.close();
