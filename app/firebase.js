import {
  initializeApp,
  applicationDefault,
  getApps,
  getApp,
} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
let app;
let auth;
if (process.env.NODE_ENV === 'development') {
  app =
    getApps().length === 0
      ? initializeApp({
          projectId: 'demo-investment-club-f8e07',
        })
      : getApp();
  auth = getAuth();
} else {
  app =
    getApps().length === 0
      ? initializeApp({
          credential: applicationDefault(),
        })
      : getApp();
  auth = getAuth();
}
export { app, auth };