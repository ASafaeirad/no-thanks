export const consentmanager = {
  selectors: ['#cmpbox', '#cmpwrapper', '#cmpbox2'],
  detect: () => {
    return (
      document.querySelector('#cmpbox') ||
      document.querySelector('#cmpwrapper') ||
      document.querySelector('#cmpbox2')
    );
  },
  remove: () => {
    const banner = document.querySelector('#cmpbox');
    const wrapper = document.querySelector('#cmpwrapper');
    const banner2 = document.querySelector('#cmpbox2');
    wrapper?.remove();
    banner?.remove();
    banner2?.remove();
    document.body.style.overflow = '';
  },
};
