// import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
const firebaseConfig = {
  apiKey: "AIzaSyBay_mVgvLAjanNbJjkiP-jXG9WHIvtkkQ",
  authDomain: "jwt-firebase-vue3-e771d.firebaseapp.com",
  projectId: "jwt-firebase-vue3-e771d",
  storageBucket: "jwt-firebase-vue3-e771d.appspot.com",
  messagingSenderId: "814423927236",
  appId: "1:814423927236:web:f582985e524897f3b0dc91",
  databaseURL: "https://jwt-firebase-vue3-e771d-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = firebase.initializeApp(firebaseConfig)

export const auth = getAuth(app);