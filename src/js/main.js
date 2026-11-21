import '../scss/main.scss';

import { initLoader } from './loader.js';
import { initButtonRoll } from './buttons.js';
import { initDisabledLinks } from './concept-links.js';
import { initStickyHeader } from './header.js';
import { initMobileMenu } from './mobile-menu.js';
import { initCompare } from './compare/compare.js';
import { initVendorConnections } from './vendors.js';
import { initVideo } from './video.js';
import { initFaq } from './faq.js';
import { initReveal } from './reveal/reveal.js';

// Order matters: the reveal step indexes markup that the earlier modules create.
initLoader();
initButtonRoll();
initDisabledLinks();
initStickyHeader();
initMobileMenu();
initCompare();
initVendorConnections();
initVideo();
initFaq();
initReveal();
