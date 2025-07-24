// Firebase configuration (Firestore only - no Storage)
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyArsg9rsm1pEqq0UIirczVM5frLSCXjHrY",
  authDomain: "succinctpledge.firebaseapp.com",
  projectId: "succinctpledge",
  storageBucket: "succinctpledge.firebasestorage.app",
  messagingSenderId: "437332599866",
  appId: "1:437332599866:web:5e216bb28a2340e7d44103",
  measurementId: "G-7MPSWTPG2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (only Firestore and Analytics)
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

export default app;