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
  metadataBase: new URL("https://octopusperfumes.in"),
  title: "Octopus Perfumes by Harsh Beniwal | Official Luxury Fragrance Brand",
  description:
    "Welcome to the ONLY official website for Octopus Perfumes, founded and crafted by Harsh Beniwal. Shop Harsh Beniwal's signature collection of long-lasting luxury Eau de Parfums for India. 9 premium fragrances, made in India.",
  keywords: [
    "octopusperfumes.in", "octopus perfumes", "octopus perfume", "buyoctopusperfume", "buy octopus perfume", "harsh beniwal perfume",
    "octopus harsh beniwal", "octopus perfume harsh beniwal", "harsh beniwal perfume brand", "octopus fragrance",
    "octupus perfume", "buy octopus harsh beniwal", "buyoctopus perfume", "octopus perfume by harsh beniwal",
    "octopus rhapsody", "harsh beniwal octopus", "harsh beniwal octopus perfume", "buyoctopus.com", "octopus harsh",
    "octopus by harsh beniwal", "octopus parfum", "octopus darling perfume", "buy octopus.com", "octopus.com harsh beniwal",
    "octopus outlaw", "octopus perfume bottle", "octopus overload perfume", "buyoctopus.in", "buyoctopus harsh",
    "buyoctopusperfume.in", "buyoctopusperfume", "octopus harsh beniwal brand", "octopus website harsh beniwal",
    "buy octopus by harsh beniwal", "octopus outlaw perfume", "octopus lifestyle private limited",
    "buy octopus harsh beniwal site", "harsh beniwal", "buyoctopus perfumes", "perfume octopus",
    "octopus mirage", "octopus perfume price", "outlaw perfume", "harsh perfume",
    "buy octopus harsh beniwal brand", "harsh beniwal octopus brand website", "octopus by harsh beniwal site",
    "octopus darling", "buy octopus brand", "buy octopus harsh", "harsh beniwal brand", "buyoctopus harsh beniwal"
  ],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "https://octopusperfumes.in",
  },
  openGraph: {
    title: "Octopus Perfumes by Harsh Beniwal | Official Luxury Fragrance Brand",
    description:
      "This is the ONLY official Harsh Beniwal perfume website. Shop Octopus Perfumes — 9 premium Eau de Parfums crafted in India at sensible prices.",
    images: ["/logo.png"],
    type: "website",
    siteName: "Octopus Perfumes by Harsh Beniwal",
    url: "https://octopusperfumes.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "Octopus Perfumes by Harsh Beniwal | Official Luxury Fragrance Brand",
    description:
      "This is the ONLY official Harsh Beniwal perfume website. Shop Octopus Perfumes — 9 premium Eau de Parfums.",
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
  name: "Octopus Perfumes",
  alternateName: ["Octopus Perfume by Harsh Beniwal", "Harsh Beniwal Perfume Website", "Buy Octopus", "buyoctopus", "octopusperfumes.in", "buyoctopusperfume.in"],
  url: "https://octopusperfumes.in",
  image: "https://octopusperfumes.in/logo.png",
  description:
    "Shop Octopus Perfumes by Harsh Beniwal. This is the ONLY official Harsh Beniwal perfume website. Nine long-lasting Eau de Parfums crafted for India at sensible prices.",
  publisher: {
    "@id": "https://octopusperfumes.in/#organization"
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://octopusperfumes.in/collections/all?q={search_term_string}"
    },
    "query-input": "required name=search_term_string",
  },
};


const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://octopusperfumes.in/#organization",
  name: "Octopus Perfumes by Harsh Beniwal",
  alternateName: "Octopus Lifestyle Private Limited",
  url: "https://octopusperfumes.in",
  logo: {
    "@type": "ImageObject",
    url: "https://octopusperfumes.in/logo.png",
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
    email: "support@octopusperfumes.in",
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
      name: "Is octopusperfumes.in the official Octopus Perfumes website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, octopusperfumes.in is the ONLY official website for Octopus Perfumes by Harsh Beniwal. It is operated by Octopus Lifestyle Private Limited (CIN: U47722HR2025PTC133011). Beware of counterfeit or fake websites claiming to sell Octopus Perfumes."
      }
    },
    {
      "@type": "Question",
      name: "Who founded Octopus Perfumes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Octopus Perfumes is founded by Harsh Beniwal, a popular Indian content creator. The brand is operated by Octopus Lifestyle Private Limited, based in Gurgaon, Haryana."
      }
    },
    {
      "@type": "Question",
      name: "How many perfumes does Octopus have?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Octopus Perfumes currently offers 9 signature Eau de Parfums: Darling, Mirage, Outlaw, Overlord, Paradox, Promised, Rhapsody, Somersault, and Your Move. All are 50ML bottles manufactured in Sonipat, Haryana."
      }
    },
    {
      "@type": "Question",
      name: "What is the price range of Octopus Perfumes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Octopus Perfumes range from ₹799 to ₹1899 for 50ML Eau de Parfum bottles. The brand focuses on delivering luxury-grade scents at sensible prices by eliminating traditional branding and distributor markups."
      }
    },
    {
      "@type": "Question",
      name: "Does Octopus Perfumes offer Cash on Delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Octopus Perfumes offers Cash on Delivery (COD) as a payment option across India, along with UPI, credit/debit cards, and net banking via Cashfree payments."
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
        <link rel="canonical" href="https://octopusperfumes.in" />
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
