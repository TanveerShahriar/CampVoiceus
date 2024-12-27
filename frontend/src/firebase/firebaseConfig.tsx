import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyD4Sj7w7n1RABDD1oOkxNjLX3_VqZF7jo4",
    authDomain: "campvoiceus.firebaseapp.com",
    projectId: "campvoiceus",
    storageBucket: "campvoiceus.firebasestorage.app",
    messagingSenderId: "1052041251379",
    appId: "1:1052041251379:web:e9c07138a23e33ab563146",
    measurementId: "G-4DV137DW90",
};

const firebaseApp = initializeApp(firebaseConfig);

export const initializeMessaging = async () => {
    const supported = await isSupported();
    if (!supported) {
      console.warn("Firebase Messaging is not supported on this browser.");
      return null;
    }
    return getMessaging(firebaseApp);
  };
