import { hasIntro, INTRO_HOLD } from './lib/env.js';

/** Lifts the page loader away after the mark has finished drawing. */
export function initLoader() {
  if (!hasIntro) return;
  const loader = document.querySelector('.loader');
  setTimeout(() => {
    loader.classList.add('is-leaving');
    // Remove the intro state once the exit transition has finished
    setTimeout(() => document.documentElement.classList.remove('intro'), 900);
  }, INTRO_HOLD);
}
