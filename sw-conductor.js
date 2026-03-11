// SCZ LIVE – Service Worker Conductor
// Mantiene la app activa el mayor tiempo posible
var CACHE = 'sczlive-conductor-v1';

self.addEventListener('install', function(e) {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE).then(function(cache) {
            return cache.add('/sczlive/conductor.html');
        })
    );
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(k) { return k !== CACHE; })
                    .map(function(k) { return caches.delete(k); })
            );
        }).then(function() { return self.clients.claim(); })
    );
});

// Fetch — network first con fallback a caché
self.addEventListener('fetch', function(e) {
    if (!e.request.url.startsWith(self.location.origin)) return;
    e.respondWith(
        fetch(e.request).catch(function() {
            return caches.match(e.request);
        })
    );
});

// Sync en background — cuando el dispositivo recupera conexión
self.addEventListener('sync', function(e) {
    if (e.tag === 'gps-sync') {
        // Firebase maneja la reconexión automáticamente
        console.log('SCZ LIVE: sync GPS');
    }
});

// Mantener SW vivo con mensajes periódicos desde la app
self.addEventListener('message', function(e) {
    if (e.data && e.data.tipo === 'keepalive') {
        // Responder para confirmar que SW sigue activo
        e.ports[0].postMessage({ vivo: true });
    }
});
