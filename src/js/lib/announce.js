// Polite screen-reader announcements through a single visually hidden live region.

const live = () => document.getElementById('live-status');

export function announce(message) {
  const region = live();
  if (!region) return;
  // Clear first so repeating the same message is still announced
  region.textContent = '';
  requestAnimationFrame(() => {
    region.textContent = message;
  });
}
