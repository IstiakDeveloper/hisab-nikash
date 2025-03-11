const CACHE_NAME = 'finance-app-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json'
];

function canCache(url) {

  return url.startsWith(self.location.origin) &&
         (url.startsWith('http://') || url.startsWith('https://'));
}

// Install event handler
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Install error:', error);
      })
  );
});

// Activate event handler
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Now active, controlling clients');
        return self.clients.claim();
      })
  );
});

// Fetch event handler
self.addEventListener('fetch', event => {
  // Skip non-GET requests and uncacheable URLs
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension requests and other non-cacheable URLs
  const requestUrl = new URL(event.request.url);
  if (!canCache(event.request.url)) {
    console.log('[Service Worker] Skipping non-cacheable URL:', event.request.url);
    return; // Let the browser handle these requests normally
  }

  // Cache-first for static assets, network-first for everything else
  const isStaticAsset = STATIC_ASSETS.includes(requestUrl.pathname);

  if (isStaticAsset) {
    // Cache-first strategy for static assets
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetchAndCache(event.request);
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          return new Response('Network error', { status: 408 });
        })
    );
  } else {
    // Network-first strategy for dynamic content
    event.respondWith(
      fetchAndCache(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }

              if (event.request.mode === 'navigate') {
                return caches.match('/offline.html');
              }

              return new Response('Network error', { status: 408 });
            });
        })
    );
  }
});

// Helper function to fetch and cache a request
function fetchAndCache(request) {
  return fetch(request)
    .then(response => {
      // Check if response is valid
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }

      try {
        // Clone the response
        const responseToCache = response.clone();

        // Only try to cache if the URL is cacheable
        if (canCache(request.url)) {
          caches.open(DYNAMIC_CACHE)
            .then(cache => {
              try {
                cache.put(request, responseToCache)
                  .catch(error => console.error('[Service Worker] Cache put error:', error));
              } catch (e) {
                console.error('[Service Worker] Cache error:', e);
              }
            })
            .catch(error => console.error('[Service Worker] Cache open error:', error));
        }
      } catch (e) {
        console.error('[Service Worker] Response clone error:', e);
      }

      return response;
    });
}
