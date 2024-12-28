importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');


firebase.initializeApp({
  apiKey: "AIzaSyD4Sj7w7n1RABDD1oOkxNjLX3_VqZF7jo4",
  authDomain: "campvoiceus.firebaseapp.com",
  projectId: "campvoiceus",
  storageBucket: "campvoiceus.firebasestorage.app",
  messagingSenderId: "1052041251379",
  appId: "1:1052041251379:web:e9c07138a23e33ab563146",
  measurementId: "G-4DV137DW90",
});
  

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/ic_launcher_round.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});