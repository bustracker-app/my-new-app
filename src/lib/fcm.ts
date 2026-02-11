'use client';

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { FirebaseApp } from "firebase/app";
import { Firestore } from "firebase/firestore";

export async function requestNotificationPermission(userId: string, firestore: Firestore, firebaseApp: FirebaseApp) {
  try {
    const messaging = getMessaging(firebaseApp);
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      // =====================================================================================
      // IMPORTANT: You need to generate this VAPID key in your Firebase project console.
      // Go to Project Settings > Cloud Messaging > Web configuration and generate a key pair.
      // Then, paste the public key here.
      // =====================================================================================
      const VAPID_KEY = 'BF_Z6r5_nMcqw4aEh2MJDB6q6dQYODDT869V5yMQM4_hlamPMaBLDCMAQHicv4mnSBjstVrfHBCcVWGGGOSNM9o';

      const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      
      if (fcmToken) {
        const { doc, updateDoc } = await import('firebase/firestore');
        const userDocRef = doc(firestore, 'users', userId);
        await updateDoc(userDocRef, { fcmToken });
        console.log('FCM token stored successfully:', fcmToken);
        return 'granted';
      }
    }
    return 'denied';
  } catch (error) {
    console.error("An error occurred while requesting notification permission.", error);
    return 'error';
  }
}

export function setupForegroundMessageListener(firebaseApp: FirebaseApp, callback: (payload: any) => void) {
    const messaging = getMessaging(firebaseApp);
    onMessage(messaging, (payload) => {
        console.log("Foreground message received:", payload);
        callback(payload);
    });
}
