import { reduceMotion } from './lib/env.js';

/**
 * Animated open/close for the FAQ <details> elements.
 * Height can't transition on <details> in every browser yet, so this animates it
 * with the Web Animations API and leaves the native semantics in place.
 */
export function initFaq() {
  if (reduceMotion) return;

  document.querySelectorAll('.faq__item').forEach((item) => {
    const summary = item.querySelector('summary');
    const answer = item.querySelector('.faq__answer');
    let heightAnim = null;
    let contentAnim = null;

    const finish = (open) => {
      item.open = open;
      item.classList.remove('is-closing');
      item.style.overflow = '';
      heightAnim = null;
      contentAnim?.cancel();
      contentAnim = null;
    };

    const expand = () => {
      const start = item.offsetHeight;
      heightAnim?.cancel();
      contentAnim?.cancel();
      item.classList.remove('is-closing');
      item.open = true;
      const end = item.offsetHeight;
      heightAnim = item.animate(
        { height: [`${start}px`, `${end}px`] },
        { duration: 480, easing: 'cubic-bezier(.16,1,.3,1)' },
      );
      contentAnim = answer.animate(
        { opacity: [0, 1], transform: ['translateY(-10px)', 'none'] },
        { duration: 480, delay: 60, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' },
      );
      heightAnim.onfinish = () => finish(true);
    };

    const collapse = () => {
      const start = item.offsetHeight;
      const border = item.offsetHeight - item.clientHeight;
      heightAnim?.cancel();
      contentAnim?.cancel();
      item.classList.add('is-closing');
      const end = summary.offsetHeight + border;
      heightAnim = item.animate(
        { height: [`${start}px`, `${end}px`] },
        { duration: 340, easing: 'cubic-bezier(.4,0,.2,1)' },
      );
      contentAnim = answer.animate(
        { opacity: [1, 0], transform: ['none', 'translateY(-6px)'] },
        { duration: 200, easing: 'ease-in', fill: 'forwards' },
      );
      heightAnim.onfinish = () => finish(false);
    };

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      item.style.overflow = 'hidden';
      const opening = item.classList.contains('is-closing') || !item.open;
      if (opening) expand();
      else collapse();
    });
  });
}
