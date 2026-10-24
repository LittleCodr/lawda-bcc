import type { Metadata } from "next";
import "./globals.css";
// import { AuthProvider } from "@/lib/auth-context"; // Keep disabled if not needed
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.octopusperfume.in"),
  title: "OCTOPUS Perfumes by Harsh Beniwal | Luxury 50ML EDP Fragrances India",
  description: "Experience official OCTOPUS Perfumes by Harsh Beniwal. 100% original 50ML Eau De Parfum crafted with 25%+ French fragrance oil concentration, beast-mode projection, and 12+ hour longevity. Free express shipping across India.",
  keywords: [
    "Harsh Beniwal perfume",
    "Octopus perfume",
    "Octopus perfume by Harsh Beniwal",
    "Buy Octopus perfume",
    "Octopus perfume official website",
    "Octopus perfumes price",
    "Octopus perfume review",
    "Harsh Beniwal perfume price",
    "Octopus perfume India",
    "BuyOctopus",
    "harsh beniwal octopus perfume",
    "harsh beniwal fragrance",
    "harsh beniwal cologne",
    "overlord perfume harsh beniwal",
    "promised perfume octopus",
    "somersault perfume harsh beniwal",
    "mirage perfume octopus",
    "rhapsody perfume harsh beniwal",
    "outlaw perfume octopus",
    "your move perfume harsh beniwal",
    "paradox perfume octopus",
    "darling perfume harsh beniwal",
    "best edp perfumes for men in india",
    "luxury perfumes india",
    "long lasting perfumes 12 hours",
    "french edp perfumes online"
  ],
  authors: [{ name: "Harsh Beniwal - OCTOPUS Perfumes" }],
  creator: "OCTOPUS Perfumes by Harsh Beniwal",
  publisher: "OCTOPUS Perfumes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "OCTOPUS Perfumes by Harsh Beniwal | Luxury 50ML EDP Fragrances India",
    description: "Shop 100% original OCTOPUS Perfumes by Harsh Beniwal. 9 signature 50ML Eau De Parfums with 25%+ French oils & 12+ hour sillage. Free express delivery in India.",
    url: "https://www.octopusperfume.in",
    siteName: "OCTOPUS Perfumes by Harsh Beniwal",
    images: [
      {
        url: "/harsh-beniwal/octopus/perfumes/images/overlord_box.png",
        width: 1200,
        height: 630,
        alt: "OCTOPUS Perfumes by Harsh Beniwal - Luxury EDP Fragrances",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OCTOPUS Perfumes by Harsh Beniwal | Luxury 50ML EDP Fragrances India",
    description: "Shop 100% original OCTOPUS Perfumes by Harsh Beniwal with 25%+ French oils & 12+ hour longevity. Free express delivery in India.",
    images: ["/harsh-beniwal/octopus/perfumes/images/overlord_box.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "maTiFe5ozIb-1qh8nZ1u6Ac4DuTJAOdJsc82OhScfpE",
  },
};

import CartDrawer from "@/components/CartDrawer";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import MetaPixel from "@/components/MetaPixel";
import NextTopLoader from "nextjs-toploader";

import { AuthProvider } from "@/lib/auth-context";
import { Suspense } from "react";
import DiwaliPopup from "@/components/DiwaliPopup";
import SalesToasts from "@/components/SalesToasts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`font-sans h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&family=Pacifico&family=Dancing+Script:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet" />
        <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" strategy="afterInteractive" />
        <Script id="onesignal-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "112b9c69-6c71-44be-8b41-6b47147772ae",
                safari_web_id: "web.onesignal.auto.11512f5d-61af-48e1-99c6-cc09fe5cc2c2",
                notifyButton: {
                  enable: true,
                },
              });

              // Automatically prompt user after 3 seconds if they haven't opted in
              setTimeout(() => {
                if (!OneSignal.User.PushSubscription.optedIn) {
                  OneSignal.Slidedown.promptPush();
                }
              }, 3000);

              // Listen for subscription changes
              OneSignal.User.PushSubscription.addEventListener("change", async (event) => {
                if (event.current.optedIn) {
                  const subscriptionId = OneSignal.User.PushSubscription.id;
                  if (subscriptionId) {
                    try {
                      await fetch('/api/onesignal/welcome', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ subscriptionId })
                      });
                    } catch (e) {
                      console.error("Failed to send welcome push", e);
                    }
                  }
                }
              });
            });
          `
        }} />
      </head>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 font-sans">
        <NextTopLoader color="#800020" showSpinner={false} />
        <AuthProvider>
          <Suspense fallback={null}>
            <AnalyticsTracker />
            <MetaPixel />
          </Suspense>
          
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    "@id": "https://www.octopusperfume.in/#organization",
                    "name": "OCTOPUS Perfumes by Harsh Beniwal",
                    "alternateName": [
                      "Octopus Perfumes", 
                      "Harsh Beniwal Perfumes", 
                      "OCTOPUS EDP",
                      "BuyOctopus",
                      "Buy Octopus Perfume",
                      "Octopus Perfume Official Website",
                      "Octopus Perfume India"
                    ],
                    "url": "https://www.octopusperfume.in",
                    "logo": "https://www.octopusperfume.in/logo.png",
                    "founder": {
                      "@type": "Person",
                      "name": "Harsh Beniwal"
                    },
                    "description": "Official OCTOPUS Perfumes luxury fragrance line created by Harsh Beniwal. Long-lasting 50ML Eau De Parfum crafted with 25%+ French fragrance oils."
                  },
                  {
                    "@type": "WebSite",
                    "@id": "https://www.octopusperfume.in/#website",
                    "url": "https://www.octopusperfume.in",
                    "name": "OCTOPUS Perfumes",
                    "publisher": {
                      "@id": "https://www.octopusperfume.in/#organization"
                    }
                  }
                ]
              })
            }}
          />

          {/* Navbar */}
          <Navbar />
          
          <main className="flex-1">{children}</main>
          
          {/* Footer */}
          <Footer />
          <CartDrawer />
          <DiwaliPopup />
          <SalesToasts />
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
            }} 
          />
        </AuthProvider>
      </body>
    </html>
  );
}
