import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// TODO: Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDPjPGm9Mf1dv167hhjGNqPpPlU2K6uDes",
  authDomain: "mobileblocket.firebaseapp.com",
  projectId: "mobileblocket",
  storageBucket: "mobileblocket.firebasestorage.app",
  messagingSenderId: "721955037488",
  appId: "1:721955037488:web:8fb07656dc2f55251fa8f5",
  measurementId: "G-RXRMJZPM4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
