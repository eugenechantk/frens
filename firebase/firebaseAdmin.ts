import { initializeApp } from "firebase-admin";
import { App, cert, getApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

// get this JSON from the Firebase board
// you can also store the values in environment variables
const serviceAccount = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_ADMIN_SECRET as string
);

function createFirebaseAdminApp ():App {
  if (getApps().length === 0) {
    console.log('Initializing Firebase admin')
    return initializeApp({
      credential: cert({
        privateKey: serviceAccount.private_key,
        clientEmail: serviceAccount.client_email,
        projectId: serviceAccount.project_id,
      }),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    });
  } else {
    return getApp();
  }
}
const firebaseAdmin = createFirebaseAdminApp();

const adminFirestore = getFirestore(firebaseAdmin);
const adminStorage = getStorage(firebaseAdmin).bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
const adminAuth = getAuth(firebaseAdmin)
export { firebaseAdmin, adminFirestore, adminAuth, adminStorage };
