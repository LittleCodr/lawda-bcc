import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCDrhkAdOlVtMc4j2AsJgOR-7dZ-qyy9b8",
  authDomain: "octopusperfumes.firebaseapp.com",
  projectId: "octopusperfumes",
  storageBucket: "octopusperfumes.firebasestorage.app",
  messagingSenderId: "647675431879",
  appId: "1:647675431879:web:04a5b348743743a09da7e2",
  measurementId: "G-N188YZ4HTB",
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
