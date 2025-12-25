// Utility functions for Pharma Scanner

/**
 * Format date to locale string
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale code (fr, en)
 * @returns {string} Formatted date
 */
export function formatDate(date, locale = 'fr') {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format price to currency string
 * @param {number} price - Price to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted price
 */
export function formatPrice(price, currency = '€') {
  if (price === null || price === undefined) return `0${currency}`;
  return `${parseFloat(price).toFixed(2)}${currency}`;
}

/**
 * Calculate days until expiry
 * @param {Date|string} expiryDate - Expiry date
 * @returns {number} Days until expiry
 */
export function daysUntilExpiry(expiryDate) {
  if (!expiryDate) return Infinity;
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const today = new Date();
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check if product is expiring soon (< 30 days)
 * @param {Date|string} expiryDate - Expiry date
 * @returns {boolean} True if expiring soon
 */
export function isExpiringSoon(expiryDate) {
  const days = daysUntilExpiry(expiryDate);
  return days < 30 && days >= 0;
}

/**
 * Check if product is expired
 * @param {Date|string} expiryDate - Expiry date
 * @returns {boolean} True if expired
 */
export function isExpired(expiryDate) {
  return daysUntilExpiry(expiryDate) < 0;
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate password (min 6 characters)
 * @param {string} password - Password to validate
 * @returns {boolean} True if valid
 */
export function validatePassword(password) {
  return password && password.length >= 6;
}

/**
 * Compress image
 * @param {File} file - Image file
 * @param {number} maxWidth - Max width
 * @param {number} maxHeight - Max height
 * @param {number} quality - Quality (0-1)
 * @returns {Promise<string>} Base64 encoded image
 */
export function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

/**
 * Download JSON file
 * @param {Object} data - Data to download
 * @param {string} filename - Filename
 */
export function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Read JSON file
 * @param {File} file - File to read
 * @returns {Promise<Object>} Parsed JSON data
 */
export function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Get category icon
 * @param {string} category - Category name
 * @returns {string} Category icon
 */
export function getCategoryIcon(category) {
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
 * Format barcode for display
 * @param {string} barcode - Barcode string
 * @returns {string} Formatted barcode
 */
export function formatBarcode(barcode) {
  if (!barcode) return '';
  // Format as groups (e.g., 123-456-789-012)
  return barcode.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1-$2-$3-$4');
}

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncate(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Hash password using Web Crypto API
 * @param {string} password - Password to hash
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Get theme preference from system
 * @returns {string} 'light' or 'dark'
 */
export function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

/**
 * Request notification permission
 * @returns {Promise<boolean>} True if granted
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

/**
 * Show notification
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 */
export function showNotification(title, options = {}) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/assets/icons/icon-192.png',
      badge: '/assets/icons/icon-192.png',
      ...options
    });
  }
}

/**
 * Calculate average
 * @param {Array<number>} numbers - Numbers to average
 * @returns {number} Average
 */
export function average(numbers) {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b, 0);
  return sum / numbers.length;
}

/**
 * Group items by property
 * @param {Array} items - Items to group
 * @param {string} key - Property to group by
 * @returns {Object} Grouped items
 */
export function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
}

/**
 * Sort items
 * @param {Array} items - Items to sort
 * @param {string} sortBy - Sort field
 * @returns {Array} Sorted items
 */
export function sortItems(items, sortBy) {
  const sorted = [...items];
  
  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'date-asc':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'date-desc':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    default:
      return sorted;
  }
}

/**
 * Filter items by search term
 * @param {Array} items - Items to filter
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered items
 */
export function filterBySearch(items, searchTerm) {
  if (!searchTerm) return items;
  const term = searchTerm.toLowerCase();
  return items.filter(item =>
    item.name.toLowerCase().includes(term) ||
    (item.description && item.description.toLowerCase().includes(term)) ||
    (item.barcode && item.barcode.includes(term))
  );
}
