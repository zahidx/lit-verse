// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAG09bfqKssPbVxbUnWq7GvfLc-SIQMhyg",
  authDomain: "litverse-db543.firebaseapp.com",
  projectId: "litverse-db543",
  storageBucket: "litverse-db543.firebasestorage.app",
  messagingSenderId: "616798041959",
  appId: "1:616798041959:web:32ee5a83246c95b48e61c2",
  measurementId: "G-1JWQFR453S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider(); // ✅ Add this line

// Export the Firebase services
export { auth, googleProvider, db };
