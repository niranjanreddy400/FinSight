import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Check if we have valid Firebase config
const hasValidConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_API_KEY !== "demo-api-key" &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID !== "finsight-demo";

const firebaseConfig = {
  apiKey: hasValidConfig ? import.meta.env.VITE_FIREBASE_API_KEY : "AIzaSyDummy-Key-For-Demo-Mode-Only",
  authDomain: hasValidConfig ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN : "demo.firebaseapp.com",
  projectId: hasValidConfig ? import.meta.env.VITE_FIREBASE_PROJECT_ID : "demo-project",
  storageBucket: hasValidConfig ? import.meta.env.VITE_FIREBASE_STORAGE_BUCKET : "demo.appspot.com",
  messagingSenderId: hasValidConfig ? import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID : "123456789",
  appId: hasValidConfig ? import.meta.env.VITE_FIREBASE_APP_ID : "1:123456789:web:demo",
  databaseURL: hasValidConfig ? import.meta.env.VITE_FIREBASE_DATABASE_URL : "https://demo-default-rtdb.firebaseio.com/"
};

let app: any = null;
let auth: any = null;
let database: any = null;

// Only initialize Firebase if we have valid config
if (hasValidConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    database = getDatabase(app);
  } catch (error) {
    console.warn('Firebase initialization failed, running in demo mode:', error);
  }
}

export { auth, database };
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});