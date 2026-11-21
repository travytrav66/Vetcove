/**
 * Splits a heading into masked words for the word-by-word reveal.
 * Element children (like the "23,000+" span) are moved whole, so references stay valid.
 * Screen readers get the heading as one string through aria-label.
 */
export function splitWords(heading) {
  let index = 0;

  const wrap = (node) => {
    const outer = document.createElement('span');
    outer.className = 'w';
    const inner = document.createElement('span');
    inner.style.setProperty('--wi', index++);
    inner.appendChild(node);
    outer.appendChild(inner);
    return outer;
  };

  [...heading.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        frag.appendChild(
          /^\s+$/.test(part) ? document.createTextNode(part) : wrap(document.createTextNode(part)),
        );
      });
      node.replaceWith(frag);
    } else {
      const holder = wrap(document.createTextNode(''));
      heading.insertBefore(holder, node);
      holder.firstChild.replaceChildren(node);
    }
  });

  if (!heading.hasAttribute('aria-label')) {
    heading.setAttribute('aria-label', heading.textContent.replace(/\s+/g, ' ').trim());
  }
  heading.querySelectorAll(':scope > .w').forEach((w) => w.setAttribute('aria-hidden', 'true'));
  heading.classList.add('is-split');
}
