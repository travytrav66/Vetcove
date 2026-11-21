// Shared environment flags, read once at startup.

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// <html class="anim intro"> is set by the inline script in <head> before first paint.
export const animationsOn = document.documentElement.classList.contains('anim');
export const hasIntro = document.documentElement.classList.contains('intro');

/** How long the loader mark stays on screen. */
export const INTRO_HOLD = 1350;

/** When the hero sequence should start, so it lands as the loader clears. */
export const introDelay = hasIntro ? INTRO_HOLD + 250 : 0;
