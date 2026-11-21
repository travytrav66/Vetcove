import { reduceMotion } from './lib/env.js';

const DESKTOP_NAV = '(min-width: 1100px)';

/**
 * Full-screen menu that grows out of the toggle button.
 * While open, the rest of the page is inert so focus stays in the menu.
 */
export function initMobileMenu() {
  const header = document.querySelector('.site-header');
  const menu = document.getElementById('mobile-menu');
  const toggle = document.querySelector('.nav .menu-toggle');
  const outside = [
    document.querySelector('main'),
    document.querySelector('footer'),
    document.querySelector('.skip-link'),
  ];

  menu.querySelectorAll('[data-stagger]').forEach((el, i) => el.style.setProperty('--i', i));

  const isOpen = () => menu.classList.contains('is-open');

  const setOpen = (open) => {
    // Start the circular reveal from wherever the toggle actually is
    const r = toggle.getBoundingClientRect();
    menu.style.setProperty('--ox', `${r.left + r.width / 2}px`);
    menu.style.setProperty('--oy', `${r.top + r.height / 2}px`);

    menu.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.documentElement.style.overflow = open ? 'hidden' : '';
    outside.forEach((el) => {
      el.inert = open;
    });

    if (open) {
      const delay = reduceMotion ? 0 : 380;
      setTimeout(() => menu.querySelector('a').focus({ preventScroll: true }), delay);
    }
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  window.matchMedia(DESKTOP_NAV).addEventListener('change', (event) => {
    if (event.matches && isOpen()) setOpen(false);
  });
}
