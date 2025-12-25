// Internationalization module for Pharma Scanner

let currentLocale = 'fr';
let translations = {};

/**
 * Load translations for a locale
 * @param {string} locale - Locale code (fr, en)
 * @returns {Promise<Object>} Translations object
 */
async function loadTranslations(locale) {
  try {
    const response = await fetch(`/locales/${locale}.json`);
    if (!response.ok) throw new Error(`Failed to load ${locale} translations`);
    return await response.json();
  } catch (error) {
    console.error(`Error loading translations for ${locale}:`, error);
    // Fallback to French if loading fails
    if (locale !== 'fr') {
      return loadTranslations('fr');
    }
    return {};
  }
}

/**
 * Initialize i18n system
 * @param {string} locale - Initial locale
 * @returns {Promise<void>}
 */
export async function initI18n(locale = null) {
  // Detect locale from browser or use provided
  if (!locale) {
    locale = detectLocale();
  }
  
  currentLocale = locale;
  translations = await loadTranslations(locale);
  
  // Update HTML lang attribute
  document.documentElement.lang = locale;
  
  // Apply translations to the page
  applyTranslations();
}

/**
 * Detect user's preferred locale
 * @returns {string} Locale code
 */
function detectLocale() {
  // Check localStorage first
  const saved = localStorage.getItem('pharma-locale');
  if (saved && ['fr', 'en'].includes(saved)) {
    return saved;
  }
  
  // Check browser language
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.startsWith('fr')) {
    return 'fr';
  } else if (browserLang.startsWith('en')) {
    return 'en';
  }
  
  // Default to French
  return 'fr';
}

/**
 * Get current locale
 * @returns {string} Current locale code
 */
export function getLocale() {
  return currentLocale;
}

/**
 * Set locale and reload translations
 * @param {string} locale - Locale code
 * @returns {Promise<void>}
 */
export async function setLocale(locale) {
  if (!['fr', 'en'].includes(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }
  
  currentLocale = locale;
  translations = await loadTranslations(locale);
  
  // Save to localStorage
  localStorage.setItem('pharma-locale', locale);
  
  // Update HTML lang attribute
  document.documentElement.lang = locale;
  
  // Apply translations to the page
  applyTranslations();
}

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @param {Object} params - Parameters to interpolate
 * @returns {string} Translated text
 */
export function t(key, params = {}) {
  let text = translations[key] || key;
  
  // Interpolate parameters
  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param]);
  });
  
  return text;
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
export function applyTranslations() {
  // Translate text content
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = t(key);
  });
  
  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = t(key);
  });
  
  // Translate titles
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    element.title = t(key);
  });
  
  // Translate aria-labels
  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    const key = element.getAttribute('data-i18n-aria');
    element.setAttribute('aria-label', t(key));
  });
  
  // Update select options
  updateSelectOptions();
}

/**
 * Update select option labels with translations
 */
function updateSelectOptions() {
  // Category select
  const categorySelect = document.getElementById('product-category');
  if (categorySelect) {
    Array.from(categorySelect.options).forEach(option => {
      const category = option.value;
      const icon = getCategoryIcon(category);
      const label = t(`category_${category}`);
      option.textContent = `${icon} ${label}`;
    });
  }
  
  // Sort select
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    Array.from(sortSelect.options).forEach(option => {
      const key = option.getAttribute('data-i18n');
      if (key) {
        option.textContent = t(key);
      }
    });
  }
}

/**
 * Get category icon helper
 * @param {string} category - Category name
 * @returns {string} Icon
 */
function getCategoryIcon(category) {
  const icons = {
    painkiller: '💊',
    antibiotic: '💉',
    antiviral: '🦠',
    antihistamine: '🤧',
    vitamin: '💪',
    digestive: '🍽️',
    cardiovascular: '❤️',
    dermatology: '🧴',
    first_aid: '🩹',
    ophthalmology: '👁️',
    dental: '🦷',
    other: '🧬'
  };
  return icons[category] || '🧬';
}

/**
 * Format date according to current locale
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(currentLocale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format relative time
 * @param {Date|string} date - Date
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return t('today');
  } else if (diffDays === 1) {
    return t('yesterday');
  } else if (diffDays < 7) {
    return t('days_ago', { days: diffDays });
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return t('weeks_ago', { weeks });
  } else {
    return formatDate(d);
  }
}

/**
 * Pluralize text
 * @param {number} count - Count
 * @param {string} singularKey - Singular translation key
 * @param {string} pluralKey - Plural translation key
 * @returns {string} Pluralized text
 */
export function pluralize(count, singularKey, pluralKey) {
  return count === 1 ? t(singularKey) : t(pluralKey);
}

// Export translations object for direct access if needed
export function getTranslations() {
  return translations;
}
