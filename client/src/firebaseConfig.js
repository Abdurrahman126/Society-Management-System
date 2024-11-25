
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWEkLP8KCcEIh9eOEfp-C-5TtMiXBFLLM",
  authDomain: "decs-f8208.firebaseapp.com",
  projectId: "decs-f8208",
  storageBucket: "decs-f8208.firebasestorage.app",
  messagingSenderId: "974483822214",
  appId: "1:974483822214:web:2e2ca783f5930e3e902307"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
