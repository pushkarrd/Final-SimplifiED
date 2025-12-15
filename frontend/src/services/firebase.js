// Firebase configuration and initialization for EchoNotes
// Initialize Firebase app with credentials from environment variables
// Export auth, firestore, and storage instances for use across app
// Configuration keys come from .env file with REACT_APP_ prefix
// Services needed: Authentication, Firestore Database, Cloud Storage

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration object
// Keys loaded from environment variables (see .env file)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    '⚠️ Firebase configuration incomplete! Check your .env file has VITE_FIREBASE_* variables.'
  );
}

// Initialize Firebase app with config
const app = initializeApp(firebaseConfig);

// Initialize and export authentication service
export const auth = getAuth(app);

// Initialize and export Firestore database
export const db = getFirestore(app);

// Initialize and export Cloud Storage
export const storage = getStorage(app);

// Export Google auth provider for OAuth sign-in
export const googleProvider = new GoogleAuthProvider();