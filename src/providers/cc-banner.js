export const cc = {
  selectors: ['.cc-banner-granular'],
  detect: () => {
    return document.querySelector('.cc-banner-granular');
  },
  remove: () => {
    const banner = document.querySelector('.cc-banner-granular');
    banner?.remove();
  },
};
