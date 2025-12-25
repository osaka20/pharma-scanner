// UI management module for Pharma Scanner

import { t, applyTranslations } from './i18n.js';
import { formatPrice, formatDate, formatBarcode, getCategoryIcon, daysUntilExpiry } from './utils.js';

// Toast notification system
const toastContainer = document.getElementById('toast-container');

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type (success, error, warning, info)
 * @param {number} duration - Duration in ms
 */
export function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-message">${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  // Animate in
  setTimeout(() => toast.classList.add('animate-slide-in-right'), 10);
  
  // Remove after duration
  setTimeout(() => {
    toast.classList.remove('animate-slide-in-right');
    toast.classList.add('animate-fade-out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Show loading overlay
 */
export function showLoading() {
  document.getElementById('loading').classList.remove('hidden');
}

/**
 * Hide loading overlay
 */
export function hideLoading() {
  document.getElementById('loading').classList.add('hidden');
}

/**
 * Show confirm dialog
 * @param {string} message - Confirmation message
 * @param {string} title - Dialog title
 * @returns {Promise<boolean>} True if confirmed
 */
export function confirm(message, title = null) {
  return new Promise((resolve) => {
    const modal = document.getElementById('confirm-modal');
    const titleEl = document.getElementById('confirm-title');
    const messageEl = document.getElementById('confirm-message');
    const yesBtn = document.getElementById('confirm-yes');
    const noBtn = document.getElementById('confirm-no');
    
    if (title) {
      titleEl.textContent = title;
    }
    messageEl.textContent = message;
    
    modal.classList.remove('hidden');
    
    const handleYes = () => {
      modal.classList.add('hidden');
      cleanup();
      resolve(true);
    };
    
    const handleNo = () => {
      modal.classList.add('hidden');
      cleanup();
      resolve(false);
    };
    
    const cleanup = () => {
      yesBtn.removeEventListener('click', handleYes);
      noBtn.removeEventListener('click', handleNo);
    };
    
    yesBtn.addEventListener('click', handleYes);
    noBtn.addEventListener('click', handleNo);
  });
}

/**
 * Show modal
 * @param {string} modalId - Modal element ID
 */
export function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    modal.querySelector('.modal-content')?.classList.add('animate-scale-in');
  }
}

/**
 * Hide modal
 * @param {string} modalId - Modal element ID
 */
export function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.querySelector('.modal-content')?.classList.remove('animate-scale-in');
    setTimeout(() => modal.classList.add('hidden'), 200);
  }
}

/**
 * Navigate to view
 * @param {string} viewName - View name
 */
export function navigateTo(viewName) {
  // Hide all views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  
  // Show target view
  const targetView = document.getElementById(`${viewName}-view`);
  if (targetView) {
    targetView.classList.add('active');
    targetView.classList.add('animate-fade-in');
  }
  
  // Update navigation active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.view === viewName) {
      item.classList.add('active');
    }
  });
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Show screen
 * @param {string} screenId - Screen element ID
 */
export function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.add('hidden');
  });
  
  // Hide app
  document.getElementById('app').classList.add('hidden');
  
  // Show target screen
  const screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.remove('hidden');
  }
}

/**
 * Show app (hide screens)
 */
export function showApp() {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.add('hidden');
  });
  document.getElementById('app').classList.remove('hidden');
}

/**
 * Create product card element
 * @param {Object} product - Product data
 * @returns {HTMLElement} Product card element
 */
export function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card stagger-item';
  card.dataset.productId = product.id;
  
  const imageHtml = product.photo
    ? `<img src="${product.photo}" alt="${product.name}" class="product-image">`
    : `<div class="product-image" style="display: flex; align-items: center; justify-content: center; font-size: 4rem; color: var(--text-tertiary);">📦</div>`;
  
  const badges = [];
  if (product.favorite) {
    badges.push('<span class="badge badge-favorite">⭐ ' + t('favorites') + '</span>');
  }
  if (product.expiryDate) {
    const days = daysUntilExpiry(product.expiryDate);
    if (days < 0) {
      badges.push('<span class="badge badge-danger">' + t('expired') + '</span>');
    } else if (days < 30) {
      badges.push('<span class="badge badge-warning">' + t('expiring_soon') + '</span>');
    }
  }
  
  card.innerHTML = `
    ${imageHtml}
    <div class="product-content">
      <div class="product-header">
        <span class="product-category">${getCategoryIcon(product.category)} ${t('category_' + product.category)}</span>
        <button class="product-favorite ${product.favorite ? 'active' : ''}" data-product-id="${product.id}">
          ${product.favorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="product-name">${product.name}</div>
      <div class="product-price">${formatPrice(product.price)}</div>
      ${product.description ? `<div class="product-description">${product.description}</div>` : ''}
      ${badges.length > 0 ? `<div class="product-badges">${badges.join(' ')}</div>` : ''}
      <div class="product-actions">
        <button class="edit-product-btn" data-product-id="${product.id}" title="${t('edit')}">✏️</button>
        <button class="delete-product-btn" data-product-id="${product.id}" title="${t('delete')}">🗑️</button>
      </div>
    </div>
  `;
  
  return card;
}

/**
 * Create product list item element
 * @param {Object} product - Product data
 * @returns {HTMLElement} Product list item element
 */
export function createProductListItem(product) {
  const item = document.createElement('div');
  item.className = 'product-list-item';
  item.dataset.productId = product.id;
  
  const imageHtml = product.photo
    ? `<img src="${product.photo}" alt="${product.name}">`
    : `<div style="width: 80px; height: 80px; background: var(--bg-tertiary); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 2rem;">📦</div>`;
  
  item.innerHTML = `
    ${imageHtml}
    <div class="product-list-content">
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div>
          <div class="product-name">${product.name}</div>
          <div class="product-price">${formatPrice(product.price)}</div>
        </div>
        <button class="product-favorite ${product.favorite ? 'active' : ''}" data-product-id="${product.id}">
          ${product.favorite ? '❤️' : '🤍'}
        </button>
      </div>
      ${product.description ? `<div class="product-description">${product.description}</div>` : ''}
    </div>
  `;
  
  return item;
}

/**
 * Show product detail modal
 * @param {Object} product - Product data
 */
export function showProductDetail(product) {
  const modal = document.getElementById('product-modal');
  const body = document.getElementById('product-modal-body');
  
  const imageHtml = product.photo
    ? `<img src="${product.photo}" alt="${product.name}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: var(--radius-lg); margin-bottom: var(--spacing-lg);">`
    : '';
  
  const expiryInfo = product.expiryDate
    ? `<p><strong>${t('expiry_date')}:</strong> ${formatDate(product.expiryDate)}</p>`
    : '';
  
  const quantityInfo = product.quantity !== undefined && product.quantity !== null
    ? `<p><strong>${t('quantity')}:</strong> ${product.quantity}</p>`
    : '';
  
  body.innerHTML = `
    ${imageHtml}
    <div style="text-align: center; margin-bottom: var(--spacing-lg);">
      <span class="product-category">${getCategoryIcon(product.category)} ${t('category_' + product.category)}</span>
    </div>
    <h3 style="text-align: center; margin-bottom: var(--spacing-md);">${product.name}</h3>
    <div style="text-align: center; margin-bottom: var(--spacing-xl);">
      <span style="font-size: var(--font-size-3xl); font-weight: 700; color: var(--success);">${formatPrice(product.price)}</span>
    </div>
    ${product.barcode ? `<p><strong>${t('barcode')}:</strong> ${formatBarcode(product.barcode)}</p>` : ''}
    ${product.description ? `<p><strong>${t('description')}:</strong> ${product.description}</p>` : ''}
    ${expiryInfo}
    ${quantityInfo}
    <p><strong>${t('added')}:</strong> ${formatDate(product.createdAt)}</p>
    <div class="modal-actions" style="margin-top: var(--spacing-xl);">
      <button class="btn btn-outline edit-product-btn" data-product-id="${product.id}">
        ✏️ ${t('edit')}
      </button>
      <button class="btn btn-danger delete-product-btn" data-product-id="${product.id}">
        🗑️ ${t('delete')}
      </button>
    </div>
  `;
  
  showModal('product-modal');
}

/**
 * Update statistics display
 * @param {Object} stats - Statistics object
 */
export function updateStats(stats) {
  document.getElementById('stat-total').textContent = stats.total || 0;
  document.getElementById('stat-average').textContent = formatPrice(stats.average);
  document.getElementById('stat-value').textContent = formatPrice(stats.totalValue);
  document.getElementById('stat-favorites').textContent = stats.favorites || 0;
}

/**
 * Show empty state
 * @param {string} type - Empty state type
 */
export function showEmptyState(type = 'no-products') {
  const emptyState = document.getElementById('empty-state');
  const img = emptyState.querySelector('img');
  const title = emptyState.querySelector('h3');
  const description = emptyState.querySelector('p');
  
  if (type === 'no-results') {
    img.src = '/assets/images/empty-states/no-results.svg';
    title.textContent = t('no_results');
    description.textContent = t('no_results_description');
  } else {
    img.src = '/assets/images/empty-states/no-products.svg';
    title.textContent = t('no_products');
    description.textContent = t('no_products_description');
  }
  
  emptyState.classList.remove('hidden');
}

/**
 * Hide empty state
 */
export function hideEmptyState() {
  document.getElementById('empty-state').classList.add('hidden');
}

/**
 * Initialize UI event listeners
 */
export function initUI() {
  // Modal close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      if (modal) {
        hideModal(modal.id);
      }
    });
  });
  
  // Modal backdrop click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideModal(modal.id);
      }
    });
  });
  
  // Navigation items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      navigateTo(view);
    });
  });
}
