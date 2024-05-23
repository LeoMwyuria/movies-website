// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJA4gD_ya5HSjto-UWgUtQzd6E8DB1324",
  authDomain: "movies-website-17cbe.firebaseapp.com",
  projectId: "movies-website-17cbe",
  storageBucket: "movies-website-17cbe.appspot.com",
  messagingSenderId: "916245832229",
  appId: "1:916245832229:web:acf31dbfecfa622fa855cc",
  measurementId: "G-RNNJE0MTQ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
