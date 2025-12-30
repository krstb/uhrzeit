// Versionierung durch den Namen
const CACHE_NAME = 'uhrzeit-v1.2'; // Bei Icon-Änderung: v1.2 etc.

// Assets, die GitHub/MDN für die Offline-Fähigkeit empfiehlt
const STATIC_ASSETS = [
  '/',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'https://cdn.tailwindcss.com' // Tailwind-CDN mitcachen!
];

// Installation: Cache befüllen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Pre-caching Assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Aktivierung: Alte Caches sauber entfernen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('SW: Lösche alten Cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch: Die "Stale-While-Revalidate" Strategie
// (Wird oft empfohlen: Zeigt Cache sofort, aktualisiert im Hintergrund)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});ler (Offline) wird der Cache genutzt
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
