import * as admin from "firebase-admin";
import { App, cert, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

// get this JSON from the Firebase board
// you can also store the values in environment variables
const serviceAccount = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_ADMIN_SECRET as string
);

function createFirebaseAdminApp ():App {
  try {
    return getApp()
  } catch {
    console.log('Initializing Firebase admin')
    return admin.initializeApp({
      credential: cert({
        privateKey: serviceAccount.private_key,
        clientEmail: serviceAccount.client_email,
        projectId: serviceAccount.project_id,
      }),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    });
  }
}
const firebaseAdmin = createFirebaseAdminApp();

const adminFirestore = getFirestore(firebaseAdmin);
const adminStorage = getStorage(firebaseAdmin).bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
const adminAuth = getAuth(firebaseAdmin)
export { firebaseAdmin, adminFirestore, adminAuth, adminStorage };
