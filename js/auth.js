// Authentication module for Pharma Scanner

import * as db from './db.js';
import { hashPassword, validateEmail, validatePassword } from './utils.js';
import { showToast, showLoading, hideLoading, showScreen, showApp } from './ui.js';
import { t } from './i18n.js';

let currentUser = null;

/**
 * Get current logged-in user
 * @returns {Object|null} Current user
 */
export function getCurrentUser() {
  return currentUser;
}

/**
 * Check if user is logged in
 * @returns {boolean} True if logged in
 */
export function isLoggedIn() {
  return currentUser !== null;
}

/**
 * Initialize authentication
 * @returns {Promise<boolean>} True if user is already logged in
 */
export async function initAuth() {
  // Check for remembered user
  const rememberedUserId = localStorage.getItem('pharma-remembered-user');
  
  if (rememberedUserId) {
    try {
      const user = await db.getUserById(parseInt(rememberedUserId));
      if (user) {
        currentUser = user;
        return true;
      }
    } catch (error) {
      console.error('Error loading remembered user:', error);
    }
  }
  
  return false;
}

/**
 * Sign up new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
export async function signup(userData) {
  showLoading();
  
  try {
    // Validate input
    if (!userData.username || userData.username.trim().length < 3) {
      throw new Error(t('error_username_short'));
    }
    
    if (!validateEmail(userData.email)) {
      throw new Error(t('error_invalid_email'));
    }
    
    if (!validatePassword(userData.password)) {
      throw new Error(t('error_password_short'));
    }
    
    if (userData.password !== userData.passwordConfirm) {
      throw new Error(t('error_password_mismatch'));
    }
    
    // Check if email exists
    const existingUser = await db.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error(t('error_email_exists'));
    }
    
    // Hash password
    const passwordHash = await hashPassword(userData.password);
    
    // Create user
    const userId = await db.createUser({
      username: userData.username.trim(),
      email: userData.email.trim().toLowerCase(),
      passwordHash,
      photo: null
    });
    
    // Get created user
    const user = await db.getUserById(userId);
    currentUser = user;
    
    // Initialize default settings
    await db.saveSettings(userId, {
      language: 'fr',
      theme: 'auto',
      notifications: false
    });
    
    showToast(t('success_signup'), 'success');
    return user;
    
  } catch (error) {
    showToast(error.message, 'error');
    throw error;
  } finally {
    hideLoading();
  }
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} rememberMe - Remember user
 * @returns {Promise<Object>} Logged in user
 */
export async function login(email, password, rememberMe = false) {
  showLoading();
  
  try {
    // Validate input
    if (!validateEmail(email)) {
      throw new Error(t('error_invalid_email'));
    }
    
    if (!password) {
      throw new Error(t('error_required'));
    }
    
    // Get user by email
    const user = await db.getUserByEmail(email.trim().toLowerCase());
    if (!user) {
      throw new Error(t('error_invalid_credentials'));
    }
    
    // Verify password
    const passwordHash = await hashPassword(password);
    if (passwordHash !== user.passwordHash) {
      throw new Error(t('error_invalid_credentials'));
    }
    
    // Set current user
    currentUser = user;
    
    // Remember user if requested
    if (rememberMe) {
      localStorage.setItem('pharma-remembered-user', user.id.toString());
    } else {
      localStorage.removeItem('pharma-remembered-user');
    }
    
    showToast(`${t('hello')} ${user.username}! 👋`, 'success');
    return user;
    
  } catch (error) {
    showToast(error.message, 'error');
    throw error;
  } finally {
    hideLoading();
  }
}

/**
 * Logout current user
 */
export function logout() {
  currentUser = null;
  localStorage.removeItem('pharma-remembered-user');
  showToast(t('success_logout'), 'success');
  showScreen('auth-screen');
}

/**
 * Update user profile
 * @param {Object} updates - Updates to apply
 * @returns {Promise<void>}
 */
export async function updateProfile(updates) {
  if (!currentUser) {
    throw new Error('No user logged in');
  }
  
  showLoading();
  
  try {
    await db.updateUser(currentUser.id, updates);
    
    // Update current user object
    Object.assign(currentUser, updates);
    
    showToast(t('success_profile_updated'), 'success');
  } catch (error) {
    showToast(error.message, 'error');
    throw error;
  } finally {
    hideLoading();
  }
}

/**
 * Initialize auth form listeners
 */
export function initAuthForms() {
  // Auth tabs
  const authTabs = document.querySelectorAll('.auth-tab');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      // Update active tab
      authTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show/hide forms
      if (targetTab === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
      } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
      }
    });
  });
  
  // Switch to signup
  document.querySelectorAll('.switch-to-signup').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('[data-tab="signup"]').click();
    });
  });
  
  // Switch to login
  document.querySelectorAll('.switch-to-login').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('[data-tab="login"]').click();
    });
  });
  
  // Login form submit
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    try {
      await login(email, password, rememberMe);
      showApp();
      
      // Trigger dashboard update
      window.dispatchEvent(new Event('user-logged-in'));
    } catch (error) {
      // Error already shown in login function
    }
  });
  
  // Signup form submit
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById('signup-password-confirm').value;
    
    try {
      await signup({ username, email, password, passwordConfirm });
      showApp();
      
      // Trigger dashboard update
      window.dispatchEvent(new Event('user-logged-in'));
    } catch (error) {
      // Error already shown in signup function
    }
  });
  
  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
    });
  }
}
