export const uc = {
  selectors: ['#usercentrics-root'],
  detect: () => {
    return document.querySelector('#usercentrics-root');
  },
  remove: () => {
    const banner = document.querySelector('#usercentrics-root');
    banner?.remove();
    document.body.classList.remove('overflowHidden');
  },
};
