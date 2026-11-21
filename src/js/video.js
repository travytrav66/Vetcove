/**
 * Click-to-load Vimeo player: the page ships only a thumbnail,
 * and Vimeo's scripts load when someone actually wants to watch.
 */
export function initVideo() {
  document.querySelectorAll('.video__poster').forEach((poster) => {
    poster.addEventListener('click', () => {
      const params = new URLSearchParams({
        autoplay: '1',
        dnt: '1',
        title: '0',
        byline: '0',
        portrait: '0',
        color: '5533ff',
      });
      const iframe = document.createElement('iframe');
      iframe.src = `https://player.vimeo.com/video/${poster.dataset.vimeo}?${params}`;
      iframe.title = 'Vetcove: easy supply purchasing for veterinary hospitals';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      poster.replaceWith(iframe);
      iframe.focus();
    });
  });
}
