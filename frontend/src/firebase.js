import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDX5QQPVMX_voM8yu91UUSVfNjx_o2LZu4",
  authDomain: "gonullu-platformu.firebaseapp.com",
  databaseURL: "https://gonullu-platformu-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gonullu-platformu",
  storageBucket: "gonullu-platformu.firebasestorage.app",
  messagingSenderId: "856922058895",
  appId: "1:856922058895:web:58c745ab02a54e98e600fa",
  measurementId: "G-LR1W0CKHVG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('FCM Service Worker başarıyla kaydedildi:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker kaydı sırasında hata oluştu:', error);
    }
  }
};

export default app;