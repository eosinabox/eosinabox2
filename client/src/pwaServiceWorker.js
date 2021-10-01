// https://medium.com/james-johnson/a-simple-progressive-web-app-tutorial-f9708e5f2605
// EOS in a Box doesn't need to cache all files, since there is little sense in running this PWA offline
var cacheName = 'eosinabox-pwa';
var filesToCache = [
  '/',
  '/index.html',
  '/client.js',
  '/cbor.js',
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content but also get from server for next time */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cachedResponse) {
      fetch(e.request).then(function (response) {
        caches.open(cacheName).then(function(cache) {
          cache.put(e.request.url, response.clone());
          return response;
        });
      });
      return cachedResponse;
    }).catch(function(err){ console.log(err); })
  );
});
