import './style.css';
// @ts-check
import { storage } from '../content/storage.js';

const els = {
  version: document.getElementById('version'),
  enabledToggle: document.getElementById('enabled-toggle'),
  enabledStatus: document.getElementById('enabled-status'),
  currentDomain: document.getElementById('current-domain'),
  toggleWhitelist: document.getElementById('toggle-whitelist'),
  siteStatus: document.getElementById('site-status'),
  message: document.getElementById('message'),
};

const state = {
  currentDomain: '',
};

function queryActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError || !tabs?.[0]?.url) {
        resolve('');
        return;
      }

      try {
        resolve(storage.normalizeDomain(new URL(tabs[0].url).hostname));
      } catch {
        resolve('');
      }
    });
  });
}

function setMessage(text, type) {
  els.message.textContent = text;
  els.message.className = type === 'error' ? 'message error' : 'message';
  els.message.style.display = 'block';
}

function render() {
  console.log(storage);

  const currentDomain = state.currentDomain;
  const isWhitelisted = currentDomain && storage.isWhitelisted(currentDomain);

  els.version.textContent = `Version ${chrome.runtime.getManifest().version}`;
  els.enabledToggle.checked = storage.enabled;
  els.enabledStatus.textContent = storage.enabled ? 'Blocking is active.' : 'Blocking is disabled.';
  els.toggleWhitelist.textContent = isWhitelisted ? 'Remove from whitelist' : 'Add to whitelist';
  els.currentDomain.textContent = currentDomain || 'This page cannot be managed.';
  els.siteStatus.textContent = currentDomain
    ? isWhitelisted
      ? 'This site is whitelisted.'
      : 'This site is not whitelisted.'
    : 'Open a regular http or https page to manage a site.';
}

async function saveEnabled(enabled) {
  await storage.set({ enabled });
  setMessage(enabled ? 'Blocking enabled.' : 'Blocking disabled.');
}

async function toggleCurrentDomain() {
  if (!state.currentDomain) return;
  const isWhitelisted = storage.isWhitelisted(state.currentDomain);
  if (isWhitelisted) {
    await storage.removeFromWhitelist(state.currentDomain);
    setMessage(`${state.currentDomain} removed from the whitelist.`);
  } else {
    await storage.addToWhitelist(state.currentDomain);
    setMessage(`${state.currentDomain} added to the whitelist.`);
  }
}

els.enabledToggle.addEventListener('change', () => saveEnabled(els.enabledToggle.checked));
els.toggleWhitelist.addEventListener('click', toggleCurrentDomain);

async function init() {
  state.currentDomain = await queryActiveTab();
  storage.onChange(render);
  storage.subscribe();
  await storage.load();
  render();
}
init();
