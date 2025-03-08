// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const FIREBASE_API = process.env.FIRBASE_API_KEY;

const firebaseConfig = {
  apiKey: FIREBASE_API,
  authDomain: "peerconnect-2024.firebaseapp.com",
  projectId: "peerconnect-2024",
  storageBucket: "peerconnect-2024.firebasestorage.app",
  messagingSenderId: "157966842207",
  appId: "1:157966842207:web:82389ac54ba68c8241deea",
  measurementId: "G-T72VK8ZTK5",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
const analytics = getAnalytics(FIREBASE_APP);
