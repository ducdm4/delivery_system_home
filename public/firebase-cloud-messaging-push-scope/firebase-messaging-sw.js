importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js',
);

const firebaseConfig = {
  apiKey: 'AIzaSyD80ARblxY_LnRznwmySo-WExRKx_OdOJc',
  authDomain: 'delivery-system-ccad9.firebaseapp.com',
  projectId: 'delivery-system-ccad9',
  storageBucket: 'delivery-system-ccad9.appspot.com',
  messagingSenderId: '978808956556',
  appId: '1:978808956556:web:1c0221228adc9a98787da9',
  measurementId: 'G-QKTK3XVXGE',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title;
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/icons/android-launchericon-512-512.png',
    tag: new Date().getTime(),
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
