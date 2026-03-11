// SCZ LIVE – Service Worker Admin
var CACHE = 'sczlive-admin-v1';

self.addEventListener('install', function(e) {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE).then(function(cache) {
            return cache.add('/sczlive/admin.html');
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

self.addEventListener('fetch', function(e) {
    if (!e.request.url.startsWith(self.location.origin)) return;
    e.respondWith(
        fetch(e.request).catch(function() {
            return caches.match(e.request);
        })
    );
});
