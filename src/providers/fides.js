export const fides = {
  selectors: ['#fides-overlay'],
  detect: () => {
    return document.querySelector('#fides-overlay');
  },
  remove: () => {
    const banner = document.querySelector('#fides-overlay');
    banner?.remove();
  },
};
