/**
 * Wraps each button label so CSS can roll a copy of it up from below on hover.
 * The copy comes from a data attribute, so screen readers still read the label once.
 */
export function initButtonRoll() {
  document.querySelectorAll('.btn').forEach((btn) => {
    const label = btn.textContent.trim();
    if (!label || btn.children.length) return;
    const safe = label.replace(/"/g, '&quot;');
    btn.innerHTML = `<span class="btn__roll"><span data-text="${safe}">${label}</span></span>`;
  });
}
