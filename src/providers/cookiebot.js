export const cookiebot = {
  selectors: ['#CybotCookiebotDialog'],
  detect: () => {
    return document.querySelector('#CybotCookiebotDialog');
  },
  remove: () => {
    const banner = document.querySelector('#CybotCookiebotDialog');
    banner?.remove();
  },
};
