export const iubenda = {
  selectors: ['tb-banner-wrapper'],
  detect: () => {
    return (
      document.querySelector('tb-banner-wrapper') &&
      document.documentElement.style.getPropertyValue('overflow') === 'hidden'
    );
  },
  remove: () => {
    const banner = document.querySelector('tb-banner-wrapper');

    banner?.remove();
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  },
};

export const legacyIubenda = {
  selectors: ['#iubenda-cs-banner'],
  detect: () => {
    return (
      document.querySelector('#iubenda-cs-banner') &&
      document.documentElement.style.getPropertyValue('overflow') === 'hidden'
    );
  },
  remove: () => {
    const banner = document.querySelector('#iubenda-cs-banner');
    banner?.remove();
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  },
};
