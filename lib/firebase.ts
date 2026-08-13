import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCDrhkAdOlVtMc4j2AsJgOR-7dZ-qyy9b8",
  authDomain: "octopusperfumes.firebaseapp.com",
  projectId: "octopusperfumes",
  storageBucket: "octopusperfumes.firebasestorage.app",
  messagingSenderId: "647675431879",
  appId: "1:647675431879:web:47c8069ab4aef10e9da7e2",
  measurementId: "G-ZP3CXGVJGX"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics only on the client side
export let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export const logAppEvent = (eventName: string, eventParams?: any) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};
