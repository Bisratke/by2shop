import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3QbU7w-OwhNeeq3hvcDGuw9anohfPe50",
  authDomain: "bshop-a6a14.firebaseapp.com",
  projectId: "bshop-a6a14",
  storageBucket: "bshop-a6a14.firebasestorage.app",
  messagingSenderId: "110118235733",
  appId: "1:110118235733:web:5093a168ad3f6afa3beedc",
  measurementId: "G-092YL0VJ2E"
};

// Initialize Firebase (Checks if already initialized to prevent errors)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export 'db' so we can pull your 8 products into the page
export const db = getFirestore(app);