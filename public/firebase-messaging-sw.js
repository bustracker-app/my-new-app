// This file must be in the 'public' directory

// Scripts for Firebase (using the compat libraries for service worker support)
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js');

// Your web app's Firebase configuration.
// This is public data and is safe to be here.
const firebaseConfig = {
  "projectId": "studio-8892733844-6d7b0",
  "appId": "1:478035933535:web:41c898bb109fb027541eea",
  "apiKey": "AIzaSyBM2sMPGz4Db-qLetUlmYaiN0maOH0wo3c",
  "authDomain": "studio-8892733844-6d7b0.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "478035933535"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// Optional: If you want to customize how background messages are handled, you can
// add a handler here. By default, FCM will display any notification payload it receives.
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Customize the notification that is shown to the user
  const notificationTitle = payload.notification.title || 'New Message';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new message.',
    icon: '/icon-192.png' // You can add an icon to your /public folder
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
