
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqJa5DXzB6q1ERDrGxpSt8-h-3mBR82Cc",
  authDomain: "kotozvon-cb542.firebaseapp.com",
  projectId: "kotozvon-cb542",
  storageBucket: "kotozvon-cb542.firebasestorage.app",
  messagingSenderId: "488001272632",
  appId: "1:488001272632:web:cd06aea61251883dfddfcd",
  measurementId: "G-7KX3HF8C90"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
