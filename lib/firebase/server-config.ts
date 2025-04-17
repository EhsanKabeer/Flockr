import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function ensureApp(): App {
  if (!getApps().length) {
    const projectId =
      process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (projectId && clientEmail && privateKey) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    }
  }
  const app = getApps()[0];
  if (!app) throw new Error("Firebase Admin not initialized. Set FIREBASE_ADMIN_* env vars.");
  return app as App;
}

export function getAdminAuth() {
  return getAuth(ensureApp());
}

export function getAdminDb() {
  return getFirestore(ensureApp());
}

