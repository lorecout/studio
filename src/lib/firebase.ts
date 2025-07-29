"use client"
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "realgoal",
  "appId": "1:10684111974:web:b88ea9dbf41209980861a7",
  "storageBucket": "realgoal.firebasestorage.app",
  "apiKey": "AIzaSyAXaJKtFL5l3jNoiL2_nNlgqYj0k-HTF7c",
  "authDomain": "realgoal.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "10684111974"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
