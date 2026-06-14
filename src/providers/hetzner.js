export const hetzner = {
  selectors: ["#InitModal"],
  detect: () => {
    return document.querySelector("#InitModal");
  },
  remove: () => {
    const banner = document.querySelector("#InitModal");
    const backdrop = document.querySelector(".modal-backdrop");
    banner?.remove();
    backdrop?.remove();
    document.body.style.overflow = "";
    document.body.classList.remove("modal-open");
  },
};
