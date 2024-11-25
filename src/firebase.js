// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrJUFOLRb6UHJ7MGnERQWlBfZNGYFpb4Q",
  authDomain: "pomodoroapp-5f569.firebaseapp.com",
  projectId: "pomodoroapp-5f569",
  storageBucket: "pomodoroapp-5f569.firebasestorage.app",
  messagingSenderId: "784392723623",
  appId: "1:784392723623:web:e6b4bb1fc01c3c1f7c4f82",
  measurementId: "G-5263XCKJ7C"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage();
export const auth = getAuth(app);