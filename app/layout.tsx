import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import CartDrawer from "@/components/CartDrawer";
import LiveSalesPopups from "@/components/LiveSalesPopups";


const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://buyoctopusperfume.in"),
  title: "Octopus Perfumes by Harsh Beniwal | The Official Fragrance Brand",
  description:
    "Welcome to the ONLY official website for Octopus Perfumes, founded and crafted by Harsh Beniwal. Shop Harsh Beniwal's signature collection of long-lasting luxury Eau de Parfums for India.",
  keywords: [
    "buyoctopusperfume.in", "buyoctopusperfume", "octopus perfume", "buyoctopus", "buy octopus perfume", "harsh beniwal perfume", "octopus perfumes",
    "octopus harsh beniwal", "octopus perfume harsh beniwal", "harsh beniwal perfume brand", "octopus fragrance",
    "octupus perfume", "buy octopus harsh beniwal", "buyoctopus perfume", "octopus perfume by harsh beniwal",
    "octopus rhapsody", "harsh beniwal octopus", "harsh beniwal octopus perfume", "buyoctopus.com", "octopus harsh",
    "octopus by harsh beniwal", "octopus parfum", "octopus darling perfume", "buy octopus.com", "octopus.com harsh beniwal",
    "octopus outlaw", "octopus perfume bottle", "octopus overload perfume", "buyoctopus.in", "buyoctopus harsh",
    "buyoctopus.con", "buyoctupus harsh beniwal", "octopus harsh beniwal brand", "octopus website harsh beniwal",
    "buy octopus by harsh beniwal", "buyoctopus.", "octopus outlaw perfume", "octopus lifestyle private limited",
    "www.buyoctopus", "buy octopus harsh beniwal site", "harsh beniwal", "buyoctopus perfumes", "perfume octopus",
    "octopus mirage", "octopus perfume price", "outlaw perfume", "harsh perfume", "buyoctopus .com",
    "buy octopus harsh beniwal brand", "harsh beniwal octopus brand website", "octopus by harsh beniwal site",
    "octopus darling", "buy octopus brand", "buy octopus harsh", "harsh beniwal brand", "buyoctopus harsh beniwal"
  ],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Octopus Perfumes by Harsh Beniwal | The Official Fragrance Brand",
    description:
      "This is the ONLY official Harsh Beniwal perfume website. Shop Octopus Perfumes by Harsh Beniwal here.",
    images: ["/logo.png"],
    type: "website",
    siteName: "Octopus Perfumes by Harsh Beniwal",
    url: "https://buyoctopusperfume.in",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Octopus Perfumes",
  alternateName: ["Octopus Perfume by Harsh Beniwal", "Harsh Beniwal Perfume Website", "Buy Octopus", "buyoctopus", "buyoctopusperfume.in"],
  url: "https://buyoctopusperfume.in",
  description:
    "Shop Octopus Perfumes by Harsh Beniwal. This is the ONLY official Harsh Beniwal perfume website. Nine long-lasting Eau de Parfums crafted for India at sensible prices.",
  publisher: {
    "@id": "https://buyoctopusperfume.in/#organization"
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://buyoctopusperfume.in/collections/all?q={search_term_string}"
    },
    "query-input": "required name=search_term_string",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://buyoctopusperfume.in/#organization",
  name: "Octopus Perfumes by Harsh Beniwal",
  alternateName: "Octopus Lifestyle Private Limited",
  url: "https://buyoctopusperfume.in",
  logo: {
    "@type": "ImageObject",
    url: "https://buyoctopusperfume.in/logo.png",
    width: "512",
    height: "512"
  },
  sameAs: [
    "https://instagram.com/buyoctopus", 
    "https://instagram.com/harshbeniwal", 
    "https://youtube.com/harshbeniwal",
    "https://www.facebook.com/harshbeniwal"
  ],
  founder: {
    "@type": "Person",
    name: "Harsh Beniwal",
    url: "https://instagram.com/harshbeniwal"
  },
  description:
    "The official luxury fragrance brand created by Harsh Beniwal. Buy 50ML Eau de Parfums for India.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@buyoctopusperfume.in",
    contactType: "customer support",
    availableLanguage: ["English", "Hindi"]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 font-sans">
        <AuthProvider>
          <CartProvider>
            <Marquee />
            


            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <LiveSalesPopups />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
