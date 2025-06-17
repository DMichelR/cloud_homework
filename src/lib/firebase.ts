import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  linkWithPopup,
  fetchSignInMethodsForEmail,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBttH65heRNz3pA0GSX--2386kRg_6Uts",
  authDomain: "tg-guestflow.firebaseapp.com",
  projectId: "tg-guestflow",
  storageBucket: "tg-guestflow.firebasestorage.app",
  messagingSenderId: "340774632263",
  appId: "1:340774632263:web:dab829b05ea4aa7398ea62",
  measurementId: "G-TKRC9LEYYQ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export {
  auth,
  googleProvider,
  facebookProvider,
  linkWithPopup,
  fetchSignInMethodsForEmail,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
};
