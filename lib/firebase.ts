import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported, logEvent, setUserProperties } from "firebase/analytics";

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
  // 1. Google Analytics (Firebase)
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};

export const setAppUserProperties = (properties: any) => {
  if (analytics) {
    setUserProperties(analytics, properties);
  }

  // 2. Meta Pixel Tracking
  if (typeof window !== "undefined" && (window as any).fbq) {
    const fbq = (window as any).fbq;
    switch (eventName) {
      case 'page_view':
        fbq('track', 'PageView');
        break;
      case 'view_item':
        fbq('track', 'ViewContent', {
          content_ids: eventParams?.items?.map((i:any) => i.item_id) || [],
          content_type: 'product',
          value: eventParams?.value,
          currency: eventParams?.currency || 'INR'
        });
        break;
      case 'add_to_cart':
        fbq('track', 'AddToCart', {
          content_ids: eventParams?.items?.map((i:any) => i.item_id) || [],
          content_type: 'product',
          value: eventParams?.value,
          currency: eventParams?.currency || 'INR'
        });
        break;
      case 'begin_checkout':
        fbq('track', 'InitiateCheckout', {
          value: eventParams?.value,
          currency: eventParams?.currency || 'INR',
          num_items: eventParams?.items?.length || 1
        });
        break;
      case 'add_payment_info':
        fbq('track', 'AddPaymentInfo', {
          value: eventParams?.value,
          currency: eventParams?.currency || 'INR'
        });
        break;
      case 'purchase':
        fbq('track', 'Purchase', {
          value: eventParams?.value,
          currency: eventParams?.currency || 'INR',
          content_ids: eventParams?.items?.map((i:any) => i.item_id) || []
        });
        break;
      case 'payment_abort':
      case 'checkout_drop':
      case 'payment_error':
        // Custom events for Meta Pixel
        fbq('trackCustom', eventName, eventParams);
        break;
      default:
        fbq('trackCustom', eventName, eventParams);
    }
  }
};
