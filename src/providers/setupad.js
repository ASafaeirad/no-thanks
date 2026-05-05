export const setupad = {
  selectors: ['.stpd_cmp'],
  detect: () => {
    return document.querySelector('.stpd_cmp');
  },
  remove: () => {
    const banner = document.querySelector('.stpd_cmp');
    banner?.remove();
  },
};
