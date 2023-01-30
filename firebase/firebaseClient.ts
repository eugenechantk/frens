// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { FirebaseOptions, getApp, initializeApp } from 'firebase/app'
import { getPerformance } from "firebase/performance";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/analytics'
import 'firebase/performance'
import { browserSessionPersistence, getAuth, connectAuthEmulator, Auth } from "firebase/auth";

const id = process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? `demo-${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

function createFirebaseApp (config: FirebaseOptions) {
  try {
    return getApp();
  } catch {
    // console.log('Initializing firebase client app');
    return initializeApp(config)
  }
}
const firebaseClient = createFirebaseApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const firebaseClientAuth = getAuth(firebaseClient);
// Only setup emulator in development mode
// if (process.env.NEXT_PUBLIC_NODE_ENV === 'development' && !firebaseClientAuth.emulatorConfig) {
//   connectAuthEmulator(firebaseClientAuth, "http://127.0.0.1:9099");
// }
firebaseClientAuth.setPersistence(browserSessionPersistence);
export const clientStorage = getStorage(firebaseClient);
export const clientFireStore = getFirestore(firebaseClient);
// if (process.env.NEXT_PUBLIC_NODE_ENV === 'development' && !firebaseClientAuth.emulatorConfig) {
//   connectFirestoreEmulator(clientFireStore, '127.0.0.1', 8080);
// }
