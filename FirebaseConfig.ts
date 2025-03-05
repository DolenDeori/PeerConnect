// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCR4EyAH_2u3xIvaD8WeIZ3hZoexwZqpyw",
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
