
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA0jXiRAXRbabLjbCP_9R8c3hmgaEIQtcc",
    authDomain: "mulerepo-3c499.firebaseapp.com",
    projectId: "mulerepo-3c499",
    storageBucket: "mulerepo-3c499.firebasestorage.app",
    messagingSenderId: "362015913191",
    appId: "1:362015913191:web:19abc45e44ffa355d25e42",
    measurementId: "G-1J4ZYF24TE"
};

// Initialize Firebase
import { getFirestore } from "firebase/firestore";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

let analytics;

if (typeof window !== 'undefined') {
    isSupported().then((isSupported) => {
        if (isSupported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, auth, db, googleProvider, analytics };
