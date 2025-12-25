// Service Worker for Pharma Scanner PWA
// Cache-first strategy for offline functionality

const CACHE_NAME = 'pharma-scanner-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/styles.css',
  '/css/animations.css',
  '/css/themes.css',
  '/css/responsive.css',
  '/js/app.js',
  '/js/auth.js',
  '/js/db.js',
  '/js/scanner.js',
  '/js/products.js',
  '/js/ui.js',
  '/js/i18n.js',
  '/js/stats.js',
  '/js/utils.js',
  '/locales/fr.json',
  '/locales/en.json',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/images/logo.svg',
  '/assets/images/welcome.svg',
  '/assets/images/empty-states/no-products.svg',
  '/assets/images/empty-states/no-results.svg',
  '/assets/images/empty-states/error.svg',
  'https://cdn.jsdelivr.net/npm/@zxing/library@0.20.0/umd/index.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/idb@8.0.0/build/umd.js'
];

// Install event - cache all necessary files
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })))
          .catch(err => {
            console.warn('[SW] Failed to cache some resources:', err);
            // Continue even if some resources fail to cache
            return Promise.resolve();
          });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - cache-first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }

        return fetch(event.request).then(response => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the fetched resource
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return response;
        }).catch(() => {
          // Return offline fallback if available
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Background sync (optional - for future use)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-products') {
    console.log('[SW] Background sync triggered');
    // Handle background sync if needed
  }
});

// Push notifications (optional - for future use)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from Pharma Scanner',
    icon: '/assets/icons/icon-192.png',
    badge: '/assets/icons/icon-192.png',
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification('Pharma Scanner', options)
  );
});
