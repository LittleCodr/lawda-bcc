import type { Metadata } from "next";
import "./globals.css";
// import { AuthProvider } from "@/lib/auth-context"; // Keep disabled if not needed
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.octopusperfume.in"),
  title: "Personalized Gifts for Her & Him in India | Octopus",
  description: "Shop personalized gifts, custom jewelry, name necklaces, and couple gifts. Perfect for birthdays, anniversaries, and weddings. Free shipping across India.",
  icons: {
    icon: "/favicon.ico",
  },
};

import CartDrawer from "@/components/CartDrawer";
import AnalyticsTracker from "@/components/AnalyticsTracker";

import { AuthProvider } from "@/lib/auth-context";
import { Suspense } from "react";

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
        <AuthProvider>
          <Suspense fallback={null}>
            <AnalyticsTracker />
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
        </AuthProvider>
      </body>
    </html>
  );
}
