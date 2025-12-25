// Database module for Pharma Scanner using IndexedDB

const DB_NAME = 'PharmaScanner';
const DB_VERSION = 1;

let db = null;

/**
 * Initialize database
 * @returns {Promise<IDBDatabase>} Database instance
 */
export async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Users store
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        userStore.createIndex('email', 'email', { unique: true });
        userStore.createIndex('username', 'username', { unique: true });
      }

      // Products store
      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
        productStore.createIndex('userId', 'userId', { unique: false });
        productStore.createIndex('barcode', 'barcode', { unique: false });
        productStore.createIndex('category', 'category', { unique: false });
        productStore.createIndex('favorite', 'favorite', { unique: false });
      }

      // Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'userId' });
      }
    };
  });
}

/**
 * Get database instance
 * @returns {Promise<IDBDatabase>}
 */
async function getDB() {
  if (!db) {
    await initDB();
  }
  return db;
}

// User operations

/**
 * Create new user
 * @param {Object} userData - User data
 * @returns {Promise<number>} User ID
 */
export async function createUser(userData) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    
    const user = {
      username: userData.username,
      email: userData.email,
      passwordHash: userData.passwordHash,
      photo: userData.photo || null,
      createdAt: new Date().toISOString()
    };
    
    const request = store.add(user);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object
 */
export async function getUserByEmail(email) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    const index = store.index('email');
    const request = index.get(email);
    
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get user by ID
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} User object
 */
export async function getUserById(userId) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    const request = store.get(userId);
    
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Update user
 * @param {number} userId - User ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<void>}
 */
export async function updateUser(userId, updates) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.get(userId);
    
    request.onsuccess = () => {
      const user = request.result;
      if (!user) {
        reject(new Error('User not found'));
        return;
      }
      
      Object.assign(user, updates);
      const updateRequest = store.put(user);
      updateRequest.onsuccess = () => resolve();
      updateRequest.onerror = () => reject(updateRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Product operations

/**
 * Create new product
 * @param {Object} productData - Product data
 * @returns {Promise<number>} Product ID
 */
export async function createProduct(productData) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['products'], 'readwrite');
    const store = transaction.objectStore('products');
    
    const product = {
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const request = store.add(product);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all products for user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Products array
 */
export async function getProductsByUser(userId) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['products'], 'readonly');
    const store = transaction.objectStore('products');
    const index = store.index('userId');
    const request = index.getAll(userId);
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get product by ID
 * @param {number} productId - Product ID
 * @returns {Promise<Object|null>} Product object
 */
export async function getProductById(productId) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['products'], 'readonly');
    const store = transaction.objectStore('products');
    const request = store.get(productId);
    
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get product by barcode for user
 * @param {string} barcode - Barcode
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} Product object
 */
export async function getProductByBarcode(barcode, userId) {
  const products = await getProductsByUser(userId);
  return products.find(p => p.barcode === barcode) || null;
}

/**
 * Update product
 * @param {number} productId - Product ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<void>}
 */
export async function updateProduct(productId, updates) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['products'], 'readwrite');
    const store = transaction.objectStore('products');
    const request = store.get(productId);
    
    request.onsuccess = () => {
      const product = request.result;
      if (!product) {
        reject(new Error('Product not found'));
        return;
      }
      
      Object.assign(product, updates, { updatedAt: new Date().toISOString() });
      const updateRequest = store.put(product);
      updateRequest.onsuccess = () => resolve();
      updateRequest.onerror = () => reject(updateRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete product
 * @param {number} productId - Product ID
 * @returns {Promise<void>}
 */
export async function deleteProduct(productId) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['products'], 'readwrite');
    const store = transaction.objectStore('products');
    const request = store.delete(productId);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Toggle product favorite
 * @param {number} productId - Product ID
 * @returns {Promise<boolean>} New favorite state
 */
export async function toggleFavorite(productId) {
  const product = await getProductById(productId);
  if (!product) throw new Error('Product not found');
  
  const newFavorite = !product.favorite;
  await updateProduct(productId, { favorite: newFavorite });
  return newFavorite;
}

// Settings operations

/**
 * Get user settings
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Settings object
 */
export async function getSettings(userId) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['settings'], 'readonly');
    const store = transaction.objectStore('settings');
    const request = store.get(userId);
    
    request.onsuccess = () => {
      const settings = request.result || {
        userId,
        language: 'fr',
        theme: 'auto',
        notifications: false
      };
      resolve(settings);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save user settings
 * @param {number} userId - User ID
 * @param {Object} settings - Settings to save
 * @returns {Promise<void>}
 */
export async function saveSettings(userId, settings) {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['settings'], 'readwrite');
    const store = transaction.objectStore('settings');
    
    const settingsData = {
      userId,
      ...settings
    };
    
    const request = store.put(settingsData);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Import/Export operations

/**
 * Export all user data
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Exported data
 */
export async function exportUserData(userId) {
  const user = await getUserById(userId);
  const products = await getProductsByUser(userId);
  const settings = await getSettings(userId);
  
  return {
    version: 1,
    exportDate: new Date().toISOString(),
    user: {
      username: user.username,
      email: user.email,
      photo: user.photo,
      createdAt: user.createdAt
    },
    products,
    settings
  };
}

/**
 * Import user data
 * @param {number} userId - User ID
 * @param {Object} data - Data to import
 * @returns {Promise<Object>} Import result
 */
export async function importUserData(userId, data) {
  const database = await getDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['products', 'settings'], 'readwrite');
    
    transaction.oncomplete = () => {
      resolve({
        productsImported: data.products?.length || 0,
        settingsImported: !!data.settings
      });
    };
    
    transaction.onerror = () => reject(transaction.error);
    
    // Import products
    if (data.products && Array.isArray(data.products)) {
      const productStore = transaction.objectStore('products');
      data.products.forEach(product => {
        const productData = {
          ...product,
          userId, // Override with current user ID
          createdAt: product.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        delete productData.id; // Remove old ID to create new
        productStore.add(productData);
      });
    }
    
    // Import settings
    if (data.settings) {
      const settingsStore = transaction.objectStore('settings');
      settingsStore.put({ userId, ...data.settings });
    }
  });
}

/**
 * Clear all data for user
 * @param {number} userId - User ID
 * @returns {Promise<void>}
 */
export async function clearUserData(userId) {
  const database = await getDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['products', 'settings'], 'readwrite');
    
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    
    // Delete all products
    const productStore = transaction.objectStore('products');
    const productIndex = productStore.index('userId');
    const productRequest = productIndex.openCursor(userId);
    
    productRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
    
    // Delete settings
    const settingsStore = transaction.objectStore('settings');
    settingsStore.delete(userId);
  });
}

// Initialize database on module load
initDB().catch(console.error);
