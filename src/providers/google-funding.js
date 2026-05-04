export const googleFunding = {
  selectors: ['.fc-consent-root'],
  detect: () => {
    return document.querySelector('.fc-consent-root');
  },
  remove: () => {
    const banner = document.querySelector('.fc-consent-root');
    banner?.remove();
    document.body.style.overflow = '';
  },
};
