const CACHE_NAME = 'skyfalke-v1.0.1'; // Updated to force cache refresh
const STATIC_CACHE = 'skyfalke-static-v1.0.1'; // Updated version
const DYNAMIC_CACHE = 'skyfalke-dynamic-v1.0.1'; // Updated version
const API_CACHE = 'skyfalke-api-v1.0.1'; // Updated version

// Files to cache immediately
// NOTE: Do NOT cache '/' or '/index.html' - these need SSR to inject meta tags
const STATIC_FILES = [
  // Removed '/' and '/index.html' to allow SSR to work
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/images/logos/logo.svg',
  '/images/hero/1.webp',
  '/images/hero/2.webp',
  '/images/hero/3.webp',
  '/images/hero/business_tools.webp',
  '/images/hero/digital_marketing.webp',
  '/images/hero/skyfalke_cloud.webp',
  '/images/services/business-tools.webp',
  '/images/services/cloud-solutions.webp',
  '/images/services/creative-services.webp',
  '/images/customers/awl.png',
  '/images/customers/cfao.png',
  '/images/customers/mka.webp',
  '/images/customers/qm.png',
  '/images/customers/tc.webp',
  '/images/customers/te.png',
  '/images/partners/acronis.svg',
  '/images/partners/backblaze.svg',
  '/images/partners/cloudflare.svg',
  '/images/partners/tiktok.svg'
];

// PWA Icons to cache (separate from static files to avoid duplicates)
const PWA_ICONS = [
  // Remove favicon.ico since it's already in STATIC_FILES
];

// API routes to cache
const API_ROUTES = [
  '/api/contact/submit',
  '/api/blog',
  '/api/case-studies',
  '/api/services'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        // Only cache STATIC_FILES since PWA_ICONS is now empty
        return cache.addAll(STATIC_FILES);
      }),
      caches.open(API_CACHE).then((cache) => {
        return cache.addAll(API_ROUTES);
      })
    ]).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete ALL old caches to ensure fresh start
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== API_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Also delete any cached HTML pages
      return Promise.all([
        caches.open(STATIC_CACHE).then(cache => {
          return cache.delete('/').then(() => cache.delete('/index.html'));
        }),
        caches.open(DYNAMIC_CACHE).then(cache => {
          return cache.delete('/').then(() => cache.delete('/index.html'));
        })
      ]);
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // IMPORTANT: For HTML pages (navigation requests), always use network-first
  // This allows SSR to inject meta tags dynamically
  // Never cache HTML pages - they need fresh SSR content
  if (request.mode === 'navigate' || 
      request.destination === 'document' ||
      url.pathname === '/' ||
      url.pathname === '/index.html' ||
      url.pathname.endsWith('.html')) {
    // Network-first for HTML - always fetch from server to get SSR meta tags
    // Bypass cache completely for HTML pages to ensure SSR works
    event.respondWith(
      fetch(request, {
        cache: 'no-store', // Don't use browser cache
        headers: {
          'Cache-Control': 'no-cache'
        }
      }).catch(() => {
        // Only use cache if network fails (offline)
        return caches.match(request);
      })
    );
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static file requests
  if (url.origin === self.location.origin) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Handle external requests (images, fonts, etc.)
  if (url.origin !== self.location.origin) {
    event.respondWith(handleExternalRequest(request));
    return;
  }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the successful response
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline response for API requests
  return new Response(
    JSON.stringify({ 
      error: 'You are offline. Please check your connection and try again.',
      offline: true 
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Handle static file requests with cache-first strategy
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response for future use
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Handle external requests with cache-first strategy
async function handleExternalRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache external resources
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Get pending requests from IndexedDB
    const pendingRequests = await getPendingRequests();
    
    for (const request of pendingRequests) {
      try {
        const response = await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body
        });
        
        if (response.ok) {
          // Remove from pending requests
          await removePendingRequest(request.id);
        }
      } catch (error) {
      }
    }
  } catch (error) {
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon.ico'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Skyfalke', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions for IndexedDB operations
async function getPendingRequests() {
  // Implementation for getting pending requests from IndexedDB
  return [];
}

async function removePendingRequest(id) {
  // Implementation for removing pending request from IndexedDB
  return;
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
