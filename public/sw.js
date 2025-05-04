// This is a simple service worker for the PWA
// The vite-plugin-pwa will handle most of the PWA functionality

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Basic offline fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // Return the offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        
        // Just return a simple error for other requests
        return new Response('Network error happened', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' },
        });
      }),
  );
});
