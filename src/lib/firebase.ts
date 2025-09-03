import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

// Firebase configuration - REAL PROJECT
const firebaseConfig = {
  apiKey: "AIzaSyAR6bytdExGLztDVmHNN4xGCmCc24kp9h8",
  authDomain: "agendaqx-d1241.firebaseapp.com",
  projectId: "agendaqx-d1241",
  storageBucket: "agendaqx-d1241.firebasestorage.app",
  messagingSenderId: "753491188238",
  appId: "1:753491188238:web:ff0c4709b603e8b9ae3a5f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('🔥 Connected to Firebase Emulators');
  } catch (error) {
    console.log('⚠️ Emulators already connected or not available');
  }
}

export default { firebaseConfig };
