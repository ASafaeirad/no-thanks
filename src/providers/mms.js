export const mms = {
  selectors: ['#mms-consent-portal-container'],
  detect: () => {
    return document.querySelector('#mms-consent-portal-container');
  },
  remove: () => {
    const banner = document.querySelector('#mms-consent-portal-container');
    banner?.remove();
    document.body.style.overflow = 'unset';
    document.body.style.touchAction = 'unset';
    document.body.style.overscrollBehavior = 'unset';
  },
};
