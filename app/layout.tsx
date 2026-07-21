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
  metadataBase: new URL("https://octopusperfume.in"),
  title: "Octopus Perfume by Harsh Beniwal | Buy Online (Official Store)",
  description:
    "Welcome to the ONLY official website for Octopus Perfume, founded and crafted by Harsh Beniwal. Shop Harsh Beniwal's signature collection of long-lasting luxury Eau de Parfums for India. 9 premium fragrances, made in India.",
  keywords: [
    "octopusperfume.in", "octopus perfume", "octopus perfume", "buyoctopusperfume", "buy octopus perfume", "harsh beniwal perfume",
    "octopus harsh beniwal", "octopus perfume harsh beniwal", "harsh beniwal perfume brand", "octopus fragrance",
    "octupus perfume", "buy octopus harsh beniwal", "buyoctopus perfume", "octopus perfume by harsh beniwal",
    "octopus rhapsody", "harsh beniwal octopus", "harsh beniwal octopus perfume", "buyoctopus.com", "octopus harsh",
    "octopus by harsh beniwal", "octopus parfum", "octopus darling perfume", "buy octopus.com", "octopus.com harsh beniwal",
    "octopus outlaw", "octopus perfume bottle", "octopus overload perfume", "buyoctopus.in", "buyoctopus harsh",
    "octopusperfume.in", "buyoctopusperfume", "octopus harsh beniwal brand", "octopus website harsh beniwal",
    "buy octopus by harsh beniwal", "octopus outlaw perfume", "octopus lifestyle private limited",
    "buy octopus harsh beniwal site", "harsh beniwal", "buyoctopus perfume", "perfume octopus",
    "octopus mirage", "octopus perfume price", "outlaw perfume", "harsh perfume",
    "buy octopus harsh beniwal brand", "harsh beniwal octopus brand website", "octopus by harsh beniwal site",
    "octopus darling", "buy octopus brand", "buy octopus harsh", "harsh beniwal brand", "buyoctopus harsh beniwal",
    "buy octopus perfume online", "original octopus perfume", "real octopus perfume website"
  ],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "https://octopusperfume.in",
  },
  openGraph: {
    title: "Octopus Perfume by Harsh Beniwal | Buy Online (Official Store)",
    description:
      "This is the ONLY official Harsh Beniwal perfume website. Shop Octopus Perfume — 9 premium Eau de Parfums crafted in India at sensible prices.",
    images: ["/logo.png"],
    type: "website",
    siteName: "Octopus Perfume by Harsh Beniwal",
    url: "https://octopusperfume.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "Octopus Perfume by Harsh Beniwal | Buy Online (Official Store)",
    description:
      "This is the ONLY official Harsh Beniwal perfume website. Shop Octopus Perfume — 9 premium Eau de Parfums.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Octopus Perfume",
  alternateName: ["Octopus Perfume by Harsh Beniwal", "Harsh Beniwal Perfume Website", "Buy Octopus", "buyoctopus", "octopusperfume.in", "octopusperfume.in"],
  url: "https://octopusperfume.in",
  image: "https://octopusperfume.in/logo.png",
  description:
    "Shop Octopus Perfume by Harsh Beniwal. This is the ONLY official Harsh Beniwal perfume website. Nine long-lasting Eau de Parfums crafted for India at sensible prices.",
  publisher: {
    "@id": "https://octopusperfume.in/#organization"
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://octopusperfume.in/collections/all?q={search_term_string}"
    },
    "query-input": "required name=search_term_string",
  },
};


const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://octopusperfume.in/#organization",
  name: "Octopus Perfume by Harsh Beniwal",
  alternateName: "Octopus Lifestyle Private Limited",
  url: "https://octopusperfume.in",
  logo: {
    "@type": "ImageObject",
    url: "https://octopusperfume.in/logo.png",
    width: "512",
    height: "512"
  },
  sameAs: [
    "https://instagram.com/buyoctopus", 
    "https://instagram.com/harshbeniwal", 
    "https://youtube.com/harshbeniwal",
    "https://www.facebook.com/harshbeniwal",
    "https://github.com/LittleCodr/Perfume"
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
    email: "support@octopusperfume.in",
    contactType: "customer support",
    availableLanguage: ["English", "Hindi"]
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is octopusperfume.in the official Octopus Perfume website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, octopusperfume.in is the ONLY official website for Octopus Perfume by Harsh Beniwal. It is operated by Octopus Lifestyle Private Limited (CIN: U47722HR2025PTC133011). Beware of counterfeit or fake websites claiming to sell Octopus Perfume."
      }
    },
    {
      "@type": "Question",
      name: "Who founded Octopus Perfume?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Octopus Perfume is founded by Harsh Beniwal, a popular Indian content creator. The brand is operated by Octopus Lifestyle Private Limited, based in Gurgaon, Haryana."
      }
    },
    {
      "@type": "Question",
      name: "How many perfumes does Octopus have?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Octopus Perfume currently offers 9 signature Eau de Parfums: Darling, Mirage, Outlaw, Overlord, Paradox, Promised, Rhapsody, Somersault, and Your Move. All are 50ML bottles manufactured in Sonipat, Haryana."
      }
    },
    {
      "@type": "Question",
      name: "What is the price range of Octopus Perfume?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Octopus Perfume range from ₹799 to ₹1899 for 50ML Eau de Parfum bottles. The brand focuses on delivering luxury-grade scents at sensible prices by eliminating traditional branding and distributor markups."
      }
    },
    {
      "@type": "Question",
      name: "Does Octopus Perfume offer Cash on Delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Octopus Perfume offers Cash on Delivery (COD) as a payment option across India, along with UPI, credit/debit cards, and net banking via Cashfree payments."
      }
    }
  ]
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <link rel="canonical" href="https://octopusperfume.in" />
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
