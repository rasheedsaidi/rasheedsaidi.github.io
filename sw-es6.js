import idb from 'idb';
import getAPI from './src/utilities/getAPI';
import { rejects } from 'assert';

var currencyCache = 'mws-currency-cache';
var dbPromise = idb.open('currency-db', 1, function(upgradeDb) {  
    var keyValStore = upgradeDb.createObjectStore('currencies');
});

var myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');


self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(currencyCache).then(function(cache) {
      return cache.addAll([
        'index.html',
        'dist/main.js',
        'img/app-bg.png',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css'
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
  var requestUrl = new URL(event.request.url);
  console.log(requestUrl.origin, location.origin, requestUrl.pathname);
  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      event.respondWith(caches.match('/index.html'));
      return;
    }
  }

  if(requestUrl.pathname.endsWith('currencies')) {
    event.respondWith(
    dbPromise.then( db => { 
          var tx = db.transaction('currencies');
          var keyValStore = tx.objectStore('currencies');
          return keyValStore.get('currencies');
    }).then( response => {
          
            console.log(response);
            if(!response) {
              throw (response);
            }
            return new Response(response, {headers: myHeaders});
        
    }).catch( e => {
      return getAPI(event.request.url).then( response => { console.log(response);
        return dbPromise.then( db => {
              var tx = db.transaction('currencies', 'readwrite');
              var keyValStore = tx.objectStore('currencies');
              keyValStore.put(response, "currencies");
              tx.complete;
              return new Response(response, {headers: myHeaders});
        })
        //return response;
      });
    })
  )
  //return;
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
