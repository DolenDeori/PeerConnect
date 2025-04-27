import { initializeApp, getApp, getApps } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: `${process.env.FIREBASE_API_KEY}`,
  authDomain: "peerconnect-2.firebaseapp.com",
  projectId: "peerconnect-2",
  storageBucket: "peerconnect-2.firebasestorage.app",
  messagingSenderId: "431365008939",
  appId: "1:431365008939:web:fe1726767863282860c46e",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
