import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldCheck, Truck, RefreshCcw, Heart, Info, FileText, Lock, Box, Banknote, Calendar, CheckCircle2 } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, ' ').toUpperCase()} | Octopus Perfume` };
}

const SIDEBAR_LINKS = [
  { slug: "about-us", title: "About Us", icon: <Info size={18} /> },
  { slug: "shipping-policy", title: "Shipping Policy", icon: <Truck size={18} /> },
  { slug: "returns-refund-policy", title: "Returns & Exchanges", icon: <RefreshCcw size={18} /> },
  { slug: "privacy-policy", title: "Privacy Policy", icon: <Lock size={18} /> },
  { slug: "terms-conditions", title: "Terms & Conditions", icon: <FileText size={18} /> },
];

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const currentLink = SIDEBAR_LINKS.find(link => link.slug === slug);
  const title = currentLink ? currentLink.title : slug.replace(/-/g, ' ');

  let content = null;
  
  switch(slug) {
    case "about-us":
      content = (
        <>
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-10 shadow-sm border border-stone-200">
            <Image src="/images/products/name-necklace-rakhi-gift-11.jpg" alt="Octopus Perfume Craftsmanship" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-serif text-4xl md:text-5xl font-bold tracking-wide">Our Story</span>
            </div>
          </div>
          
          <h2>Our Genesis and Vision</h2>
          <p>Welcome to Octopus Perfume, India’s premier destination for bespoke, personalized gifting. Our journey began with a singular, resolute vision: to transform the way Indians celebrate their most cherished relationships. In a world inundated with mass-produced commodities, we realized that the true essence of gifting had been lost. We set out to restore that essence by creating a brand dedicated entirely to the art of personalization.</p>
          <p>We understand that every individual is unique, and every relationship tells a different story. That is why our products are not just items; they are tangible memories, meticulously crafted to reflect the profound bonds you share with your loved ones. Whether it is an engraved piece of artificial jewelry, a custom-printed keepsake, or an elegantly packaged fragrance, every product that leaves our facility carries with it a promise of quality, exclusivity, and heartfelt emotion.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
            <div className="bg-[#f9f2ed] p-8 rounded-xl border border-[#E5B8B7]/30">
              <ShieldCheck className="text-[#800020] mb-4" size={32} />
              <h3 className="font-serif text-xl text-stone-900 mt-0 mb-2">Our Craftsmanship</h3>
              <p className="text-sm text-stone-600 mb-0">Our commitment to excellence is unwavering. We collaborate with master artisans and employ cutting-edge engraving and printing technologies to ensure that every personalization detail is executed with flawless precision.</p>
            </div>
            <div className="bg-[#f9f2ed] p-8 rounded-xl border border-[#E5B8B7]/30">
              <Heart className="text-[#800020] mb-4" size={32} />
              <h3 className="font-serif text-xl text-stone-900 mt-0 mb-2">Customer Delight</h3>
              <p className="text-sm text-stone-600 mb-0">We do not merely sell gifts; we curate experiences. From the moment you land on our website to the instant our premium, signature packaging is unboxed, every touchpoint is optimized to deliver unparalleled delight.</p>
            </div>
          </div>

          <h2>Corporate Information & Legal Entity</h2>
          <p>Octopus Perfume operates under full compliance with all relevant corporate and commercial laws in India. For any legal inquiries, corporate collaborations, or official correspondence, please refer to our registered headquarters:</p>
          <div className="bg-stone-50 p-6 rounded-xl border-l-4 border-[#800020] my-6">
            <p className="font-bold text-stone-900 mb-2">Registered Address for Verification:</p>
            <p className="mb-0 text-sm">Octopus Perfume<br />Shri Shanta Sharnam<br />Tonk, Rajasthan, 304022<br />India</p>
          </div>
          <p>For immediate assistance, our dedicated support channels remain open during standard business hours. We invite you to join the Octopus family and experience the zenith of personalized gifting.</p>
        </>
      );
      break;
    case "terms-conditions":
      content = (
        <>
          <p className="lead text-lg font-medium text-stone-500 mb-8">Please read these Terms and Conditions carefully before using the Octopus Perfume website.</p>
          
          <div className="space-y-8">
            <div>
              <h2 className="flex items-center gap-3"><span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#800020] text-white text-sm font-bold">1</span> Comprehensive Introduction</h2>
              <p>Welcome to Octopus Perfume (accessible at octopusperfume.in). These comprehensive Terms and Conditions ("Terms", "Agreement") constitute a legally binding contract between you (the "User", "Customer", "Visitor") and Octopus Perfume ("we", "us", "our", "the Company"). By accessing, browsing, registering an account, or placing an order on our platform, you categorically acknowledge that you have read, understood, and unequivocally agreed to be bound by these Terms in their entirety. If you harbor any objections to these Terms, you are explicitly prohibited from using our services and must immediately cease all access to the platform.</p>
            </div>
            
            <div>
              <h2 className="flex items-center gap-3"><span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#800020] text-white text-sm font-bold">2</span> Intellectual Property</h2>
              <p>The entire contents of the Octopus Perfume website—including but not limited to textual content, graphical assets, logos, button icons, high-resolution imagery, audio clips, digital downloads, data compilations, and proprietary software—are the exclusive intellectual property of Octopus Perfume or its certified content suppliers. These assets are protected under the Indian Copyright Act, 1957, as well as international copyright and trademark laws.</p>
            </div>
            
            <div>
              <h2 className="flex items-center gap-3"><span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#800020] text-white text-sm font-bold">3</span> Detailed Product Descriptions</h2>
              <p>While we expend extraordinary effort to ensure the absolute accuracy of all product descriptions, high-definition imagery, and pricing information, the Company does not warrant that product descriptions or other content is completely error-free, current, or reliable. All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.</p>
            </div>
            
            <div>
              <h2 className="flex items-center gap-3"><span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#800020] text-white text-sm font-bold">4</span> Bespoke Personalization Policies</h2>
              <p>As our core offering relies on customization, you are solely responsible for ensuring the absolute accuracy of all personalization inputs (e.g., names, dates, spelling, grammar) submitted during the checkout process. Octopus Perfume will not be held liable for typographical errors submitted by the customer.</p>
            </div>
          </div>
        </>
      );
      break;
    case "returns-refund-policy":
      content = (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-[#f9f2ed] p-6 rounded-xl flex flex-col items-center text-center shadow-sm border border-[#E5B8B7]/30">
              <Calendar size={32} strokeWidth={1.5} className="text-[#800020] mb-3" />
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Return Window</span>
              <span className="font-serif text-lg text-gray-900">1 Day</span>
            </div>
            <div className="bg-[#f9f2ed] p-6 rounded-xl flex flex-col items-center text-center shadow-sm border border-[#E5B8B7]/30">
              <RefreshCcw size={32} strokeWidth={1.5} className="text-[#800020] mb-3" />
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Exchanges</span>
              <span className="font-serif text-lg text-gray-900">Accepted</span>
            </div>
            <div className="bg-[#f9f2ed] p-6 rounded-xl flex flex-col items-center text-center shadow-sm border border-[#E5B8B7]/30">
              <Box size={32} strokeWidth={1.5} className="text-[#800020] mb-3" />
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Return Label</span>
              <span className="font-serif text-lg text-gray-900">Included & Free</span>
            </div>
            <div className="bg-[#f9f2ed] p-6 rounded-xl flex flex-col items-center text-center shadow-sm border border-[#E5B8B7]/30">
              <Banknote size={32} strokeWidth={1.5} className="text-[#800020] mb-3" />
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Restocking Fee</span>
              <span className="font-serif text-lg text-gray-900">No Cost</span>
            </div>
          </div>

          <h2>1. Hassle-Free Returns & Exchanges</h2>
          <p>At Octopus Perfume, your satisfaction is our top priority. We gladly accept returns and exchanges for <strong>both defective and non-defective products</strong>. Whether you changed your mind or received a faulty item, we've made our return process as seamless as possible.</p>
          
          <h2>2. Return & Exchange Window</h2>
          <p>You have exactly <strong>1 day</strong> from the date of delivery to initiate a return or exchange. Due to the fast-moving nature of our premium inventory, we strictly enforce this 1-day window.</p>
          
          <h2>3. Product Condition Requirements</h2>
          <p>To be eligible for a return or exchange, your item must be in <strong>New</strong> condition only. This means the product must be completely unused, unworn, and housed in its original, undamaged premium packaging with all protective seals and tags intact.</p>

          <h2>4. Return Method & Free Return Label</h2>
          <p>All returns are processed securely <strong>by post</strong>. To make your experience absolutely frictionless, a pre-paid return shipping label is already <strong>included in the package</strong> you received. Shipping the item back to us is entirely <strong>free of charge</strong>.</p>
          
          <h2>5. Restocking Fees & Refund Processing</h2>
          <p>We do not believe in penalizing our customers. Therefore, we charge absolutely <strong>no restocking fees</strong>. Once we receive your returned package by post and verify its "New" condition, your refund will be fully processed within <strong>1 day</strong>. The funds will be credited back to your original payment method.</p>
          
          <h2>6. How to Initiate a Return</h2>
          <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 mt-6">
            <ol className="list-decimal list-inside space-y-3 text-stone-700 m-0 p-0">
              <li>Repack the item securely in its original packaging.</li>
              <li>Attach the included pre-paid return label to the outside of the box.</li>
              <li>Drop it off at your nearest authorized postal or courier center.</li>
            </ol>
            <p className="mt-4 text-sm text-stone-500 italic mb-0">If you lost your return label, please contact our support team immediately.</p>
          </div>
        </>
      );
      break;
    case "shipping-policy":
      content = (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center bg-[#f9f2ed] p-8 rounded-2xl mb-12 gap-6 relative border border-[#E5B8B7]/30 shadow-sm">
             <div className="flex flex-col items-center text-center max-w-[200px] z-10 relative">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border-2 border-[#800020]">
                 <Box size={24} className="text-[#800020]" />
               </div>
               <h3 className="font-serif text-lg text-stone-900 mt-0 mb-2">1. Processing</h3>
               <p className="text-xs text-stone-600 leading-relaxed mb-0 font-medium">3-5 days for personalized crafting</p>
             </div>
             
             <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-[2px] bg-[#E5B8B7] z-0"></div>
             
             <div className="flex flex-col items-center text-center max-w-[200px] z-10 relative">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border-2 border-[#800020]">
                 <Truck size={24} className="text-[#800020]" />
               </div>
               <h3 className="font-serif text-lg text-stone-900 mt-0 mb-2">2. Dispatch</h3>
               <p className="text-xs text-stone-600 leading-relaxed mb-0 font-medium">Handed over to top-tier couriers</p>
             </div>
             
             <div className="flex flex-col items-center text-center max-w-[200px] z-10 relative">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border-2 border-[#800020]">
                 <CheckCircle2 size={24} className="text-[#800020]" />
               </div>
               <h3 className="font-serif text-lg text-stone-900 mt-0 mb-2">3. Delivery</h3>
               <p className="text-xs text-stone-600 leading-relaxed mb-0 font-medium">2-7 business days across India</p>
             </div>
          </div>
          
          <h2>1. Nationwide Reach and Courier Partnerships</h2>
          <p>Octopus Perfume is proud to offer extensive shipping coverage across the entirety of India. We have forged strategic alliances with top-tier, highly reputable courier and logistics aggregators (such as BlueDart, Delhivery, ExpressBees, and Amazon Shipping) to ensure that your delicate, personalized gifts are handled with the utmost care and delivered with expedience. We do not currently facilitate international shipping.</p>
          
          <h2>2. Comprehensive Processing Timelines</h2>
          <p>Unlike off-the-shelf e-commerce, bespoke gifting requires meticulous craftsmanship. When you place an order, it enters our production queue where it undergoes structural drafting, engraving/printing, polishing, quality assurance, and finally, premium gift wrapping.</p>
          
          <div className="bg-stone-50 border-l-4 border-[#800020] p-6 my-6 rounded-r-xl">
            <ul className="m-0 p-0 list-none space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-[#800020] shrink-0"></div>
                <div>
                  <strong className="block text-stone-900">Personalized/Customized Orders</strong>
                  <span className="text-stone-600 text-sm">Require a mandatory processing window of 3 to 5 business days prior to dispatch.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-[#800020] shrink-0"></div>
                <div>
                  <strong className="block text-stone-900">Non-Personalized Orders</strong>
                  <span className="text-stone-600 text-sm">Are typically processed and dispatched within 1 to 2 business days.</span>
                </div>
              </li>
            </ul>
          </div>
          
          <h2>3. Transit Times and Shipping Tariffs</h2>
          <p>Once dispatched, standard transit times range from <strong>2 to 7 business days</strong>, heavily contingent upon your exact geographical location (metro cities typically see faster deliveries compared to remote or Tier-3 zones). We offer complimentary Standard Shipping on all prepaid orders exceeding ₹1500. For orders below this threshold, a calculated shipping fee will be dynamically applied at checkout.</p>
        </>
      );
      break;
    case "cancellation-policy":
      content = (
        <>
          <div className="bg-red-50 text-red-900 p-6 rounded-xl border border-red-200 mb-8">
            <h3 className="font-serif text-xl font-bold mb-2 mt-0 flex items-center gap-2"><Lock size={20} /> 2-Hour Strict Window</h3>
            <p className="mb-0 text-sm">You may only cancel your order within exactly two (2) hours of successful payment or order placement.</p>
          </div>
          
          <h2>1. Extremely Strict Cancellation Window</h2>
          <p>Our entire operational pipeline is heavily automated to ensure that your personalized gifts are crafted and delivered as swiftly as possible. Once an order for a personalized product is placed on our platform, the details are programmatically routed to our production facility, and raw materials are immediately allocated and cut.</p>
          <p>If two hours have elapsed since the order timestamp, the order is irrevocably locked into the production phase. At this point, the item has been permanently customized with your specific details, rendering it completely unsellable to any other customer. Therefore, we categorically will not accept, process, or entertain any cancellation requests beyond this 2-hour window under any circumstances.</p>
          
          <h2>2. How to Request a Cancellation</h2>
          <p>To request a cancellation within the permitted 2-hour window, you must immediately contact our emergency support team via the contact form on our website or reply directly to your order confirmation email with the subject line <strong>"URGENT CANCELLATION: Order #YourOrderID"</strong>.</p>
        </>
      );
      break;
    case "privacy-policy":
      content = (
        <>
          <p className="lead text-lg font-medium text-stone-500 mb-8">Your privacy is critically important to us. This policy explains how we collect, use, and protect your personal information.</p>
          
          <h2>1. Introduction to Data Privacy</h2>
          <p>At Octopus Perfume, we respect your privacy and are deeply committed to protecting your personal data. This extensive Privacy Policy outlines our rigorous practices regarding the collection, utilization, secure storage, and disclosure of your information when you interact with our platform, octopusperfume.in. By utilizing our services, you grant explicit consent to the data practices described in this document, which complies with the prevailing data protection regulations in India.</p>

          <h2>2. Comprehensive Data Collection Protocols</h2>
          <p>To provide you with a frictionless, highly personalized e-commerce experience, we systematically collect various categories of data:</p>
          <ul className="list-disc pl-5 space-y-2 mt-4 mb-8">
            <li><strong>Identity and Contact Data:</strong> Includes your full name, billing address, delivery address, email address, and telephone numbers.</li>
            <li><strong>Financial Data:</strong> Processed securely via our PCI-DSS compliant payment gateway (PayU); we do not store your raw credit card numbers or UPI PINs on our servers.</li>
            <li><strong>Technical Data:</strong> Encompasses your IP address, browser type and version, time zone setting, location, and operating system.</li>
          </ul>

          <h2>3. Purpose and Utilization of Your Data</h2>
          <p>We deploy your personal data strictly for legitimate business purposes. Primarily, we use it to process and deliver your orders, manage payments, and collect fees. Furthermore, we analyze Technical and Usage Data using advanced analytics to optimize our website layout, improve our algorithms for product recommendations, and deliver highly relevant content.</p>

          <h2>4. Data Security Infrastructure</h2>
          <p>We have implemented an array of robust, enterprise-grade security measures to prevent your personal data from being accidentally lost, altered, disclosed, or accessed in an unauthorized manner. Our databases are secured behind complex firewalls, and all data transmitted between your browser and our servers is encrypted using industry-standard SSL/TLS protocols.</p>
        </>
      );
      break;
    default:
      content = (
        <div className="text-center py-20">
          <FileText size={48} className="mx-auto text-stone-300 mb-6" />
          <h2 className="text-2xl font-serif text-stone-900 mb-4">Legal Document Not Found</h2>
          <p className="text-stone-500">
            The requested document could not be located in our directory. If you believe this is an error, please contact Octopus Perfume support.
          </p>
          <Link href="/" className="inline-block mt-8 bg-[#800020] text-white px-8 py-3 text-xs uppercase tracking-widest font-bold rounded-sm">
            Return to Homepage
          </Link>
        </div>
      );
  }

  return (
    <div className="bg-stone-50 min-h-screen pt-24 pb-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-1/4 shrink-0">
            <div className="sticky top-32 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <h3 className="font-serif text-xl text-stone-900 mb-6 pb-4 border-b border-stone-100">Legal & Policies</h3>
              <nav className="flex flex-col gap-2">
                {SIDEBAR_LINKS.map((link) => (
                  <Link 
                    key={link.slug} 
                    href={`/pages/${link.slug}`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      slug === link.slug 
                        ? 'bg-[#800020] text-white font-bold shadow-md' 
                        : 'text-stone-600 hover:bg-[#f9f2ed] hover:text-[#800020]'
                    }`}
                  >
                    {link.icon}
                    <span className="text-sm tracking-wide">{link.title}</span>
                  </Link>
                ))}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-stone-100">
                <p className="text-xs text-stone-500 font-medium leading-relaxed mb-4">Need help? Our support team is available 24/7 to assist you with any policy questions.</p>
                <Link href="/pages/contact" className="text-xs font-bold uppercase tracking-widest text-[#800020] flex items-center gap-1 hover:gap-2 transition-all">
                  Contact Support <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-2xl p-8 md:p-12 border border-stone-200 shadow-sm">
              <h1 className="font-serif text-3xl md:text-5xl text-stone-900 mb-10 pb-6 border-b border-stone-100">
                {title}
              </h1>

              <div className="prose prose-stone prose-lg prose-p:leading-relaxed prose-p:text-justify prose-p:mb-6 prose-headings:font-serif prose-headings:text-[#800020] prose-headings:mt-10 prose-headings:mb-5 max-w-none text-stone-700">
                {content}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
