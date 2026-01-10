const CACHE_NAME = 'uhrzeit-11'; // Ändere die Version, um Updates zu erzwingen
const ASSETS = [
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Installation: Dateien in den Cache laden
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Aktivierung: Alten Cache löschen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Lösche alten Cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Strategie: Stale-While-Revalidate (Optimiert für schlechten Empfang)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // Starte den Netzwerk-Request parallel
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Kopie der Antwort im Hintergrund in den Cache legen
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });

        // Gib sofort die Cache-Antwort zurück, falls vorhanden, sonst warte aufs Netzwerk
        return cachedResponse || fetchPromise;
      });
    })
  );
});
