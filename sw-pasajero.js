// SCZ LIVE – Service Worker Pasajero
var CACHE = 'sczlive-pasajero-v1';
var ARCHIVOS = [
    '/sczlive/pasajero.html'
];

self.addEventListener('install', function(e) {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE).then(function(cache) {
            return cache.addAll(ARCHIVOS);
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

// Network first — siempre intentar red, caché como fallback
self.addEventListener('fetch', function(e) {
    // Solo cachear requests del mismo origen
    if (!e.request.url.startsWith(self.location.origin)) return;
    
    e.respondWith(
        fetch(e.request)
            .catch(function() { return caches.match(e.request); })
    );
});
