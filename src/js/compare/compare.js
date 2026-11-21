import { reduceMotion, introDelay } from '../lib/env.js';
import { sleep, money } from '../lib/utils.js';
import { announce } from '../lib/announce.js';
import { vendors, products, stockLabel, stockRank } from './data.js';

const SPRITE_COLUMNS = 5;
const spritePosition = (i) => `${(i * 100) / (SPRITE_COLUMNS - 1)}% 0`;

/**
 * Hero comparison demo.
 * Shows one product at a time, ranks the vendors (in stock first, then by price)
 * and animates rows to their new positions. An autoplay loop "types" each search.
 */
export function initCompare() {
  const card = document.querySelector('.compare');
  const searchEl = card.querySelector('.compare__search');
  const list = document.getElementById('compare-list');
  const nameEl = document.getElementById('compare-name');
  const variantEl = document.getElementById('compare-variant');
  const thumbEl = document.getElementById('compare-thumb');
  const queryEl = document.getElementById('compare-query');
  const summaryEl = document.getElementById('compare-summary');
  const cartBtn = document.getElementById('compare-cart');
  const pauseBtn = document.getElementById('compare-pause');

  // One persistent row per vendor so rows can move between positions
  const rows = {};
  Object.entries(vendors).forEach(([key, vendor]) => {
    const li = document.createElement('li');
    li.className = 'vendor-row';
    li.innerHTML = `
      <span class="vendor">
        <span class="vendor__mark" style="background:${vendor.color}" aria-hidden="true">${key}</span>
        <span class="vendor__name">${vendor.name}</span>
        <span class="vendor__best">Best price</span>
      </span>
      <span class="stock"></span>
      <span class="vendor__price num"><strong></strong><span class="vendor__unit"></span></span>`;
    rows[key] = li;
    list.appendChild(li);
  });

  let current = -1;

  function show(index) {
    if (index === current) return;
    current = index;
    const product = products[index];

    nameEl.textContent = product.name;
    variantEl.textContent = product.variant;
    thumbEl.style.backgroundPosition = spritePosition(product.sprite);
    queryEl.textContent = product.query;

    const ranked = [...product.offers].sort(
      (a, b) =>
        (a[1] === 'out') - (b[1] === 'out') || a[2] - b[2] || stockRank[a[1]] - stockRank[b[1]],
    );
    const bestKey = ranked.find(([, stock]) => stock !== 'out')[0];
    const available = product.offers
      .filter(([, stock]) => stock !== 'out')
      .map(([, , price]) => price);
    const savings = Math.max(...available) - ranked[0][2];

    // FLIP: remember where each row was before reordering
    const before = {};
    Object.entries(rows).forEach(([key, el]) => {
      before[key] = el.getBoundingClientRect().top;
    });

    ranked.forEach(([key, stock, price]) => {
      const row = rows[key];
      row.classList.toggle('is-best', key === bestKey);
      row.classList.toggle('is-out', stock === 'out');
      const badge = row.querySelector('.stock');
      badge.className = `stock stock--${stock}`;
      badge.textContent = stockLabel[stock];
      row.querySelector('strong').textContent = money(price);
      const perUnit = (price / product.units).toFixed(product.units > 99 ? 3 : 2);
      row.querySelector('.vendor__unit').textContent = `$${perUnit} / ${product.unit}`;
      list.appendChild(row);
    });

    summaryEl.innerHTML =
      savings > 0.005
        ? `Best in-stock price saves <strong class="num">${money(savings)}</strong> on this item`
        : `Comparing <strong>4 suppliers</strong> with your clinic's pricing`;
    cartBtn.textContent = 'Add to cart';

    if (!reduceMotion) {
      Object.entries(rows).forEach(([key, el]) => {
        const dy = before[key] - el.getBoundingClientRect().top;
        if (!dy) return;
        el.animate([{ transform: `translateY(${dy}px)` }, { transform: 'translateY(0)' }], {
          duration: 420,
          easing: 'cubic-bezier(.2,.7,.2,1)',
        });
      });
    }
  }

  /* ---------- Autoplay: someone searching ----------
     Backspaces the current query, types the next one with human-ish timing,
     then shows results. Pauses while hovered, focused, off-screen or in a hidden tab,
     and stops for good once the visitor adds something to the cart. */
  let autoplay = !reduceMotion;
  let manualControl = false; // once the pause button is used, hover/focus no longer pause
  const pauses = new Set();

  const setPaused = (reason, on) => {
    if (manualControl && (reason === 'hover' || reason === 'focus')) return;
    if (on) pauses.add(reason);
    else pauses.delete(reason);
  };
  const holdWhilePaused = async () => {
    while (pauses.size && autoplay) await sleep(120);
  };
  const setTyping = (on) => searchEl.classList.toggle('is-typing', on);

  function stopAutoplay() {
    if (!autoplay) return;
    autoplay = false;
    setTyping(false);
    if (current > -1) queryEl.textContent = products[current].query;
  }

  async function typeQuery(text) {
    setTyping(true);
    let query = queryEl.textContent;
    while (query.length) {
      await holdWhilePaused();
      if (!autoplay) return false;
      query = query.slice(0, -1);
      queryEl.textContent = query;
      await sleep(26 + Math.random() * 20);
    }
    await sleep(320);
    for (const ch of text) {
      await holdWhilePaused();
      if (!autoplay) return false;
      query += ch;
      queryEl.textContent = query;
      await sleep(60 + Math.random() * 90 + (ch === ' ' ? 90 : 0));
    }
    setTyping(false);
    return true;
  }

  async function runAutoplay() {
    await sleep(2200 + introDelay);
    while (autoplay) {
      await holdWhilePaused();
      const next = (current + 1) % products.length;
      if (!(await typeQuery(products[next].query))) break;
      await sleep(380); // a beat before results land
      if (!autoplay) break;
      show(next);
      await sleep(3400); // time to read the comparison
    }
  }

  cartBtn.addEventListener('click', () => {
    stopAutoplay();
    const best = list.querySelector('.is-best .vendor__name').textContent;
    cartBtn.textContent = `Added to ${best}`;
    announce(`${nameEl.textContent} added to your ${best} cart.`);
  });

  show(0);

  if (autoplay) {
    pauseBtn.hidden = false;
    pauseBtn.addEventListener('click', () => {
      const pausing = pauseBtn.getAttribute('aria-pressed') !== 'true';
      pauseBtn.setAttribute('aria-pressed', String(pausing));
      manualControl = true;
      pauses.delete('hover');
      pauses.delete('focus');
      setPaused('user', pausing);
      card.classList.toggle('is-paused', pausing);
      setTyping(false);
    });
    card.addEventListener('pointerenter', () => setPaused('hover', true));
    card.addEventListener('pointerleave', () => setPaused('hover', false));
    card.addEventListener('focusin', () => setPaused('focus', true));
    card.addEventListener('focusout', () => setPaused('focus', false));
    document.addEventListener('visibilitychange', () => setPaused('hidden', document.hidden));
    new IntersectionObserver(([entry]) => setPaused('offscreen', !entry.isIntersecting)).observe(
      card,
    );
    runAutoplay();
  }
}
