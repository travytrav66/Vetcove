/** Switches the header to its solid style as soon as the page scrolls. */
export function initStickyHeader() {
  const header = document.querySelector('.site-header');
  const update = () => header.classList.toggle('is-stuck', window.scrollY > 0);
  update();
  window.addEventListener('scroll', update, { passive: true });
}
