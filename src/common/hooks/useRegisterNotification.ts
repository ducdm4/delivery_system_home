'use client';

import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from '../utils/firebase/firebase';
import { useEffect, useState } from 'react';

export const useRegisterNotification = () => {
  const [isCalled, setIsCalled] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      !isCalled
    ) {
      const messaging = getMessaging(firebaseApp);
      onMessage(messaging, (payload) => {
        new Notification(payload.notification?.title as string, {
          body: payload.notification?.body as string,
          icon: '/icons/android-launchericon-512-512.png',
        });
      });
      setIsCalled(true);
    }
  }, []);

  return isCalled;
};
