import * as firebaseAdmin from "firebase-admin";

// get this JSON from the Firebase board
// you can also store the values in environment variables
const serviceAccount = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_ADMIN_SECRET as string
);

const id =
  process.env.NEXT_PUBLIC_NODE_ENV === "development"
    ? `demo-${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`
    : process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;


if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    projectId: id,
    credential: firebaseAdmin.credential.cert({
      privateKey: serviceAccount.private_key,
      clientEmail: serviceAccount.client_email,
      projectId: serviceAccount.project_id,
    }),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

export { firebaseAdmin };
