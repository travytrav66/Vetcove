import { animationsOn, introDelay } from '../lib/env.js';
import { splitWords } from './split-text.js';
import { countUp } from './count-up.js';

const QUOTE_TILTS = [-2.5, 1.8, -1.2, 2.2, -1.8, 1.4];

/** Gives each child a --i index for staggered CSS transition delays. */
function indexChildren(parentSelector, childSelector) {
  document.querySelectorAll(parentSelector).forEach((parent) => {
    parent.querySelectorAll(childSelector).forEach((child, i) => child.style.setProperty('--i', i));
  });
}

/**
 * Entrance animations.
 * The hero plays as one sequence on load; everything else reveals as it scrolls into view.
 * CSS only hides elements under <html class="anim">, so content is always visible without JS
 * or with reduced motion.
 */
export function initReveal() {
  if (!animationsOn) return;
  const startedAt = performance.now();

  document.querySelectorAll('[data-split]').forEach(splitWords);

  indexChildren('[data-reveal="pop"], [data-reveal="stagger"]', ':scope > *');
  indexChildren('.steps', '.step');
  indexChildren('.features', '.feature');
  indexChildren('.vendors', 'li');
  indexChildren('.trust__inner', 'p, li');
  indexChildren('.hero .compare__list', '.vendor-row');
  document.querySelectorAll('[data-reveal="quote"]').forEach((quote, i) => {
    quote.style.setProperty('--r', `${QUOTE_TILTS[i % QUOTE_TILTS.length]}deg`);
  });

  const reveal = (el) => {
    let delay = Number(el.dataset.delay || 0);
    const elapsed = performance.now() - startedAt;
    if (elapsed < introDelay) delay += introDelay - elapsed; // wait for the loader to clear
    if (el.dataset.loadDelay && elapsed < introDelay + 1200) delay += Number(el.dataset.loadDelay);
    if (el.dataset.reveal === 'quote') {
      // Stagger by column so a row of cards lands left to right
      const column = Math.round(el.getBoundingClientRect().left / (window.innerWidth / 3));
      delay += column * 110;
    }
    el.style.setProperty('--d', `${delay}ms`);
    el.classList.add('is-in');

    if (el.classList.contains('voices__count')) {
      countUp(el.querySelector('.num'), { target: 23000, suffix: '+' });
    }
  };

  const observe = (options) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, options);
    return observer;
  };

  const inView = observe({ threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  // Clipped elements report almost no intersecting area, so they need a zero threshold
  const clipped = observe({ threshold: 0 });

  document.querySelectorAll('[data-reveal], main [data-split]').forEach((el) => {
    if (el.closest('.hero')) return;
    (el.dataset.reveal === 'wipe' ? clipped : inView).observe(el);
  });

  // The hero plays on load, timed to land as the loader clears
  const hero = document.querySelector('.hero');
  const heroTitle = hero.querySelector('[data-split]');
  heroTitle.style.setProperty('--d', '220ms');
  setTimeout(
    () =>
      requestAnimationFrame(() => {
        hero.classList.add('is-in');
        heroTitle.classList.add('is-in');
      }),
    introDelay,
  );
}
