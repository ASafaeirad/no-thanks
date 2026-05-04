export const steam = {
  selectors: ['#cookiePrefPopup'],
  detect: () => {
    return document.querySelector('#cookiePrefPopup');
  },
  remove: () => {
    const banner = document.querySelector('#cookiePrefPopup');
    banner?.remove();
  },
};
