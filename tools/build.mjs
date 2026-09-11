/** Stitches src/pages/*.html together with the shared partials. */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const part = (name) => readFileSync(resolve(root, 'src/partials', `${name}.html`), 'utf8').trimEnd();
const partials = Object.fromEntries(
  readdirSync(resolve(root, 'src/partials')).map((f) => [basename(f, '.html'), part(basename(f, '.html'))])
);

for (const file of readdirSync(resolve(root, 'src/pages'))) {
  const page = basename(file, '.html');
  let html = readFileSync(resolve(root, 'src/pages', file), 'utf8');

  html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in partials)) throw new Error(`${file}: unknown partial {{${key}}}`);
    return partials[key];
  });

  // mark the nav link for the page we are on
  const active = { index: 'index.html', shop: 'shop.html', about: 'about.html', faq: 'faq.html' }[page];
  if (active && page !== 'index') {
    html = html.replace(`<a href="${active}">`, `<a href="${active}" aria-current="page">`);
  }

  writeFileSync(resolve(root, `${page}.html`), html);
  console.log(`built ${page}.html`);
}
