'use strict';
if(!window.PUSH_PUBLIC_KEY){
	throw new Error('Error');
}
const applicationServerPublicKey = window.PUSH_PUBLIC_KEY;

let isSubscribed = false;
let swRegistration = null;

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
  //mysw.js has the push method and payload, mysw.js also has the eventhandler fr when the notification is clicked
  navigator.serviceWorker.register(window.FRONTEND_HOST + 'assets/js/serviceWorker.js?v=0.0.1') //this MUST be in the same directory as index.php
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
    initialiseUI();

  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed.');

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateSubscription();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateSubscription();
  });
}

function initialiseUI() {
  $('.btn-subscribe').on('click', function(e) {
    $('#push-notif-modal').modal('hide');
    $('#panel-subscribe').hide();
    e.preventDefault();
    subscribeUser();
  });

   // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);
    
    if ($('.subscribe-form').length > 0) {
      if (subscription == null) {
        $('.subscribe-form').show();
      } else {
        var key = subscription.getKey('p256dh');
        var token = subscription.getKey('auth');

        $.post(window.FRONTEND_HOST + 'ajax-is-subscribed', {
          store: window.STORE,
          publicKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
          authToken: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null,
        }, function (response) {
            if (response == 'success') {
              $('.subscribe-form').show();
            }
        });
      }
    }

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateSubscription();
  });
}

function updateSubscription() {
  if (Notification.permission !== 'granted') {
    $('#push-notif-modal').modal('hide');
    $('#panel-subscribe').show();
  }

  if (Notification.permission === 'denied') {
    updateSubscriptionOnServer(null);
    return;
  }
}

function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server
  if (subscription) {
    const key = subscription.getKey('p256dh');
    const token = subscription.getKey('auth');

    fetch(window.FRONTEND_HOST + 'ajax-push-subscribe', {
  		method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
  		body: JSON.stringify({
        store: window.STORE,
        endpoint: subscription.endpoint,
        publicKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
        authToken: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null,
      })
  	}).then(function(response) {
      $('.subscribe-form').hide();
  		return response.text();
  	}).then(function(response) {
  		console.log(response);
  	}).catch(function(err) {
  		// Error :(
  		console.log('error');
  	});
  }
}

// show push notification

$('#show-subscribe-btn').on('click', function(){
  $('#panel-subscribe').addClass('is-active');
  localStorage.setItem("panelSubscribe", "is-active");
});

setTimeout(function() {
  if (Notification.permission != 'denied') {
    var subscribeStatus = localStorage.getItem('panelSubscribe');

    if (subscribeStatus == "is-active") {
      $('#panel-subscribe').addClass('is-active');
    } else if (Notification.permission == 'default'){
      $('#push-notif-modal').modal('show');
      $('#panel-subscribe').removeClass('is-active');
    }
  }
}, 1000);
