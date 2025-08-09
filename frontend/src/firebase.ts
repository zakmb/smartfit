import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyA_6Lk9VHAYfwfdRKcY9l0QSGZ3vZcQNo8",
  authDomain: "smartfit-ai-9ff5f.firebaseapp.com",
  projectId: "smartfit-ai-9ff5f",
  storageBucket: "smartfit-ai-9ff5f.firebasestorage.app",
  messagingSenderId: "651766269976",
  appId: "1:651766269976:web:600d3759e30e82d08fdb6d",
  measurementId: "G-DD90B9ZV5E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

export default app; 