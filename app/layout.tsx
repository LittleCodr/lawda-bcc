import type { Metadata } from "next";
import "./globals.css";
// import { AuthProvider } from "@/lib/auth-context"; // Keep disabled if not needed
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.octopusperfume.in"),
  title: "Personalized Gifts for Her & Him in India | Octopus Gifts",
  description: "Shop personalized gifts, custom jewelry, name necklaces, and couple gifts. Perfect for birthdays, anniversaries, and weddings. Free shipping across India.",
  keywords: ["personalized gifts", "custom jewelry", "name necklace", "gifts for her", "gifts for him", "anniversary gifts", "wedding gifts india", "custom keychain", "octopus gifts"],
  authors: [{ name: "Octopus Gifts" }],
  creator: "Octopus Gifts",
  publisher: "Octopus Gifts",
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
    title: "Personalized Gifts for Her & Him in India | Octopus Gifts",
    description: "Shop personalized gifts, custom jewelry, name necklaces, and couple gifts. Perfect for birthdays, anniversaries, and weddings. Free shipping across India.",
    url: "https://www.octopusperfume.in",
    siteName: "Octopus Gifts",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Octopus Gifts - Personalized Gifts",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personalized Gifts for Her & Him in India | Octopus Gifts",
    description: "Shop personalized gifts, custom jewelry, name necklaces, and couple gifts. Free shipping across India.",
    images: ["/logo.png"],
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
import RakhiPopup from "@/components/RakhiPopup";

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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
                "@type": "Organization",
                "name": "Octopus",
                "url": "https://www.octopusperfume.in",
                "logo": "https://www.octopusperfume.in/icon.png",
                "description": "Personalized gifts for every relationship, every occasion and every budget."
              })
            }}
          />

          {/* Navbar */}
          <Navbar />
          
          <main className="flex-1">{children}</main>
          
          {/* Footer */}
          <Footer />
          <CartDrawer />
          <RakhiPopup />
        </AuthProvider>
      </body>
    </html>
  );
}
