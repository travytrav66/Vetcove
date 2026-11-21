// Post-build: inline above-the-fold CSS, load the full stylesheet without blocking render,
// then minify the HTML.
import Beasties from 'beasties';
import { minify } from 'html-minifier-terser';
import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('../dist/index.html', import.meta.url);
let html = await readFile(file, 'utf8');

const beasties = new Beasties({
  path: new URL('../dist/', import.meta.url).pathname,
  preload: 'media', // <link media="print" onload="this.media='all'"> plus a <noscript> fallback
  pruneSource: false, // keep the full stylesheet intact for everything below the fold
  inlineFonts: false,
  preloadFonts: false,
  logLevel: 'warn',
  // <html class="anim intro"> is added by an inline script before first paint, so these rules
  // never match the static HTML. Keep them inline or the page would flash before animating.
  allowRules: [/\.anim\b/, /\.intro\b/, /\.loader/, /\.is-split/, /\[data-split\]/, /\.w\b/],
});
html = await beasties.process(html);

html = await minify(html, {
  collapseWhitespace: true,
  conservativeCollapse: true, // keep single spaces between inline elements
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,
  sortAttributes: true,
});

await writeFile(file, html);
console.log('Inlined critical CSS and minified dist/index.html');
