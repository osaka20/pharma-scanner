// Statistics and charts module for Pharma Scanner

import * as db from './db.js';
import { getCurrentUser } from './auth.js';
import { t } from './i18n.js';
import { average, groupBy } from './utils.js';

let categoryChart = null;

/**
 * Calculate statistics for user
 */
export async function calculateStats() {
  const user = getCurrentUser();
  if (!user) {
    return {
      total: 0,
      average: 0,
      totalValue: 0,
      favorites: 0,
      byCategory: {},
      recent: [],
      expiringSoon: [],
      lowStock: []
    };
  }
  
  try {
    const products = await db.getProductsByUser(user.id);
    
    const total = products.length;
    const prices = products.map(p => p.price);
    const averagePrice = average(prices);
    const totalValue = prices.reduce((sum, price) => sum + price, 0);
    const favorites = products.filter(p => p.favorite).length;
    
    // Group by category
    const byCategory = groupBy(products, 'category');
    
    // Recent products (last 5)
    const recent = products
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    // Expiring soon (< 30 days)
    const expiringSoon = products.filter(p => {
      if (!p.expiryDate) return false;
      const days = daysUntilExpiry(p.expiryDate);
      return days >= 0 && days < 30;
    }).sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    
    // Low stock (quantity < 5)
    const lowStock = products.filter(p => p.quantity && p.quantity < 5);
    
    return {
      total,
      average: averagePrice,
      totalValue,
      favorites,
      byCategory,
      recent,
      expiringSoon,
      lowStock
    };
  } catch (error) {
    console.error('Error calculating stats:', error);
    return {
      total: 0,
      average: 0,
      totalValue: 0,
      favorites: 0,
      byCategory: {},
      recent: [],
      expiringSoon: [],
      lowStock: []
    };
  }
}

/**
 * Update dashboard statistics
 */
export async function updateDashboard() {
  const stats = await calculateStats();
  
  // Update stat cards
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-average').textContent = formatPrice(stats.average);
  document.getElementById('stat-value').textContent = formatPrice(stats.totalValue);
  document.getElementById('stat-favorites').textContent = stats.favorites;
  
  // Update username
  const user = getCurrentUser();
  if (user) {
    document.getElementById('user-name').textContent = user.username;
  }
  
  // Update category chart
  updateCategoryChart(stats.byCategory);
  
  // Update recent products
  updateRecentProducts(stats.recent);
  
  // Update expiring soon
  updateExpiringProducts(stats.expiringSoon);
}

/**
 * Update category distribution chart
 */
function updateCategoryChart(byCategory) {
  const canvas = document.getElementById('category-chart');
  if (!canvas) return;
  
  // Check if Chart.js is available
  if (typeof Chart === 'undefined') {
    console.error('Chart.js not loaded');
    return;
  }
  
  // Destroy existing chart
  if (categoryChart) {
    categoryChart.destroy();
  }
  
  // Prepare data
  const categories = Object.keys(byCategory);
  const data = categories.map(cat => byCategory[cat].length);
  const labels = categories.map(cat => `${getCategoryIcon(cat)} ${t('category_' + cat)}`);
  
  const colors = [
    '#667eea', '#764ba2', '#51cf66', '#ffd93d', '#ff6b6b',
    '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6',
    '#8b5cf6', '#ec4899'
  ];
  
  // Create chart
  categoryChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

/**
 * Update recent products list
 */
function updateRecentProducts(products) {
  const container = document.getElementById('recent-products');
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = `<p class="text-muted">${t('no_products')}</p>`;
    return;
  }
  
  container.innerHTML = products.map(product => `
    <div class="product-list-item" style="cursor: pointer;" data-product-id="${product.id}">
      <div style="width: 60px; height: 60px; border-radius: var(--radius-md); overflow: hidden; background: var(--bg-tertiary);">
        ${product.photo ? `<img src="${product.photo}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">📦</div>`}
      </div>
      <div style="flex: 1; min-width: 0;">
        <div style="font-weight: 600; margin-bottom: 0.25rem;">${product.name}</div>
        <div style="color: var(--success); font-weight: 600;">${formatPrice(product.price)}</div>
        <div style="font-size: var(--font-size-sm); color: var(--text-tertiary);">${formatDate(product.createdAt)}</div>
      </div>
    </div>
  `).join('');
}

/**
 * Update expiring soon products
 */
function updateExpiringProducts(products) {
  const container = document.getElementById('expiring-products');
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = `<p class="text-muted">${t('no_expiring_products')}</p>`;
    return;
  }
  
  container.innerHTML = products.map(product => {
    const days = daysUntilExpiry(product.expiryDate);
    const badgeClass = days < 7 ? 'badge-danger' : 'badge-warning';
    
    return `
      <div class="product-list-item" style="cursor: pointer;" data-product-id="${product.id}">
        <div style="width: 60px; height: 60px; border-radius: var(--radius-md); overflow: hidden; background: var(--bg-tertiary);">
          ${product.photo ? `<img src="${product.photo}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">📦</div>`}
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 600; margin-bottom: 0.25rem;">${product.name}</div>
          <div style="color: var(--success); font-weight: 600;">${formatPrice(product.price)}</div>
          <div>
            <span class="badge ${badgeClass}">${t('expires_in')} ${days} ${t('days')}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Update profile statistics
 */
export async function updateProfileStats() {
  const stats = await calculateStats();
  const user = getCurrentUser();
  
  if (!user) return;
  
  document.getElementById('profile-username').textContent = user.username;
  document.getElementById('profile-email').textContent = user.email;
  document.getElementById('profile-member-since').textContent = formatDate(user.createdAt);
  
  document.getElementById('profile-stat-products').textContent = stats.total;
  document.getElementById('profile-stat-favorites').textContent = stats.favorites;
  document.getElementById('profile-stat-value').textContent = formatPrice(stats.totalValue);
  
  // Show profile photo if available
  if (user.photo) {
    document.getElementById('profile-photo-img').src = user.photo;
    document.getElementById('profile-photo-img').classList.remove('hidden');
    document.getElementById('profile-photo-placeholder').classList.add('hidden');
  }
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

function daysUntilExpiry(expiryDate) {
  if (!expiryDate) return Infinity;
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const today = new Date();
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
