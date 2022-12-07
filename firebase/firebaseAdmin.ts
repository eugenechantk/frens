import * as firebaseAdmin from "firebase-admin";

// get this JSON from the Firebase board
// you can also store the values in environment variables
const serviceAccount = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_ADMIN_SECRET as string
);

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: serviceAccount.private_key,
      clientEmail: serviceAccount.client_email,
      projectId: serviceAccount.project_id,
    }),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  });
}

const adminFirestore = firebaseAdmin.firestore();
const adminStorage = firebaseAdmin.storage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
const adminAuth = firebaseAdmin.auth();
export { firebaseAdmin, adminFirestore, adminAuth, adminStorage };
