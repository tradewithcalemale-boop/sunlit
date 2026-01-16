
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCp8OEs5J4H0AmooL0D3ar7LakNR9g9qLE",
  authDomain: "jhammer-mirror-78239437-accab.firebaseapp.com",
  projectId: "jhammer-mirror-78239437-accab",
  storageBucket: "jhammer-mirror-78239437-accab.appspot.com",
  messagingSenderId: "468134002581",
  appId: "1:468134002581:web:4e9e1faa7270b2c55b809c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
