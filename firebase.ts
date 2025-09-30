// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config - using the correct API key from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyDXpv_e43HadRRrioMS-lzdsIE4CIZmzYI",
  authDomain: "mademesmile-2dec8.firebaseapp.com",
  projectId: "mademesmile-2dec8",
  storageBucket: "mademesmile-2dec8.firebasestorage.app",
  messagingSenderId: "1061797336711",
  appId: "1:1061797336711:android:553a802d2c0de9c8c84a22",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
