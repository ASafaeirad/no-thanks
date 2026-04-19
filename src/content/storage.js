import DEFAULTS from './defaults';

// @ts-check
class Storage {
  constructor(defaults) {
    this.defaults = {
      enabled: defaults.enabled,
      whitelistDomains: Array.from(defaults.whitelistDomains),
      selectors: Array.from(defaults.selectors),
    };
    this.settings = this.defaults;
    this.changeCallbacks = [];
  }

  async load() {
    this.settings = await this.#getStorage();
    return this.settings;
  }

  async set(items) {
    await new Promise((resolve) => {
      chrome.storage.local.set(items, () => {
        resolve();
      });
    });
    return this.load();
  }

  get enabled() {
    return this.settings.enabled;
  }

  get selectors() {
    return this.settings.selectors;
  }

  onChange(callback) {
    this.changeCallbacks.push(callback);
  }

  subscribe() {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'local') return;

      const relevantKeys = ['enabled', 'whitelistDomains', 'selectors'];
      if (relevantKeys.some((key) => Object.hasOwn(changes, key))) {
        this.#handleStorageChange();
      }
    });
  }

  isWhitelist(domain) {
    const normalized = this.normalizeDomain(domain);
    if (!normalized) return true;
    return this.matchesDomain(normalized, this.settings.whitelistDomains);
  }

  async #handleStorageChange() {
    await this.load();
    this.changeCallbacks.forEach((callback) => {
      callback(this.settings);
    });
  }

  async #getStorage() {
    return new Promise((resolve) => {
      chrome.storage.local.get(this.defaults, (items) => {
        resolve(this.#normalizeSettings(items));
      });
    });
  }

  #normalizeSettings(raw) {
    return {
      enabled: raw.enabled !== false,
      whitelistDomains: this.normalizeDomains(raw.whitelistDomains),
      selectors: this.#normalizeSelectors(raw.selectors),
    };
  }

  normalizeDomains(value) {
    if (!Array.isArray(value)) return [];
    const domains = value.map((domain) => this.normalizeDomain(domain)).filter(Boolean);
    return Array.from(new Set(domains));
  }

  normalizeDomain(value) {
    if (typeof value !== 'string') return '';

    let domain = value.trim().toLowerCase();
    if (!domain) return '';

    try {
      if (/^https?:\/\//i.test(domain)) {
        domain = new URL(domain).hostname;
      }
    } catch {
      return '';
    }

    domain = domain.replace(/:\d+$/, '').replace(/^\.+|\.+$/g, '');

    if (!domain || domain.includes('/') || domain.includes(' ')) return '';
    return domain;
  }

  #normalizeSelectors(value) {
    if (!Array.isArray(value)) return [];

    const selectors = value
      .map((selector) => (typeof selector === 'string' ? selector.trim() : ''))
      .filter((selector) => selector && !selector.startsWith('//'))
      .filter(this.isValidSelector);

    return Array.from(new Set(selectors));
  }

  isValidSelector(selector) {
    try {
      document.createDocumentFragment().querySelector(selector);
      return true;
    } catch {
      return false;
    }
  }

  matchesDomain(hostname, domains) {
    return domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
  }

  isWhitelisted(domain) {
    return this.matchesDomain(domain, this.settings.whitelistDomains);
  }

  async addToWhitelist(domain) {
    const normalized = this.normalizeDomain(domain);
    if (!normalized) return false;

    const whitelistDomains = Array.from(
      new Set(this.settings.whitelistDomains.concat(normalized)),
    ).sort();

    await this.set({ whitelistDomains });
    return true;
  }

  async removeFromWhitelist(domain) {
    const normalized = this.normalizeDomain(domain);
    if (!normalized) return false;

    const whitelistDomains = this.settings.whitelistDomains.filter((d) => d !== normalized).sort();

    await this.set({ whitelistDomains });
    return true;
  }
}

export const storage = new Storage(DEFAULTS);
