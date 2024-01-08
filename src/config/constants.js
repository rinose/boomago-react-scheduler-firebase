import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Required for side-effects
//require('firebase/firestore');

const config = {
  apiKey: "AIzaSyBvSEse4cYERyxaZBvjLIeC3KcSrqJf3SY",
  authDomain: "boomago-10c30.firebaseapp.com",
  databaseURL: "https://boomago-10c30.firebaseio.com",
  projectId: "boomago-10c30",
  storageBucket: "boomago-10c30.appspot.com",
  messagingSenderId: "765251863218",
  appId: "1:765251863218:web:d56a1c07c340a2e1"
};

if (!firebase.apps.length) {
  console.log("firebase.initializeApp")
  firebase.initializeApp(config);
}

export const storageKey = 'KEY_FOR_LOCAL_STORAGE';
export const db = firebase.firestore();
export const firebaseAuth = firebase.auth;



export const minTime = new Date();
minTime.setHours(7, 0, 0);
export const maxTime = new Date();
maxTime.setHours(20, 0, 0);