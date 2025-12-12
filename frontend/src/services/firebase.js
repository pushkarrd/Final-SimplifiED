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
// Keys: apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId
const firebaseConfig = {
  apiKey: "AIzaSyAq0Nm9ce87fMJCbcGecKRl46ZxttVm9MU",
  authDomain: "simplified-code-lunatics.firebaseapp.com",
  projectId: "simplified-code-lunatics",
  storageBucket: "simplified-code-lunatics.firebasestorage.app",
  messagingSenderId: "349702057262",
  appId: "1:349702057262:web:c331afe0e6e6c2c1cc5ebf"
};

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