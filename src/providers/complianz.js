export const complianz = {
  selectors: ['#cmplz-cookiebanner-container'],
  detect: () => {
    return document.querySelector('#cmplz-cookiebanner-container');
  },
  remove: () => {
    const banner = document.querySelector('#cmplz-cookiebanner-container');
    banner?.remove();
  },
};
