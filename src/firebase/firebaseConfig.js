// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBi_gmDjbLRtN6_LJxiqo7ZyKhTD2bGl-k",
  authDomain: "restaurant-menu-562f8.firebaseapp.com",
  projectId: "restaurant-menu-562f8",
  storageBucket: "restaurant-menu-562f8.appspot.com",
  messagingSenderId: "809055448778",
  appId: "1:809055448778:web:4d4e4c78e32578f1fece33",
  measurementId: "G-WEXM561ZV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
