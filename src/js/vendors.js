import { announce } from './lib/announce.js';

const suppliers = [
  { key: 'A', color: '#E5484D', kind: 'Distributor', connected: true },
  { key: 'B', color: '#1E9E63', kind: 'Distributor', connected: true },
  { key: 'C', color: '#F08C00', kind: 'Distributor', connected: true },
  { key: 'D', color: '#1F8FF0', kind: 'Manufacturer direct', connected: true },
  { key: 'E', color: '#C2418C', kind: 'Diagnostic lab', connected: false },
];

const checkIcon =
  '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7.5l2.5 2.5L11 4.5"/></svg>';
const plusIcon =
  '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M7 2.5v9M2.5 7h9"/></svg>';

/** "How it works" supplier list with connect/disconnect toggles. */
export function initVendorConnections() {
  const list = document.getElementById('vendor-connect');
  const countEl = document.getElementById('vendor-count');

  const connectedCount = () => list.querySelectorAll('[data-state="on"]').length;
  const renderCount = () => {
    countEl.textContent = `${connectedCount()} of ${suppliers.length} connected`;
  };

  suppliers.forEach(({ key, color, kind, connected }) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <span class="vendor__mark" style="background:${color}" aria-hidden="true">${key}</span>
        <span><span class="vendor__name">Vendor ${key}</span><small>${kind}</small></span>
      </div>
      <button type="button" class="connect" data-state="${connected ? 'on' : 'off'}"></button>`;
    const btn = li.querySelector('button');

    // The visible text carries the state; the accessible name adds the vendor,
    // e.g. "Connected: Vendor A" / "Connect Vendor E"
    const paint = () => {
      const on = btn.dataset.state === 'on';
      btn.innerHTML =
        (on ? checkIcon : plusIcon) +
        `<span>${on ? 'Connected' : 'Connect'}<span class="sr-only">${on ? ': ' : ' '}Vendor ${key}</span></span>`;
    };

    btn.addEventListener('click', () => {
      btn.dataset.state = btn.dataset.state === 'on' ? 'off' : 'on';
      paint();
      renderCount();
      const state = btn.dataset.state === 'on' ? 'connected' : 'disconnected';
      announce(
        `Vendor ${key} ${state}. ${connectedCount()} of ${suppliers.length} suppliers connected.`,
      );
    });

    paint();
    list.appendChild(li);
  });

  renderCount();
}
