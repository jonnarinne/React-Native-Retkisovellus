import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase-konfiguraatio
const firebaseConfig = {
  apiKey: "AIzaSyC__rhjZjQsDpJK73t990MyQjcoAVdXrwE",
  authDomain: "retkisovellus.firebaseapp.com",
  databaseURL: "https://retkisovellus-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "retkisovellus",
  storageBucket: "retkisovellus.firebasestorage.app",
  messagingSenderId: "982248131505",
  appId: "1:982248131505:web:4cafd039940151c7400b90",
  measurementId: "G-P98EMFFF7X"
};

// Alustetaan Firebase-sovellus
const app = initializeApp(firebaseConfig);

// Firebase Authentication
const auth = getAuth(app);

export { auth };