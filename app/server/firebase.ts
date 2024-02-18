import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCP2359dHx8pUxECPvZ3QbalOUWmmx4-BM",
  authDomain: "primeshop-c3108.firebaseapp.com",
  projectId: "primeshop-c3108",
  storageBucket: "primeshop-c3108.appspot.com",
  messagingSenderId: "261920177206",
  appId: "1:261920177206:web:aaf1e224e00a83751e6c97",
  measurementId: "G-77H07B7Q1C",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

export { app, db };
