export const unsplash = {
  selectors: ["a[href*='/cookies']"],
  detect: () => {
    return document.querySelector("dialog");
  },
  remove: () => {
    const banner = document.querySelector("dialog");
    banner?.remove();
  },
};
