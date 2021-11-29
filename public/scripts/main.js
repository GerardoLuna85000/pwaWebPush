'use strict';




const applicationServerPublicKey = 'BB1PGPXVlN0erqzxsTcnaehUD9Y36FD8XnFuu9qyHOuDjzFd4Yt9F93jPHVKMXjX-q6JPLYVr4M9Ka1V42ZYQHU';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

//solo para la key
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}

function initialiseUI() {



  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      // TODO: Unsubscribe user
    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log('User IS subscribed.');
      
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Desactivar push';
    
  } else {
    pushButton.textContent = 'Activar push';
  }

  pushButton.disabled = false;
}

navigator.serviceWorker.register('sw.js')
.then(function(swReg) {
  console.log('Service Worker Registrado', swReg);

  swRegistration = swReg;
  initialiseUI();
})

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('Usuario suscrito:', subscription);

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
    //NOTIFICACION DESPUES DEL REGISTRO DEL USUARIO SUBSCRIPTION
    showNotification('Soy una notificación en automático', 'Mirame!');
  })
  .catch(function(err) {
    console.log('Falla al suscribir el usuario: ', err);
    updateBtn();
  });
}

function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}


//ENVIA LA NOTIFICACION EN AUTOMÁTICO
function showNotification(title, message) {
  if ('Notification' in window) {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title, {
        body: message,
        tag: 'vibration-sample',
        badge: '../images/badge.png',
      });
    });
  }
}
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






/*TRAIDO DE SW.JS PARA PRUEBAS
self.addEventListener('click', function(event) {
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
*/