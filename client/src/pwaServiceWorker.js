// https://medium.com/james-johnson/a-simple-progressive-web-app-tutorial-f9708e5f2605
// EOS in a Box doesn't need to cache all files, since there is little sense in running this PWA offline
var cacheName = 'eosinabox-pwa';

/* Start the service worker and cache all of the app's content */
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
    console.log('[pwaServiceWorker][fetch][POST][a]', e.request.url );
    if(e.request.url.includes('v1/chain/push_transaction')){
      console.log('[pwaServiceWorker][fetch][POST][A ha! skip push transaction!]' );
      return;
    }
    fetch(e.request).then(function (response) {
      console.log('[pwaServiceWorker][fetch][POST][b]', e.request.url );
      return response;
    });
  }else{
    e.respondWith(
      caches.match(e.request).then(function(cachedResponse) {
        console.log('[pwaServiceWorker][fetch][1]', e.request.url);
        fetch(e.request).then(function (response) {
          console.log('[pwaServiceWorker][fetch][2]' );
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
