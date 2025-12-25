// Product management module for Pharma Scanner

import * as db from './db.js';
import { getCurrentUser } from './auth.js';
import { showToast, showLoading, hideLoading, createProductCard, createProductListItem, showEmptyState, hideEmptyState, hideModal, navigateTo, confirm } from './ui.js';
import { t, applyTranslations } from './i18n.js';
import { compressImage, sortItems, filterBySearch, debounce } from './utils.js';

let allProducts = [];
let filteredProducts = [];
let currentCategory = 'all';
let currentSort = 'date-desc';
let currentSearchTerm = '';
let currentViewMode = 'cards'; // 'cards' or 'list'
let editingProductId = null;

/**
 * Load all products for current user
 */
export async function loadProducts() {
  const user = getCurrentUser();
  if (!user) return;
  
  try {
    allProducts = await db.getProductsByUser(user.id);
    applyFiltersAndSort();
    renderProducts();
  } catch (error) {
    console.error('Error loading products:', error);
    showToast(t('error_loading_products'), 'error');
  }
}

/**
 * Apply filters and sorting
 */
function applyFiltersAndSort() {
  let products = [...allProducts];
  
  // Apply search filter
  if (currentSearchTerm) {
    products = filterBySearch(products, currentSearchTerm);
  }
  
  // Apply category filter
  if (currentCategory !== 'all') {
    products = products.filter(p => p.category === currentCategory);
  }
  
  // Apply sorting
  products = sortItems(products, currentSort);
  
  filteredProducts = products;
}

/**
 * Render products list
 */
function renderProducts() {
  const container = document.getElementById('products-list');
  const emptyState = document.getElementById('empty-state');
  
  container.innerHTML = '';
  
  if (filteredProducts.length === 0) {
    const type = currentSearchTerm || currentCategory !== 'all' ? 'no-results' : 'no-products';
    showEmptyState(type);
    return;
  }
  
  hideEmptyState();
  
  // Update container class based on view mode
  if (currentViewMode === 'cards') {
    container.className = 'products-grid';
  } else {
    container.className = 'products-list';
  }
  
  filteredProducts.forEach((product, index) => {
    const element = currentViewMode === 'cards' 
      ? createProductCard(product)
      : createProductListItem(product);
    
    // Add stagger animation delay
    element.style.animationDelay = `${index * 0.05}s`;
    
    container.appendChild(element);
  });
  
  // Attach event listeners
  attachProductEventListeners();
}

/**
 * Attach event listeners to product elements
 */
function attachProductEventListeners() {
  // Card click to show details
  document.querySelectorAll('.product-card, .product-list-item').forEach(card => {
    card.addEventListener('click', async (e) => {
      // Ignore if clicking on action buttons
      if (e.target.closest('.product-favorite, .product-actions button')) {
        return;
      }
      
      const productId = parseInt(card.dataset.productId);
      const product = await db.getProductById(productId);
      if (product) {
        showProductDetail(product);
      }
    });
  });
  
  // Favorite buttons
  document.querySelectorAll('.product-favorite').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const productId = parseInt(btn.dataset.productId);
      await toggleFavorite(productId);
    });
  });
  
  // Edit buttons
  document.querySelectorAll('.edit-product-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const productId = parseInt(btn.dataset.productId);
      await editProduct(productId);
    });
  });
  
  // Delete buttons
  document.querySelectorAll('.delete-product-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const productId = parseInt(btn.dataset.productId);
      await deleteProduct(productId);
    });
  });
}

/**
 * Show product detail
 */
function showProductDetail(product) {
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
  
  modal.classList.remove('hidden');
  
  // Attach listeners to modal buttons
  body.querySelectorAll('.edit-product-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      hideModal('product-modal');
      await editProduct(product.id);
    });
  });
  
  body.querySelectorAll('.delete-product-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      hideModal('product-modal');
      await deleteProduct(product.id);
    });
  });
}

/**
 * Toggle product favorite
 */
async function toggleFavorite(productId) {
  try {
    const newState = await db.toggleFavorite(productId);
    await loadProducts();
    
    // Update the button without full reload
    const buttons = document.querySelectorAll(`[data-product-id="${productId}"].product-favorite`);
    buttons.forEach(btn => {
      btn.innerHTML = newState ? '❤️' : '🤍';
      if (newState) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Dispatch event for stats update
    window.dispatchEvent(new Event('products-changed'));
  } catch (error) {
    showToast(t('error'), 'error');
  }
}

/**
 * Edit product
 */
async function editProduct(productId) {
  const product = await db.getProductById(productId);
  if (!product) return;
  
  editingProductId = productId;
  
  // Populate form
  document.getElementById('form-title').textContent = t('edit_product');
  document.getElementById('product-barcode').value = product.barcode || '';
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-description').value = product.description || '';
  document.getElementById('product-expiry').value = product.expiryDate || '';
  document.getElementById('product-quantity').value = product.quantity || 1;
  
  // Show photo if exists
  if (product.photo) {
    document.getElementById('preview-image').src = product.photo;
    document.getElementById('preview-image').classList.remove('hidden');
    document.getElementById('photo-placeholder').classList.add('hidden');
  }
  
  navigateTo('product-form');
}

/**
 * Delete product
 */
async function deleteProduct(productId) {
  const confirmed = await confirm(
    t('confirm_delete_product'),
    t('confirm_delete')
  );
  
  if (!confirmed) return;
  
  try {
    await db.deleteProduct(productId);
    await loadProducts();
    showToast(t('success_product_deleted'), 'success');
    
    // Dispatch event for stats update
    window.dispatchEvent(new Event('products-changed'));
  } catch (error) {
    showToast(t('error'), 'error');
  }
}

/**
 * Save product (create or update)
 */
async function saveProduct(productData) {
  const user = getCurrentUser();
  if (!user) return;
  
  showLoading();
  
  try {
    if (editingProductId) {
      // Update existing product
      await db.updateProduct(editingProductId, productData);
      showToast(t('success_product_updated'), 'success');
    } else {
      // Create new product
      await db.createProduct({
        ...productData,
        userId: user.id,
        favorite: false
      });
      showToast(t('success_product_added'), 'success');
    }
    
    // Reset form and reload
    resetProductForm();
    await loadProducts();
    navigateTo('products');
    
    // Dispatch event for stats update
    window.dispatchEvent(new Event('products-changed'));
  } catch (error) {
    console.error('Error saving product:', error);
    showToast(t('error'), 'error');
  } finally {
    hideLoading();
  }
}

/**
 * Reset product form
 */
function resetProductForm() {
  editingProductId = null;
  document.getElementById('form-title').textContent = t('add_product');
  document.getElementById('product-form').reset();
  document.getElementById('preview-image').classList.add('hidden');
  document.getElementById('photo-placeholder').classList.remove('hidden');
}

/**
 * Initialize product management
 */
export function initProducts() {
  const productForm = document.getElementById('product-form');
  const photoInput = document.getElementById('photo-input');
  const uploadPhotoBtn = document.getElementById('upload-photo-btn');
  const photoPreview = document.getElementById('photo-preview');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const viewToggleBtn = document.getElementById('view-toggle-btn');
  const cancelFormBtn = document.getElementById('cancel-form-btn');
  
  // Photo upload
  uploadPhotoBtn.addEventListener('click', () => photoInput.click());
  photoPreview.addEventListener('click', () => photoInput.click());
  
  photoInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        document.getElementById('preview-image').src = compressed;
        document.getElementById('preview-image').classList.remove('hidden');
        document.getElementById('photo-placeholder').classList.add('hidden');
      } catch (error) {
        showToast(t('error'), 'error');
      }
    }
  });
  
  // Product form submit
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const photo = document.getElementById('preview-image').src;
    const productData = {
      barcode: document.getElementById('product-barcode').value.trim() || null,
      name: document.getElementById('product-name').value.trim(),
      price: parseFloat(document.getElementById('product-price').value),
      category: document.getElementById('product-category').value,
      description: document.getElementById('product-description').value.trim() || null,
      expiryDate: document.getElementById('product-expiry').value || null,
      quantity: parseInt(document.getElementById('product-quantity').value) || 1,
      photo: photo && !photo.includes('placeholder') ? photo : null
    };
    
    await saveProduct(productData);
  });
  
  // Cancel form
  cancelFormBtn.addEventListener('click', () => {
    resetProductForm();
    navigateTo('products');
  });
  
  // Search
  searchInput.addEventListener('input', debounce((e) => {
    currentSearchTerm = e.target.value.trim();
    applyFiltersAndSort();
    renderProducts();
  }, 300));
  
  // Sort
  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    applyFiltersAndSort();
    renderProducts();
  });
  
  // View toggle
  viewToggleBtn.addEventListener('click', () => {
    currentViewMode = currentViewMode === 'cards' ? 'list' : 'cards';
    viewToggleBtn.querySelector('.view-icon').textContent = currentViewMode === 'cards' ? '📋' : '🎴';
    renderProducts();
  });
  
  // Category filters
  initCategoryFilters();
  
  // Empty state add button
  document.getElementById('empty-add-btn')?.addEventListener('click', () => {
    resetProductForm();
    navigateTo('product-form');
  });
  
  // Quick action buttons
  document.getElementById('quick-add-btn')?.addEventListener('click', () => {
    resetProductForm();
    navigateTo('product-form');
  });
}

/**
 * Initialize category filters
 */
function initCategoryFilters() {
  const container = document.getElementById('category-filters');
  if (!container) return;
  
  const categories = [
    { value: 'all', label: 'all_categories' },
    { value: 'painkiller', label: 'category_painkiller' },
    { value: 'antibiotic', label: 'category_antibiotic' },
    { value: 'antiviral', label: 'category_antiviral' },
    { value: 'antihistamine', label: 'category_antihistamine' },
    { value: 'vitamin', label: 'category_vitamin' },
    { value: 'digestive', label: 'category_digestive' },
    { value: 'cardiovascular', label: 'category_cardiovascular' },
    { value: 'dermatology', label: 'category_dermatology' },
    { value: 'first_aid', label: 'category_first_aid' },
    { value: 'ophthalmology', label: 'category_ophthalmology' },
    { value: 'dental', label: 'category_dental' },
    { value: 'other', label: 'category_other' }
  ];
  
  container.innerHTML = categories.map(cat => 
    `<button class="filter-chip ${cat.value === 'all' ? 'active' : ''}" data-category="${cat.value}" data-i18n="${cat.label}">${t(cat.label)}</button>`
  ).join('');
  
  // Attach listeners
  container.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      currentCategory = chip.dataset.category;
      
      container.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      
      applyFiltersAndSort();
      renderProducts();
    });
  });
}

// Helper functions
function formatPrice(price) {
  if (price === null || price === undefined) return '0€';
  return `${parseFloat(price).toFixed(2)}€`;
}

function formatDate(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatBarcode(barcode) {
  if (!barcode) return '';
  return barcode.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1-$2-$3-$4');
}

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
