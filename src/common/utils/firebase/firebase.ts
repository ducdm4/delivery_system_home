import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyD80ARblxY_LnRznwmySo-WExRKx_OdOJc',
  authDomain: 'delivery-system-ccad9.firebaseapp.com',
  projectId: 'delivery-system-ccad9',
  storageBucket: 'delivery-system-ccad9.appspot.com',
  messagingSenderId: '978808956556',
  appId: '1:978808956556:web:1c0221228adc9a98787da9',
  measurementId: 'G-QKTK3XVXGE',
};

const fb = initializeApp(firebaseConfig);

export default fb;
