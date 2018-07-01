import idb from 'idb';
import getAPI from './src/utilities/getAPI';

var currencyCache = 'mws-currency-cache';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(currencyCache).then(function(cache) {
      return cache.addAll([
        'index.html',
        'dist/main.js',
        'sw.js',
        'img/app-bg.png',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css',
        'https://code.jquery.com/jquery-3.3.1.slim.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('mws-') &&
                 cacheName != currencyCache;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );

});


