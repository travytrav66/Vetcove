/** Counts a number up from zero, easing out as it lands. */
export function countUp(el, { target, suffix = '', duration = 1800, delay = 350 }) {
  // Hold the final width so the heading doesn't reflow while counting
  el.style.display = 'inline-block';
  el.style.minWidth = `${el.getBoundingClientRect().width}px`;

  const start = performance.now() + delay;
  const tick = (now) => {
    const t = Math.min(Math.max((now - start) / duration, 0), 1);
    const eased = t === 1 ? 1 : 1 - 2 ** (-10 * t);
    el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };

  el.textContent = `0${suffix}`;
  requestAnimationFrame(tick);
}
