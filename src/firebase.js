import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAtYh70LpmqAGxFjv2ZhmL6VA2cXk5MQLI",
  authDomain: "gig-flow-49508.firebaseapp.com",
  projectId: "gig-flow-49508",
  storageBucket: "gig-flow-49508.firebasestorage.app",
  messagingSenderId: "229566501422",
  appId: "1:229566501422:web:b3c156e5440b274d7b85bf",
  measurementId: "G-657054G7SX"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account", // 👈 THIS LINE IS THE FIX
});
