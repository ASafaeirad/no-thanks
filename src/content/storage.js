// @ts-check

/** @typedef {Object} StorageSettings
 *  @property {boolean} enabled
 *  @property {string[]} whitelistDomains
 */

/** @type {StorageSettings} */
const DEFAULT_SETTINGS = {
  enabled: true,
  whitelistDomains: [],
};

class Storage {
  /** @type {Function[]} */
  changeCallbacks = [];
  /** @type {StorageSettings} */
  settings = DEFAULT_SETTINGS;

  async load() {
    this.settings = await this.#getStorage();
    return this.settings;
  }

  /**
   * @param {Partial<StorageSettings>} items
   */
  async set(items) {
    await /** @type {Promise<void>} */ (
      new Promise((resolve) => {
        chrome.storage.local.set(items, () => {
          resolve();
        });
      })
    );
    return this.load();
  }

  get enabled() {
    return this.settings.enabled;
  }

  /**
   * @param {Function} callback
   */
  onChange(callback) {
    this.changeCallbacks.push(callback);
  }

  subscribe() {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'local') return;

      const relevantKeys = ['enabled', 'whitelistDomains'];
      if (relevantKeys.some((key) => Object.hasOwn(changes, key))) {
        this.#handleStorageChange();
      }
    });
  }

  /**
   * @param {string} domain
   */
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
      chrome.storage.local.get(DEFAULT_SETTINGS, (items) => {
        resolve(this.#normalizeSettings(items));
      });
    });
  }

  /**
   *
   * @param {*} raw
   */
  #normalizeSettings(raw) {
    return {
      enabled: raw.enabled !== false,
      whitelistDomains: this.normalizeDomains(raw.whitelistDomains),
    };
  }

  /**
   * @param {string[]} value
   */
  normalizeDomains(value) {
    if (!Array.isArray(value)) return [];
    const domains = value.map((domain) => this.normalizeDomain(domain)).filter(Boolean);
    return Array.from(new Set(domains));
  }

  /**
   * @param {string} value
   */
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

  /**
   * @param {string} hostname
   * @param {string[]} domains
   */
  matchesDomain(hostname, domains) {
    return domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
  }

  /**
   * @param {string} domain
   */
  isWhitelisted(domain) {
    return this.matchesDomain(domain, this.settings.whitelistDomains);
  }

  /**
   * @param {*} domain
   */
  async addToWhitelist(domain) {
    const normalized = this.normalizeDomain(domain);
    if (!normalized) return false;

    const whitelistDomains = Array.from(
      new Set(this.settings.whitelistDomains.concat(normalized)),
    ).sort();

    await this.set({ whitelistDomains });
    return true;
  }

  /**
   * @param {*} domain
   */
  async removeFromWhitelist(domain) {
    const normalized = this.normalizeDomain(domain);
    if (!normalized) return false;

    const whitelistDomains = this.settings.whitelistDomains.filter((d) => d !== normalized).sort();

    await this.set({ whitelistDomains });
    return true;
  }
}

export const storage = new Storage();
