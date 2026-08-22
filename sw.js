/* ==========================================================================
   GEMOCEAN — Service Worker (High Reliability & Performance Caching)
   ========================================================================== */

const CACHE_NAME = 'gemocean-v1.2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './collection.html',
  './ruby.html',
  './emerald.html',
  './sapphire.html',
  './about.html',
  './contact.html',
  './css/style.css',
  './js/main.js',
  './favicon.ico',
  './favicon.svg',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './favicon-48x48.png',
  './apple-touch-icon.png',
  './android-chrome-192x192.png',
  './site.webmanifest',
  './assets/ruby.jpg',
  './assets/emerald.jpg',
  './assets/sapphire.jpg',
  './assets/collection-trio.jpg',
  './robots.txt',
  './sitemap.xml'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('SW cache addAll partial warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests for same-origin or fonts/images
  if (event.request.method !== 'GET') return;

  // Stale-While-Revalidate for local assets and HTML pages
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Return cached version or fallback if offline
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
