importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');


// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyDfGDJHyFTLnJnDCnUkeQGmOuWELQcudv4',
  authDomain: 'the-wan-db-37a19.firebaseapp.com',
  databaseURL: 'https://the-wan-db-37a19-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'the-wan-db-37a19',
  storageBucket: 'the-wan-db-37a19.appspot.com',
  messagingSenderId: '1041584087918',
  appId: '1:1041584087918:web:f30c9816105e75d545177f',
  measurementId: 'G-TEJJNTFDRT'
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});