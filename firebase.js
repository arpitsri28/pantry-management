// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDW7rLSVMSkVHbnJt9a3xPskaz05bHS7ts",
  authDomain: "pantry-management-b0f32.firebaseapp.com",
  projectId: "pantry-management-b0f32",
  storageBucket: "pantry-management-b0f32.appspot.com",
  messagingSenderId: "954605942748",
  appId: "1:954605942748:web:2260bb56c080ac53bd4119",
  measurementId: "G-Z1P5TB0BKD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export {firestore};