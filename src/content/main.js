import * as providers from '../providers';
import { storage } from './storage';

async function run() {
  if (!storage.enabled) return false;
  if (storage.isWhitelist(window.location.hostname)) return false;
  const provider = Object.values(providers).find((p) => p.detect());
  if (!provider) return false;

  provider.remove();
  const observer = new MutationObserver(() => {
    provider.remove();
  });
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class', 'style'],
  });
  setTimeout(() => observer.disconnect(), 3000);
}

export function hide(selectors) {
  if (document.getElementById('no-thanks-hide')) return;
  if (selectors.length === 0) return;

  const style = document.createElement('style');
  style.id = 'no-thanks-hide';
  style.textContent = `${selectors.join(', ')} { display: none !important; opacity: 0 !important; pointer-events: none !important; }`;
  document.body.appendChild(style);
}

const observer = new MutationObserver((mutations) => {
  const hasAddedNodes = mutations.some((mutation) => mutation.addedNodes.length > 0);
  if (hasAddedNodes) run();
});

await new Promise((resolve) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', resolve);
  } else {
    resolve();
  }
});

const selectors = Object.values(providers).flatMap((p) => p.selectors);
hide(selectors);

storage.onChange(run);
storage.subscribe();
storage.load().then(() => {
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => {
    observer.disconnect();
  }, 3000);
});
