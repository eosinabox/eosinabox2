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

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  // console.log('[pwaServiceWorker] network or cache: ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request).then(function (response) {
        console.log('[pwaServiceWorker] Caching new resource: ' + e.request.url, '[response]', response);
        caches.open(cacheName).then(function(cache) {
          cache.put(e.request.url, response.clone());
          return response;
        });
      });
    }).catch(function(err){ console.log(err); })
  );
});
