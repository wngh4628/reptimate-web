// Import the functions you need from the SDKs you need
// import { initializeApp, firebase } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import 'firebase/messaging';

importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging-compat.js');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
  apiKey: "AIzaSyCqNXSJVrAFHqn-Or8YgBswuoYMOxEBABY",
  authDomain: "iot-teamnova.firebaseapp.com",
  projectId: "iot-teamnova",
  storageBucket: "iot-teamnova.appspot.com",
  messagingSenderId: "290736847856",
  appId: "1:290736847856:web:957b2c6d52cbbae62f3b35",
  measurementId: "G-65KLKPVBBH"
};

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase
firebase.initializeApp(config);
 
const messaging = firebase.messaging();
