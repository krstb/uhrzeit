const CACHE_NAME = 'uhrzeit-v4';
const ASSETS = [
  'index.html',
  'manifest.json',
  'https://cdn.tailwindcss.com',
  'icon-192.png',
  'icon-512.png'
];

// 1. Installation: Alle Dateien in den Speicher laden
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Lädt alle oben genannten Dateien lokal auf das Gerät
      return cache.addAll(ASSETS);
    })
  );
  // Aktiviert den Service Worker sofort ohne Neustart
  self.skipWaiting();
});

// 2. Aktivierung: Alten Speicher (Cache) aufräumen
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

// 3. Abruf-Strategie: Cache-First (Wichtig für stabilen Flugmodus)
// Diese Logik verhindert die Fehlermeldung beim Refresh im Offline-Zustand
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Wenn die Datei im Cache gefunden wurde, liefere sie SOFORT aus
      // Nur wenn sie nicht im Cache ist, versuche sie über das Netzwerk zu laden
      return response || fetch(event.request);
    })
  );
});
