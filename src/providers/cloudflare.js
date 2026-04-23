export const cloudflare = {
  selectors: ['#onetrust-consent-sdk'],
  detect: () => {
    return document.querySelector('#onetrust-consent-sdk');
  },
  remove: () => {
    const banner = document.querySelector('#onetrust-consent-sdk');
    banner?.remove();
  },
};
