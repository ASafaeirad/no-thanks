export const reddit = {
  selectors: ['#data-protection-consent-dialog'],
  detect: () => {
    return document.querySelector('#data-protection-consent-dialog');
  },
  remove: () => {
    const banner = document.querySelector('#data-protection-consent-dialog');
    banner?.remove();
  },
};
