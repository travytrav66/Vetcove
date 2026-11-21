import { announce } from './lib/announce.js';

const MESSAGE = 'This is a redesign concept, so links are turned off.';

/**
 * Links in this concept point at "#" so nothing reaches the real site.
 * Clicking one shows a short toast instead of silently doing nothing.
 */
export function initDisabledLinks() {
  const toast = document.getElementById('toast');
  let timer;

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href="#"]');
    if (!link) return;
    event.preventDefault();

    toast.textContent = MESSAGE;
    toast.classList.add('is-visible');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
    announce(MESSAGE);
  });
}
