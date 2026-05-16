// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVNUOqSURTh6Ds_Rm8Osu4qQmewkG1XZg",
  authDomain: "myhack-hackathon-2026.firebaseapp.com",
  projectId: "myhack-hackathon-2026",
  storageBucket: "myhack-hackathon-2026.firebasestorage.app",
  messagingSenderId: "1090064762770",
  appId: "1:1090064762770:web:ff662c1129b15fd637234b",
  measurementId: "G-CZ7X2FMFSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);