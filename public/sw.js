'use strict';


self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  
    const title = 'Notificación';
    const options = {
      body: 'Hola soy la notificacion del equipo 2',
      icon: 'images/icons/ico64.png',
      badge: 'images/badge.png'
    };
    self.registration.showNotification(title, options);
  
    const notificationPromise = self.registration.showNotification(title, options);
    event.waitUntil(notificationPromise);
  });

  self.addEventListener('notificationclick', function(event) {
    //---access data from event using event.notification.data---
    console.log('On notification click: ', event.notification.data);
    var url = './contact.html';

    //---close the notification---
    event.notification.close();

    //---open the app and navigate to breaking.html
    // after clicking the notification---
    event.waitUntil(
        clients.openWindow(url)
    );
});

  
  


  /*
  const cachePWA = 'cache-site-v1';

const assets = [
    "/",
    "/index.html",
    "/contac.html",
    "/elements.html",
    "/generic.html",
    "/css/style.css",
    "/js/app.js",
    "assets/css/images/overlay.png",
    "assets/css/fontawesome-all.min.css",
    "assets/css/main.css",
    "assets/js/breakpoints.min.js",
    "assets/js/browser.min.js",
    "assets/js/jquery.dropotron.min.js",
    "assets/js/jquery.min.js",
    "assets/js/jquery.scrollex.min.js",
    "assets/js/main.js",
    "assets/js/utils.js",
    "images/banner.jpg",
    "images/pic01.jpg",
    "images/pic02.jpg",
    "images/pic03.jpg",
    "images/pic04.jpg",
    "images/pic05.jpg",
    "img/icons/ico32.png",
    "img/icons/ico64.png",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
];

self.addEventListener('install', installEvent => {
    installEvent.waitUntil(
        caches.open(cachePWA)
        .then( cacheResh => { 
            return cacheResh.addAll(assets);
    })
    )
});

self.addEventListener('fetch', fetchEvent => {
    //console.log(fetchEvent.request.url);
    fetchEvent.respondWith(
        caches.open(cachePWA).then(cache => {
            return cache.match(fetchEvent.request).then(response => {
                return response || fetch(fetchEvent.request).then( response => {
                    cache.put(fetchEvent.request, response.clone());
                });
            });
        })
    )
});
*/