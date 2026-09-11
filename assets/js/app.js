/* ==========================================================================
   COOKIE CARTEL — front of house
   ========================================================================== */
(() => {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const DATA = window.CARTEL || { products: [], filters: [], reviews: [], faqs: [] };
  const CALM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const money = (n) => '₹' + n.toLocaleString('en-IN');

  /* ===================== 1. the logo popup on first paint ================= */
  function boot() {
    const stage = $('.boot');
    if (!stage) return;

    // split the wordmark so each letter can pop in on its own beat
    const word = $('.boot-word');
    if (word) {
      const text = word.textContent.trim();
      word.textContent = '';
      [...text].forEach((ch, i) => {
        const s = document.createElement('span');
        s.textContent = ch === ' ' ? ' ' : ch;
        s.style.setProperty('--i', i);
        word.append(s);
      });
    }

    const open = () => {
      document.body.classList.add('booted');
      document.body.classList.remove('locked');
      setTimeout(() => stage.remove(), 1400);
    };

    document.body.classList.add('locked');
    if (CALM) { open(); return; }
    // hold the stamp long enough to read it, but never past the load event
    const minimum = new Promise((r) => setTimeout(r, 2100));
    const loaded = new Promise((r) => (document.readyState === 'complete' ? r() : addEventListener('load', r)));
    Promise.all([minimum, loaded]).then(open);
  }

  /* ========================= 2. the gold cursor =========================== */
  function cursor() {
    if (CALM || matchMedia('(hover: none)').matches) return;
    const dot = $('.cursor-dot'), ring = $('.cursor-ring');
    if (!dot || !ring) return;

    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    }, { passive: true });

    (function trail() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(trail);
    })();

    const HOT = 'a, button, summary, .card, input, .chip';
    addEventListener('pointerover', (e) => {
      document.body.classList.toggle('cursor-hot', !!e.target.closest(HOT));
    });
  }

  /* ================= 3. scroll: progress, header, back-to-top ============= */
  function scrollFx() {
    const bar = $('.progress'), top = $('.totop');
    const onScroll = () => {
      const y = scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      document.body.classList.toggle('scrolled', y > 40);
      if (top) top.classList.toggle('on', y > 700);
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    top?.addEventListener('click', () => scrollTo({ top: 0, behavior: CALM ? 'auto' : 'smooth' }));
  }

  /* ======================== 4. reveal on scroll =========================== */
  function reveals() {
    const items = $$('[data-reveal]');
    if (!items.length) return;
    if (CALM) { items.forEach((el) => el.classList.add('seen')); return; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('seen');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    items.forEach((el) => io.observe(el));
  }

  /* ===================== 5. seamless marquee looping ====================== */
  function marquees() {
    $$('.marquee').forEach((m) => {
      const track = m.firstElementChild;
      if (!track) return;
      m.append(track.cloneNode(true)); // the loop needs an identical second pass
    });
  }

  /* ====================== 6. the cart, kept on device ===================== */
  const KEY = 'cookie-cartel-cart';
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch { cart = []; }

  const saveCart = () => {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch { /* private mode */ }
  };
  const findProduct = (id) => DATA.products.find((p) => p.id === id);
  const cartCount = () => cart.reduce((n, l) => n + l.qty, 0);

  /** 15% comes off automatically once the order hits 7 items. */
  function totals() {
    const subtotal = cart.reduce((sum, l) => sum + (findProduct(l.id)?.price || 0) * l.qty, 0);
    const count = cartCount();
    const discount = count >= 7 ? Math.round(subtotal * 0.15) : 0;
    return { subtotal, discount, count, grand: subtotal - discount };
  }

  function paintCount() {
    const el = $('.cart-count');
    if (!el) return;
    const n = cartCount();
    el.textContent = n;
    el.classList.toggle('on', n > 0);
    el.classList.remove('bump');
    void el.offsetWidth;          // restart the pop
    if (n > 0) el.classList.add('bump');
  }

  function paintCart() {
    const body = $('.drawer-body'), foot = $('.drawer-foot');
    if (!body) return;

    if (!cart.length) {
      body.innerHTML = `
        <div class="drawer-empty">
          <img src="assets/img/logo-mark.svg" alt="">
          <p><b>Nothing stashed yet.</b></p>
          <p>The line-up is waiting downstairs.</p>
        </div>`;
      if (foot) foot.innerHTML = `<a class="btn btn-ghost btn-block" href="shop.html">Browse the line-up</a>`;
      paintCount();
      return;
    }

    body.innerHTML = cart.map((line) => {
      const p = findProduct(line.id);
      if (!p) return '';
      return `
        <div class="line" data-line="${p.id}">
          <div class="line-img"><img src="${p.img}" alt=""></div>
          <div>
            <b>${p.name}</b>
            <small>${p.weight} · ${money(p.price)}</small>
            <div class="qty">
              <button data-step="-1" aria-label="One fewer ${p.name}">−</button>
              <span>${line.qty}</span>
              <button data-step="1" aria-label="One more ${p.name}">+</button>
            </div>
          </div>
          <div style="text-align:right">
            <div class="line-price">${money(p.price * line.qty)}</div>
            <button class="line-kill" data-kill>Remove</button>
          </div>
        </div>`;
    }).join('');

    const t = totals();
    if (foot) {
      foot.innerHTML = `
        <div class="total-row"><span>Subtotal (${t.count} item${t.count > 1 ? 's' : ''})</span><span>${money(t.subtotal)}</span></div>
        ${t.discount
          ? `<div class="total-row save"><span>Cartel discount · 15%</span><span>−${money(t.discount)}</span></div>`
          : `<div class="total-row" style="color:var(--cream-dim)"><span>Add ${7 - t.count} more for 15% off</span><span></span></div>`}
        <div class="total-row"><span>Shipping</span><span>Calculated at checkout</span></div>
        <div class="total-row grand"><span>Total</span><span>${money(t.grand)}</span></div>
        <button class="btn btn-block" data-checkout>Run the delivery</button>`;
    }
    paintCount();
  }

  function addToCart(id, qty = 1) {
    const line = cart.find((l) => l.id === id);
    if (line) line.qty += qty;
    else cart.push({ id, qty });
    saveCart();
    paintCart();
  }

  /* ---- the cookie that flies into the cart, plus a burst of crumbs ---- */
  function flyToCart(fromEl, src) {
    const target = $('.cart-btn');
    if (!target || !fromEl || CALM) return;

    const a = fromEl.getBoundingClientRect();
    const b = target.getBoundingClientRect();

    const ghost = document.createElement('img');
    ghost.src = src;
    ghost.className = 'fly';
    ghost.alt = '';
    ghost.style.left = `${a.left + a.width / 2 - 39}px`;
    ghost.style.top = `${a.top + a.height / 2 - 39}px`;
    document.body.append(ghost);

    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);

    ghost.animate([
      { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 130}px) scale(.75) rotate(220deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(.12) rotate(420deg)`, opacity: 0 },
    ], { duration: 850, easing: 'cubic-bezier(.5,0,.75,0)' }).onfinish = () => ghost.remove();

    burst(a.left + a.width / 2, a.top + a.height / 2);
  }

  function burst(x, y, count = 16) {
    if (CALM) return;
    const shades = ['#7C5330', '#452716', '#F2B705', '#2A1509', '#C58C42'];
    for (let i = 0; i < count; i++) {
      const c = document.createElement('i');
      c.className = 'crumb';
      const size = 3 + Math.random() * 7;
      c.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${shades[i % shades.length]}`;
      document.body.append(c);

      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 150;
      c.animate([
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(angle) * dist - 50}%, ${Math.sin(angle) * dist + 140}%) scale(.2) rotate(${Math.random() * 540}deg)`, opacity: 0 },
      ], { duration: 700 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = () => c.remove();
    }
  }

  /* -------------------------- the drawer itself ------------------------- */
  function drawer() {
    const panel = $('.drawer'), scrim = $('.scrim');
    const openCart  = () => { panel?.classList.add('on'); scrim?.classList.add('on'); };
    const closeCart = () => {
      panel?.classList.remove('on');
      scrim?.classList.remove('on');
      $('.nav')?.classList.remove('on');
      document.body.classList.remove('nav-open');
    };

    $('.cart-btn')?.addEventListener('click', openCart);
    $('[data-close-cart]')?.addEventListener('click', closeCart);
    scrim?.addEventListener('click', closeCart);
    addEventListener('keydown', (e) => e.key === 'Escape' && closeCart());

    // quantity, removal and checkout all live inside the drawer
    panel?.addEventListener('click', (e) => {
      const row = e.target.closest('[data-line]');
      if (row) {
        const id = row.dataset.line;
        const line = cart.find((l) => l.id === id);
        if (!line) return;

        if (e.target.closest('[data-kill]')) {
          cart = cart.filter((l) => l.id !== id);
        } else {
          const step = Number(e.target.closest('[data-step]')?.dataset.step || 0);
          if (!step) return;
          line.qty += step;
          if (line.qty < 1) cart = cart.filter((l) => l.id !== id);
        }
        saveCart();
        paintCart();
        return;
      }

      if (e.target.closest('[data-checkout]')) {
        toast('Checkout is a demo — nothing was charged 🍪');
      }
    });

    return { openCart, closeCart };
  }

  /* ============================== 7. toasts ============================== */
  function toast(message) {
    const host = $('.toasts');
    if (!host) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.innerHTML = `<span aria-hidden="true">🍪</span><span>${message}</span>`;
    host.append(el);
    while (host.children.length > 3) host.firstElementChild.remove();
    setTimeout(() => {
      el.classList.add('out');
      el.addEventListener('animationend', () => el.remove(), { once: true });
    }, 2800);
  }

  /* ====================== 8. the line-up, rendered ======================== */
  function cardHTML(p, i) {
    const tags = (p.tags || []).map((t) => {
      const kind = t === 'Best Seller' ? '' : t === 'New' ? ' free' : '';
      return `<span class="tag${kind}">${t}</span>`;
    }).join('');
    const eggless = p.cats.includes('eggless')
      ? '<span class="tag free">Eggless</span>'
      : p.cats.includes('egg') ? '<span class="tag egg">Contains Egg</span>' : '';

    return `
      <article class="card" data-cats="${p.cats.join(' ')}" style="animation-delay:${Math.min(i, 8) * 60}ms">
        <div class="card-media">
          <div class="badge-row">${tags}${eggless}</div>
          <span class="stamp">Wanted</span>
          <img src="${p.img}" alt="${p.name}" loading="lazy" width="400" height="400">
        </div>
        <div class="rating"><b>★ ${p.rating.toFixed(1)}</b><span>(${p.votes})</span></div>
        <h3>${p.name}<span class="wt">${p.weight}</span></h3>
        <p class="card-charge">${p.charge}</p>
        <div class="card-foot">
          <span class="price">${money(p.price)}${p.was ? `<s>${money(p.was)}</s>` : ''}</span>
          <button class="btn btn-sm" data-add="${p.id}">Add</button>
        </div>
      </article>`;
  }

  function lineup() {
    const grid = $('#lineup');
    if (!grid) return;

    const limit = Number(grid.dataset.limit || 0);
    const only = grid.dataset.only;
    let list = DATA.products;
    if (only) list = list.filter((p) => p.cats.includes(only));
    if (limit) list = list.slice(0, limit);

    const render = (items) => {
      grid.innerHTML = items.map(cardHTML).join('');
      tilt();
    };

    // links can arrive pre-filtered, e.g. shop.html?c=merch
    const wanted = new URLSearchParams(location.search).get('c');
    const preset = DATA.filters.some((f) => f.id === wanted) ? wanted : null;
    if (preset && preset !== 'all') list = DATA.products.filter((p) => p.cats.includes(preset));
    render(list);

    // filter chips
    const bar = $('#filters');
    if (bar) {
      bar.innerHTML = DATA.filters.map((f, i) =>
        `<button class="chip" data-filter="${f.id}" aria-pressed="${preset ? f.id === preset : i === 0}">${f.label}</button>`).join('');

      bar.addEventListener('click', (e) => {
        const chip = e.target.closest('[data-filter]');
        if (!chip) return;
        $$('.chip', bar).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        const id = chip.dataset.filter;
        render(id === 'all' ? DATA.products : DATA.products.filter((p) => p.cats.includes(id)));
      });
    }

    // one handler covers every Add button, now and after re-render
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-add]');
      if (!btn) return;
      const p = findProduct(btn.dataset.add);
      if (!p) return;
      addToCart(p.id);
      flyToCart(btn.closest('.card')?.querySelector('.card-media img'), p.img);
      toast(`${p.name} stashed in the bag`);
    });
  }

  /* ---- cards tip toward the pointer and catch a gold sheen ---- */
  function tilt() {
    if (CALM || matchMedia('(hover: none)').matches) return;
    $$('.card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
        card.style.transform =
          `perspective(900px) rotateX(${(0.5 - py) * 9}deg) rotateY(${(px - 0.5) * 11}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ================= 9. reviews, faqs and counters ======================= */
  function reviews() {
    const host = $('#reviews');
    if (!host) return;
    host.innerHTML = DATA.reviews.map((r, i) => `
      <article class="review" data-reveal style="--rd:${i * 80}ms">
        <div class="stars">${'★'.repeat(r.stars)}</div>
        <p>${r.text}</p>
        <footer>
          <span class="avatar">${r.name[0]}</span>
          <span><b>${r.name}</b><span>${r.city} · Verified buyer</span></span>
        </footer>
      </article>`).join('');
  }

  function faqs() {
    const host = $('#faqs');
    if (!host) return;
    host.innerHTML = DATA.faqs.map((f, i) => `
      <details class="qa"${i === 0 ? ' open' : ''}>
        <summary class="qa-q">${f.q}<span class="sign-ico" aria-hidden="true"></span></summary>
        <div class="qa-a">${f.a}</div>
      </details>`).join('');

    // keep the accordion to one open answer at a time
    host.addEventListener('toggle', (e) => {
      const opened = e.target;
      if (!opened.open) return;
      $$('details.qa', host).forEach((d) => { if (d !== opened) d.open = false; });
    }, true);
  }

  function counters() {
    const nums = $$('[data-count]');
    if (!nums.length) return;
    if (CALM) { nums.forEach((el) => (el.textContent = el.dataset.count)); return; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        io.unobserve(el);
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const started = performance.now();
        const tick = (now) => {
          const t = Math.min((now - started) / 1400, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased).toLocaleString('en-IN') + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });

    nums.forEach((el) => io.observe(el));
  }

  /* ================== 10. hero parallax and magnetism ==================== */
  function parallax() {
    const stage = $('.hero-stage');
    if (!stage || CALM || matchMedia('(hover: none)').matches) return;
    const layers = $$('[data-depth]', stage);

    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach((el) => {
        const d = Number(el.dataset.depth);
        el.style.translate = `${px * d * 44}px ${py * d * 44}px`;
      });
    });
    stage.addEventListener('pointerleave', () => layers.forEach((el) => (el.style.translate = '')));
  }

  function magnets() {
    if (CALM || matchMedia('(hover: none)').matches) return;
    $$('[data-magnet]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.26}px ${(e.clientY - r.top - r.height / 2) * 0.4}px`;
      });
      el.addEventListener('pointerleave', () => { el.style.translate = ''; });
    });
  }

  /* ======================= 11. odds and ends ============================= */
  function nav() {
    const menu = $('.nav'), burger = $('.burger'), scrim = $('.scrim');
    const setNav = (open) => {
      menu?.classList.toggle('on', open);
      scrim?.classList.toggle('on', open);
      document.body.classList.toggle('nav-open', open);
      burger?.setAttribute('aria-expanded', String(open));
    };

    burger?.addEventListener('click', () => setNav(!menu.classList.contains('on')));
    $$('.nav a').forEach((a) => a.addEventListener('click', () => setNav(false)));
    $('[data-close-nav]')?.addEventListener('click', () => setNav(false));
    scrim?.addEventListener('click', () => setNav(false));
    addEventListener('keydown', (e) => e.key === 'Escape' && setNav(false));
  }

  function newsletter() {
    $('.join-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('input', e.currentTarget);
      if (!input.value.trim()) return;
      burst(innerWidth / 2, innerHeight * 0.55, 26);
      toast('You are on the inside now. Welcome to the Cartel.');
      input.value = '';
    });
  }

  /** Tap the emblem and the ceiling gives way. */
  function cookieRain() {
    const trigger = $('[data-rain]');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      if (CALM) { toast('It is raining cookies. Trust us.'); return; }
      const art = DATA.products.filter((p) => p.cats.includes('cookies')).map((p) => p.img);
      for (let i = 0; i < 24; i++) {
        const img = document.createElement('img');
        img.src = art[i % art.length];
        img.className = 'fly';
        img.alt = '';
        const size = 40 + Math.random() * 60;
        img.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}vw;top:-120px`;
        document.body.append(img);
        img.animate([
          { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
          { transform: `translateY(${innerHeight + 260}px) rotate(${(Math.random() - 0.5) * 900}deg)`, opacity: .9 },
        ], { duration: 1800 + Math.random() * 1800, delay: Math.random() * 700, easing: 'cubic-bezier(.3,0,.7,1)' })
          .onfinish = () => img.remove();
      }
      toast('Fresh batch incoming!');
    });
  }

  /* ============================== wire it up ============================= */
  function init() {
    boot();
    cursor();
    scrollFx();
    marquees();
    lineup();
    reviews();
    faqs();
    drawer();
    paintCart();
    counters();
    parallax();
    magnets();
    nav();
    newsletter();
    cookieRain();
    reveals();   // last, so freshly rendered nodes are picked up
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
