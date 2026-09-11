# Cookie Cartel

A tribute rebuild of [cookiecartel.in](https://cookiecartel.in/) — the Mumbai/Panchgani outfit
baking chunky, stuffed New York style cookies and shipping them across India.

Dark, gold-leafed and deliberately unapologetic, matching the brand's own stated direction:
*"bold and unapologetic, which sets us apart from the pastel, delicate aesthetics common in
dessert brands."*

## Running it

No build step is required to view the site — every `.html` file at the root is ready to serve.

```bash
npm run dev     # serves the folder on http://localhost:8080
```

To regenerate artwork and re-stitch the pages after editing anything under `src/`:

```bash
npm install     # only needed for the visual QA harness
npm run build   # regenerates SVG artwork, then assembles the pages
npm run qa      # drives the site in a real browser and reports console errors
```

## Layout

```
index.html  shop.html  about.html  faq.html   ← generated, commit these
src/
  pages/       page bodies with {{partial}} slots
  partials/    head, preloader, header, footer + cart drawer
assets/
  css/styles.css   design system and every component
  css/fonts.css    self-hosted @font-face rules
  fonts/           Anton, Permanent Marker, Space Grotesk (woff2, latin)
  js/data.js       the catalogue: products, reviews, FAQs
  js/app.js        preloader, cursor, cart, filters, all motion
  img/             every cookie, tin, mug, cap and brand mark (generated SVG)
tools/
  make-art.mjs     parametric cookie portraits
  make-brand.mjs   logo, packaging, merch
  build.mjs        stitches src/pages + src/partials into the root
  qa.mjs           browser QA pass
```

## Notes on the build

**All artwork is generated SVG.** `tools/make-art.mjs` draws each cookie from a seeded
random walk — a craggy silhouette, a baked-tone gradient, chocolate chunks pushed through the
surface and a molten centre — so every flavour is visually distinct and the whole site ships
without a single raster image. Seeding keeps rebuilds byte-identical.

Those files are consumed with `<img>`, which does **not** load the page's webfonts, so labels
inside the SVGs name a locally-available condensed stack and are sized to still fit in the
widest fallback.

**Fonts are self-hosted** (`assets/fonts/`) rather than pulled from Google, so the type never
waits on a third party and the site works offline.

## What's here

- A logo popup on first paint — the emblem stamps in, the wordmark cascades, shutters slam open
- Custom gold cursor, film grain, scroll progress, scroll-reveal throughout
- Hero with pointer parallax, drifting cookies and a rotating *Certified Contraband* seal
- Mugshot-style product cards: 3D tilt, pointer-tracked sheen, a `WANTED` stamp on hover
- A working bag — persisted to `localStorage`, with the real 15%-off-at-7-items rule, a cookie
  that flies into the cart and a burst of crumbs
- Filterable catalogue, accordion FAQ, animated counters, magnetic buttons
- Tap the hero emblem. It rains.
- Full `prefers-reduced-motion` support; every effect stands down

## Content

Product names, weights, prices, delivery rules, the founder's story and the Shark Tank India
figures are drawn from Cookie Cartel's own public pages and press coverage. Reviews are
representative rather than transcribed, apart from the first, which is quoted from the brand's
reviews page.

This is an independent tribute build for demonstration purposes — not the official store, and
not affiliated with Cookie Cartel. Checkout is inert; nothing is charged.

That provenance is stated in three places so it survives being shared: a ribbon above the header
on every page, a line on the loading screen, and an "About this build" block in the footer that
links back to the real store. Keep all three if you publish this anywhere public.
