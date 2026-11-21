// Inline above-the-fold CSS into dist/index.html and load the full stylesheet without blocking render.
import Beasties from 'beasties';
import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('../dist/index.html', import.meta.url);
const html = await readFile(file, 'utf8');
const beasties = new Beasties({
  path: new URL('../dist/', import.meta.url).pathname,
  preload: 'media',     // <link media="print" onload="this.media='all'">
  pruneSource: false,   // keep the full stylesheet intact for everything below the fold
  inlineFonts: false,
  preloadFonts: false,
  logLevel: 'warn',
});
await writeFile(file, await beasties.process(html));
console.log('Inlined critical CSS into dist/index.html');
