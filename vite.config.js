import { defineConfig, loadEnv } from 'vite';

/**
 * SITE_URL is the page's final public address (e.g. https://gainliftoff.com/vetcove/).
 * Social link previews need absolute URLs, so set it in `.env` or the shell before building:
 *   SITE_URL=https://example.com/vetcove/ npm run build
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = (env.SITE_URL || '').replace(/\/?$/, '/');

  return {
    // Relative asset paths so the build works from any sub-folder
    base: './',
    build: {
      target: 'es2020',
      assetsInlineLimit: 0,
      cssCodeSplit: false,
    },
    plugins: [
      {
        name: 'site-url',
        transformIndexHtml(html) {
          if (!env.SITE_URL) {
            this?.warn?.('SITE_URL is not set: link-preview tags will use relative URLs.');
            // Without a known origin, drop og:url and keep image paths relative
            return html
              .replace(/\s*<meta property="og:url"[^>]*>/, '')
              .replaceAll('%SITE_URL%', '');
          }
          return html.replaceAll('%SITE_URL%', siteUrl);
        },
      },
    ],
  };
});
