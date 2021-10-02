// https://medium.com/james-johnson/a-simple-progressive-web-app-tutorial-f9708e5f2605
// EOS in a Box doesn't need to cache all files, since there is little sense in running this PWA offline
// warning the above example is a pretty bad starting point, had to modify in some crucial points
// example, skip trying to cache POST requests, skip sending the v1/chain/push_transaction
// since it is being sent from eos.js independently and we would get a "double send error"
var cacheName = 'eosinabox-pwa';

/* Start the service worker and cache some of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/client.js',
        '/cbor.js',
      ]);
    })
  );
});

/* Serve cached content but also get from server for next time */
self.addEventListener('fetch', function(e) {
  if(e.request.method=='POST'){
    if(e.request.url.includes('v1/chain/push_transaction')){
      console.log('[pwaServiceWorker][fetch][POST][A ha! skip (double) push transaction!]' );
      return;
    }
    fetch(e.request).then(function (response) { return response; });
  }else{
    e.respondWith(
      caches.match(e.request).then(function(cachedResponse) {
        fetch(e.request).then(function (response) {
          caches.open(cacheName).then(function(cache) {
            cache.put(e.request.url, response.clone());
            return response;
          });
        });
        return cachedResponse;
      }).catch(function(err){ console.log('[pwaServiceWorker][fetch] ERR ', err); })
    );
  }
});
