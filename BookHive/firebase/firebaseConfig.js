// firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAUpYHAs7rgbub3lwViPeaX70sf-RkX1U",
  authDomain: "bookhive-d100c.firebaseapp.com",
  projectId: "bookhive-d100c",
  storageBucket: "bookhive-d100c.appspot.com", // 👈 fixed this typo!
  messagingSenderId: "639143460746",
  appId: "1:639143460746:web:8c757c758b40225ffe1273",
  measurementId: "G-TC4GYV1DKC",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;
