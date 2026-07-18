import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Octopus Perfume by Harsh Beniwal | octopusperfume.in",
  description: "Learn about Octopus, the official consumer fragrance brand founded by Harsh Beniwal. Shop authentic perfumes only at octopusperfume.in. Made in India, for India.",
  keywords: ["octopusperfume.in", "octopus perfume", "octopus perfume harsh beniwal", "octopus perfume official website", "harsh beniwal brand", "buyoctopusperfume"],
  alternates: {
    canonical: "https://octopusperfume.in/pages/about-us",
  },
};

export default function AboutUsPage() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Us - Octopus Perfume",
    url: "https://octopusperfume.in/pages/about-us",
    description: "Learn about Octopus, the official consumer fragrance brand founded by Harsh Beniwal."
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://octopusperfume.in/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "About Us",
        "item": "https://octopusperfume.in/pages/about-us"
      }
    ]
  };

  return (
    <div className="bg-stone-50 min-h-screen selection:bg-stone-900 selection:text-stone-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Hero Section */}
      <section className="pt-16 pb-16 px-6 md:px-10 md:pt-24 md:pb-24 max-w-[1440px] mx-auto text-center border-b border-stone-200">
        <h1 className="font-serif-display text-5xl md:text-7xl tracking-wide uppercase text-stone-900 mb-6">
          About Us
        </h1>
        <p className="text-lg md:text-2xl text-stone-700 max-w-3xl mx-auto leading-relaxed">
          Welcome to the ONLY official website of Octopus Perfume (<span className="font-semibold text-stone-900">octopusperfume.in</span>). 
          Octopus is a fine fragrance brand founded by Harsh Beniwal, focused on building high-quality perfumes at prices that make sense for India.
        </p>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 md:py-32 px-6 md:px-10 bg-stone-900 text-stone-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-4 font-semibold">Harsh Beniwal's Vision</p>
            <h2 className="font-serif-display text-3xl md:text-5xl leading-tight text-white/90">
              "I noticed that luxury perfumes were either priced impossibly high due to branding markups, or they were cheap knock-offs that didn't last. India deserves better."
            </h2>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 md:py-32 px-6 md:px-10 max-w-[1440px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-stone-500 mb-6 font-semibold">The Octopus Standard</p>
            <h3 className="font-serif-display text-3xl md:text-4xl leading-snug mb-6 text-stone-900">
              Straightforward and product-first.
            </h3>
            <p className="text-stone-600 leading-relaxed text-lg">
              Harsh and the team focused on the product first — sourcing premium raw materials globally and crafting 50ML Eau de Parfum concentrations — while keeping development and production aligned with consistent quality standards in Sonipat, Haryana. Zero traditional branding markups.
            </p>
          </div>
          <div className="p-12 md:p-20 bg-stone-100 border border-stone-200 flex flex-col items-center justify-center text-center rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-300 via-transparent to-transparent group-hover:scale-110 transition-transform duration-1000 ease-out"></div>
            
            <p className="font-serif-display text-2xl md:text-3xl leading-relaxed text-stone-900 relative z-10 italic">
              "At Octopus, we aim to build products we would use ourselves, without unnecessary compromises or inflated pricing."
            </p>
            <p className="font-bold uppercase tracking-widest text-[10px] mt-6 text-stone-500 relative z-10">— Harsh Beniwal</p>
          </div>
        </div>
      </section>

      {/* Legal & Company Info */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-white border-t border-stone-200">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h4 className="text-[13px] tracking-[0.2em] uppercase font-bold text-stone-900 mb-8 border-b border-stone-200 pb-4 inline-block">
              Legal Information
            </h4>
          </div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-16 text-sm text-stone-600 leading-relaxed">
            <div className="space-y-6">
              <div>
                <p className="font-bold text-stone-900 mb-1 uppercase text-xs tracking-wider">Caution</p>
                <p>Flammable until dry. Keep away from flames and heat. Avoid spraying your eyes. Do not use it on irritated skin. Keep out of reach of children. For external use only.</p>
              </div>
              <div>
                <p className="font-bold text-stone-900 mb-1 uppercase text-xs tracking-wider">Usage</p>
                <p>Spray the perfume towards your pulse points from 1 feet away. For best result, spray it on your wrist, neckline, back of neck or under elbows.</p>
              </div>
              <div>
                <p className="font-bold text-stone-900 mb-1 uppercase text-xs tracking-wider">Storage</p>
                <p>Store it in a cool and dry place. Keep away from direct sunlight and high temperatures.</p>
              </div>
              <p className="italic text-stone-800 font-medium">Best before 3 years of manufacturing date, specified on the pack.</p>
            </div>

            <div className="space-y-8">
              <div>
                <p className="font-bold text-stone-900 mb-2 uppercase text-xs tracking-wider">Marketed By</p>
                <address className="not-italic text-sm">
                  Octopus Lifestyle Pvt Ltd.<br/>
                  1401, 14th Floor, Palm Spring Plaza,<br/>
                  Sector 54, Gurgaon, Haryana, India - 122011<br/><br/>
                  <span className="font-mono text-xs text-stone-400 block">CIN - U47722HR2025PTC133011</span>
                  <span className="font-mono text-xs text-stone-400 block">GSTIN - 06AAECO7617A1ZR</span>
                </address>
              </div>
              
              <div>
                <p className="font-bold text-stone-900 mb-2 uppercase text-xs tracking-wider">Manufactured By</p>
                <address className="not-italic text-sm">
                  Vanesa Cosmetics Pvt Ltd.<br/>
                  Barota Industrial Area,<br/>
                  District Sonipat, Haryana, India - 131104.<br/><br/>
                  <span className="font-mono text-xs text-stone-400 block">MFG. LIC. NO.: 251-COS (H)</span>
                  <span className="font-mono text-xs text-stone-400 block">ST. EXC. LIC. NO.: L-42A.</span>
                </address>
              </div>

              <div className="pt-6 border-t border-stone-200">
                <p className="text-xs">
                  <span className="font-bold text-stone-900">Eshopbox</span> (Eshopbox Ecommerce Private Limited) is an authorised seller of our merchandise or products.
                </p>
                <p className="mt-4 text-xs font-serif-display uppercase tracking-widest text-stone-900">
                  Opus Lifestyle Private Limited
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
