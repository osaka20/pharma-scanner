// Main application module for Pharma Scanner

import { initI18n, setLocale, getLocale, t, applyTranslations } from './i18n.js';
import * as db from './db.js';
import { initAuth, initAuthForms, getCurrentUser } from './auth.js';
import { initUI, showScreen, showApp, showToast, showModal, hideModal, navigateTo } from './ui.js';
import { initProducts, loadProducts } from './products.js';
import { initScanner, initScannerControls } from './scanner.js';
import { updateDashboard, updateProfileStats } from './stats.js';
import { downloadJSON, readJSONFile, compressImage } from './utils.js';

let isFirstVisit = false;

/**
 * Initialize the application
 */
async function init() {
  console.log('Initializing Pharma Scanner...');
  
  try {
    // Check first visit
    isFirstVisit = !localStorage.getItem('pharma-visited');
    
    // Initialize database
    await db.initDB();
    console.log('Database initialized');
    
    // Initialize i18n
    await initI18n();
    console.log('I18n initialized');
    
    // Initialize auth
    const loggedIn = await initAuth();
    console.log('Auth initialized, logged in:', loggedIn);
    
    // Initialize UI
    initUI();
    initAuthForms();
    initProducts();
    initScannerControls();
    initSettings();
    initProfile();
    initExportImport();
    
    console.log('UI initialized');
    
    // Show appropriate screen
    if (isFirstVisit) {
      showWelcomeScreen();
    } else if (loggedIn) {
      showApp();
      await onUserLoggedIn();
    } else {
      showScreen('auth-screen');
    }
    
    // Register service worker
    registerServiceWorker();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('Pharma Scanner initialized successfully');
  } catch (error) {
    console.error('Error initializing app:', error);
    showToast('Error initializing application', 'error');
  }
}

/**
 * Show welcome screen
 */
function showWelcomeScreen() {
  showScreen('welcome-screen');
  
  // Language selection
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const locale = btn.dataset.lang;
      await setLocale(locale);
    });
  });
  
  // Start button
  const startBtn = document.getElementById('welcome-start-btn');
  startBtn.addEventListener('click', () => {
    localStorage.setItem('pharma-visited', 'true');
    showScreen('auth-screen');
  });
}

/**
 * Handle user logged in
 */
async function onUserLoggedIn() {
  const user = getCurrentUser();
  if (!user) return;
  
  // Load user settings
  const settings = await db.getSettings(user.id);
  
  // Apply settings
  if (settings.language) {
    await setLocale(settings.language);
  }
  
  if (settings.theme) {
    applyTheme(settings.theme);
  }
  
  // Load data
  await loadProducts();
  await updateDashboard();
  await updateProfileStats();
  
  // Initialize scanner
  await initScanner();
  
  // Navigate to dashboard
  navigateTo('dashboard');
}

/**
 * Initialize settings
 */
function initSettings() {
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  
  // Open settings
  settingsBtn.addEventListener('click', () => {
    showModal('settings-modal');
    loadSettings();
  });
  
  // Language settings
  const langBtns = settingsModal.querySelectorAll('.lang-setting-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const locale = btn.dataset.lang;
      await setLocale(locale);
      
      // Update active state
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Save setting
      const user = getCurrentUser();
      if (user) {
        const settings = await db.getSettings(user.id);
        await db.saveSettings(user.id, { ...settings, language: locale });
      }
      
      showToast(t('settings_saved'), 'success');
    });
  });
  
  // Theme settings
  const themeBtns = settingsModal.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const theme = btn.dataset.theme;
      applyTheme(theme);
      
      // Update active state
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Save setting
      const user = getCurrentUser();
      if (user) {
        const settings = await db.getSettings(user.id);
        await db.saveSettings(user.id, { ...settings, theme });
      }
      
      showToast(t('settings_saved'), 'success');
    });
  });
}

/**
 * Load settings into UI
 */
async function loadSettings() {
  const user = getCurrentUser();
  if (!user) return;
  
  const settings = await db.getSettings(user.id);
  
  // Update language buttons
  const langBtns = document.querySelectorAll('.lang-setting-btn');
  langBtns.forEach(btn => {
    if (btn.dataset.lang === settings.language) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Update theme buttons
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    if (btn.dataset.theme === settings.theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/**
 * Apply theme
 */
function applyTheme(theme) {
  const body = document.body;
  
  // Remove all theme classes
  body.classList.remove('light-theme', 'dark-theme', 'auto-theme');
  
  // Add selected theme
  body.classList.add(`${theme}-theme`);
  
  // Save to localStorage
  localStorage.setItem('pharma-theme', theme);
}

/**
 * Initialize profile
 */
function initProfile() {
  const profilePhotoInput = document.getElementById('profile-photo-input');
  const changePhotoBtn = document.getElementById('change-photo-btn');
  const profilePhoto = document.getElementById('profile-photo');
  
  // Change photo button
  changePhotoBtn?.addEventListener('click', () => {
    profilePhotoInput.click();
  });
  
  // Photo input change
  profilePhotoInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const compressed = await compressImage(file);
      
      // Update UI
      document.getElementById('profile-photo-img').src = compressed;
      document.getElementById('profile-photo-img').classList.remove('hidden');
      document.getElementById('profile-photo-placeholder').classList.add('hidden');
      
      // Save to database
      const user = getCurrentUser();
      if (user) {
        await db.updateUser(user.id, { photo: compressed });
        showToast(t('success_profile_updated'), 'success');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      showToast(t('error'), 'error');
    }
  });
}

/**
 * Initialize export/import
 */
function initExportImport() {
  const exportBtn = document.getElementById('export-btn');
  const importBtn = document.getElementById('import-btn');
  const importInput = document.getElementById('import-input');
  
  // Export
  exportBtn?.addEventListener('click', async () => {
    try {
      const user = getCurrentUser();
      if (!user) return;
      
      const data = await db.exportUserData(user.id);
      const filename = `pharma-scanner-export-${new Date().toISOString().split('T')[0]}.json`;
      downloadJSON(data, filename);
      
      showToast(t('success_export'), 'success');
    } catch (error) {
      console.error('Error exporting data:', error);
      showToast(t('error'), 'error');
    }
  });
  
  // Import
  importBtn?.addEventListener('click', () => {
    importInput.click();
  });
  
  importInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const data = await readJSONFile(file);
      
      // Validate data
      if (!data.products && !data.settings) {
        throw new Error('Invalid import file');
      }
      
      const user = getCurrentUser();
      if (!user) return;
      
      const result = await db.importUserData(user.id, data);
      
      // Reload data
      await loadProducts();
      await updateDashboard();
      
      showToast(t('success_import') + `: ${result.productsImported} ${t('products')}`, 'success');
    } catch (error) {
      console.error('Error importing data:', error);
      showToast(t('error_import_failed'), 'error');
    } finally {
      importInput.value = '';
    }
  });
}

/**
 * Setup global event listeners
 */
function setupEventListeners() {
  // User logged in event
  window.addEventListener('user-logged-in', async () => {
    await onUserLoggedIn();
  });
  
  // Products changed event
  window.addEventListener('products-changed', async () => {
    await updateDashboard();
    await updateProfileStats();
  });
  
  // PWA install prompt
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button/banner if needed
    console.log('PWA install prompt available');
  });
  
  // PWA installed
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed');
    showToast(t('app_installed'), 'success');
  });
  
  // Online/offline status
  window.addEventListener('online', () => {
    showToast(t('back_online'), 'success');
  });
  
  window.addEventListener('offline', () => {
    showToast(t('offline_mode'), 'warning');
  });
  
  // Service worker updates
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service worker updated');
    });
  }
}

/**
 * Register service worker
 */
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered:', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('Service Worker update found');
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New Service Worker installed, refresh to update');
          }
        });
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for debugging
window.PharmaScanner = {
  db,
  getCurrentUser,
  getLocale,
  setLocale
};
