export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, ' ').toUpperCase()} | Octopus Perfume` };
}

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let content = null;
  
  switch(slug) {
    case "about-us":
      content = (
        <>
          <h2>Our Genesis and Vision</h2>
          <p>Welcome to Octopus Perfume, India’s premier destination for bespoke, personalized gifting. Our journey began with a singular, resolute vision: to transform the way Indians celebrate their most cherished relationships. In a world inundated with mass-produced commodities, we realized that the true essence of gifting had been lost. We set out to restore that essence by creating a brand dedicated entirely to the art of personalization.</p>
          <p>We understand that every individual is unique, and every relationship tells a different story. That is why our products are not just items; they are tangible memories, meticulously crafted to reflect the profound bonds you share with your loved ones. Whether it is an engraved piece of artificial jewelry, a custom-printed keepsake, or an elegantly packaged fragrance, every product that leaves our facility carries with it a promise of quality, exclusivity, and heartfelt emotion.</p>
          
          <h2>Our Craftsmanship and Dedication</h2>
          <p>Our commitment to excellence is unwavering. We collaborate with master artisans and employ cutting-edge engraving and printing technologies to ensure that every personalization detail is executed with flawless precision. Our materials are ethically sourced, and our manufacturing processes are subjected to rigorous quality control protocols. When you purchase an Octopus product, you are acquiring a masterpiece of modern craftsmanship designed to endure the test of time.</p>
          <p>We take immense pride in our state-of-the-art facility located in the heart of Rajasthan, a region globally renowned for its rich heritage of artistry and craftsmanship. Here, traditional techniques seamlessly blend with modern innovation, resulting in products that are both culturally resonant and contemporarily elegant.</p>

          <h2>Our Commitment to Customer Delight</h2>
          <p>At the core of our operations is an unyielding dedication to customer satisfaction. We do not merely sell gifts; we curate experiences. From the moment you land on our website to the instant our premium, signature packaging is unboxed, every touchpoint is optimized to deliver unparalleled delight. Our customer support team operates round-the-clock, ensuring that your queries are addressed promptly and your bespoke requests are fulfilled flawlessly.</p>
          <p>We are continuously innovating, expanding our product lines, and refining our customization capabilities to stay ahead of the curve. Your trust is our most valued asset, and we go to extraordinary lengths to preserve it.</p>
          
          <h2>Corporate Information & Legal Entity</h2>
          <p>Octopus Perfume operates under full compliance with all relevant corporate and commercial laws in India. For any legal inquiries, corporate collaborations, or official correspondence, please refer to our registered headquarters:</p>
          <p><strong>Registered Address for Verification:</strong><br />Octopus Perfume<br />Shri Shanta Sharnam<br />Tonk, Rajasthan, 304022<br />India</p>
          <p>For immediate assistance, our dedicated support channels remain open during standard business hours. We invite you to join the Octopus family and experience the zenith of personalized gifting.</p>
        </>
      );
      break;
    case "terms-conditions":
      content = (
        <>
          <h2>1. Comprehensive Introduction and Acceptance of Terms</h2>
          <p>Welcome to Octopus Perfume (accessible at octopusperfume.in). These comprehensive Terms and Conditions ("Terms", "Agreement") constitute a legally binding contract between you (the "User", "Customer", "Visitor") and Octopus Perfume ("we", "us", "our", "the Company"). By accessing, browsing, registering an account, or placing an order on our platform, you categorically acknowledge that you have read, understood, and unequivocally agreed to be bound by these Terms in their entirety. If you harbor any objections to these Terms, you are explicitly prohibited from using our services and must immediately cease all access to the platform.</p>
          
          <h2>2. Intellectual Property Rights and Copyright Infringement</h2>
          <p>The entire contents of the Octopus Perfume website—including but not limited to textual content, graphical assets, logos, button icons, high-resolution imagery, audio clips, digital downloads, data compilations, and proprietary software—are the exclusive intellectual property of Octopus Perfume or its certified content suppliers. These assets are protected under the Indian Copyright Act, 1957, as well as international copyright and trademark laws. Any unauthorized reproduction, modification, distribution, transmission, republication, display, or performance of the content on this site is strictly prohibited and will be met with immediate legal action, potentially including claims for substantial damages and injunctive relief.</p>
          
          <h2>3. Detailed Product Descriptions, Pricing, and Availability</h2>
          <p>While we expend extraordinary effort to ensure the absolute accuracy of all product descriptions, high-definition imagery, and pricing information, the Company does not warrant that product descriptions or other content is completely error-free, current, or reliable. All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the unassailable right to dynamically alter pricing without prior notice. In the event a product is listed at an incorrect price due to typographical error or system malfunction, we reserve the right to unilaterally refuse or cancel any orders placed for that product, regardless of whether the order has been confirmed or your payment method charged. If charged, a full refund will be initiated immediately.</p>
          
          <h2>4. User Account Obligations and Security</h2>
          <p>To access specific advanced features, you may be required to register a user account. You are entirely responsible for maintaining the strict confidentiality of your account credentials (username and password) and for restricting unauthorized access to your devices. You agree to accept full responsibility for all activities, purchases, and communications that occur under your account. Octopus Perfume reserves the right to suspend or terminate accounts, refuse service, or cancel orders at our sole discretion if we detect any fraudulent, abusive, or Terms-violating activity.</p>
          
          <h2>5. Bespoke Personalization Policies</h2>
          <p>As our core offering relies on customization, you are solely responsible for ensuring the absolute accuracy of all personalization inputs (e.g., names, dates, spelling, grammar) submitted during the checkout process. Octopus Perfume will not be held liable for typographical errors submitted by the customer. Furthermore, you agree not to submit any personalization requests that contain offensive, defamatory, profane, or legally prohibited content. We reserve the right to reject any personalization request that violates our ethical guidelines.</p>

          <h2>6. Limitation of Liability and Indemnification</h2>
          <p>To the maximum extent permitted by applicable law, Octopus Perfume, its directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers, or licensors shall not be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation, lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of any of the service or any products procured using the service. You agree to fully indemnify, defend and hold harmless Octopus Perfume from any claim or demand, including reasonable attorneys’ fees, made by any third-party due to or arising out of your breach of these Terms.</p>
          
          <h2>7. Dispute Resolution and Governing Law</h2>
          <p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed strictly in accordance with the laws of India. Any disputes, controversies, or claims arising out of or relating to these Terms, or the breach thereof, shall be subject to the exclusive jurisdiction of the competent courts located in Tonk, Rajasthan. By using this site, you unconditionally consent to this jurisdictional arrangement.</p>
        </>
      );
      break;
    case "returns-refund-policy":
      content = (
        <>
          <h2>1. General Philosophy on Returns</h2>
          <p>At Octopus Perfume, our operational model is heavily centered on creating highly bespoke, customized products tailored specifically to individual customer requests. Because these items are permanently altered (e.g., engraved, printed, or custom-molded) to feature your specific names, dates, or messages, they cannot be restocked, resold, or reused. Consequently, we enforce a strict, definitive <strong>No-Return, No-Refund Policy</strong> on all personalized merchandise, barring exceptional circumstances related to manufacturing defects or transit damage.</p>
          
          <h2>2. Policy for Defective, Damaged, or Incorrect Products</h2>
          <p>We implement rigorous multi-stage quality control checks before any product is dispatched. However, in the highly unlikely event that you receive an item that is defective, damaged during transit, or deviates from the personalization details you originally submitted, you are entitled to a swift resolution. To claim this:</p>
          <ul>
            <li>You must notify our Customer Protection Team within <strong>48 hours</strong> of the delivery timestamp recorded by our courier partner.</li>
            <li>Your notification must include your Order ID, a detailed description of the defect, and high-resolution, unedited photographic or video evidence clearly displaying the issue and the original packaging.</li>
            <li>Failure to report the issue within this rigid 48-hour window will result in the forfeiture of your claim, and Octopus Perfume will not entertain any subsequent requests for replacement or refund.</li>
          </ul>
          <p>Upon verification of a valid claim, we will exclusively offer a <strong>Replacement</strong> of the identical item with the correct specifications. Refunds are not issued for defective personalized items; they are strictly replaced.</p>
          
          <h2>3. Non-Customized Product Returns</h2>
          <p>If you purchase a non-customized, off-the-shelf product (which has not been personalized in any manner), you may initiate a return within <strong>7 calendar days</strong> of delivery. The product must be completely unused, free of any cosmetic damage, and housed in its original, undamaged premium packaging with all tags and protective seals intact. Return shipping logistics and associated costs are the sole responsibility of the customer. Once we receive and thoroughly inspect the returned non-customized item, we will process a refund to your original payment method within 7-14 business days, deducting a nominal restocking and original shipping fee.</p>

          <h2>4. Artificial Jewelry Care Disclaimer</h2>
          <p>Please note that all our jewelry products are explicitly classified as <strong>Artificial Jewelry</strong>. While we utilize premium anti-tarnish plating techniques, artificial jewelry is inherently subject to wear and fading over time based on environmental exposure (e.g., humidity, sweat, perfumes, harsh chemicals). Normal wear and tear, fading of plating, or allergic reactions do not qualify as manufacturing defects and are strictly ineligible for returns or replacements.</p>

          <h2>5. Final Authority</h2>
          <p>Octopus Perfume reserves the absolute right to unilaterally reject any return or replacement claim that we suspect is fraudulent, abusive, or fails to meet the stringent criteria outlined in this policy.</p>
        </>
      );
      break;
    case "shipping-policy":
      content = (
        <>
          <h2>1. Nationwide Reach and Courier Partnerships</h2>
          <p>Octopus Perfume is proud to offer extensive shipping coverage across the entirety of India. We have forged strategic alliances with top-tier, highly reputable courier and logistics aggregators (such as BlueDart, Delhivery, ExpressBees, and Amazon Shipping) to ensure that your delicate, personalized gifts are handled with the utmost care and delivered with expedience. We do not currently facilitate international shipping.</p>
          
          <h2>2. Comprehensive Processing Timelines</h2>
          <p>Unlike off-the-shelf e-commerce, bespoke gifting requires meticulous craftsmanship. When you place an order, it enters our production queue where it undergoes structural drafting, engraving/printing, polishing, quality assurance, and finally, premium gift wrapping. Therefore:</p>
          <ul>
            <li><strong>Personalized/Customized Orders:</strong> Require a mandatory processing window of <strong>3 to 5 business days</strong> prior to dispatch.</li>
            <li><strong>Non-Personalized Orders:</strong> Are typically processed and dispatched within <strong>1 to 2 business days</strong>.</li>
          </ul>
          <p>Business days explicitly exclude Sundays and officially recognized National/State Holidays in Rajasthan.</p>
          
          <h2>3. Transit Times and Shipping Tariffs</h2>
          <p>Once dispatched, standard transit times range from <strong>2 to 7 business days</strong>, heavily contingent upon your exact geographical location (metro cities typically see faster deliveries compared to remote or Tier-3 zones). We offer complimentary Standard Shipping on all prepaid orders exceeding ₹1500. For orders below this threshold, a calculated shipping fee will be dynamically applied at checkout. For Cash on Delivery (COD) orders, a non-refundable COD handling fee (advance) of ₹100 is strictly enforced to mitigate fraudulent orders and cover additional logistics overhead.</p>
          
          <h2>4. Real-Time Tracking and Delivery Protocols</h2>
          <p>Immediately upon dispatch, our systems will automatically generate a tracking Airway Bill (AWB) number and dispatch an email and SMS containing your live tracking link. Our courier partners will attempt delivery a maximum of three (3) times. If the customer is unreachable, provides an incorrect address, or refuses delivery, the package will be Returned to Origin (RTO). In the case of RTO for personalized items, no refunds will be provided, and the customer will be liable to pay a re-shipping fee to have the package dispatched again.</p>
          
          <h2>5. Force Majeure and Unforeseen Logistics Disruptions</h2>
          <p>While our logistical network is highly optimized, Octopus Perfume shall not be held liable for any delays in delivery resulting from events beyond our reasonable control. This includes, but is not limited to, severe meteorological events, natural disasters, localized strikes, geopolitical unrest, regulatory lockdowns, or systemic failures within the courier network. We do not offer compensation or refunds for delayed deliveries caused by such Force Majeure events.</p>
        </>
      );
      break;
    case "cancellation-policy":
      content = (
        <>
          <h2>1. Extremely Strict Cancellation Window</h2>
          <p>Our entire operational pipeline is heavily automated to ensure that your personalized gifts are crafted and delivered as swiftly as possible. Once an order for a personalized product is placed on our platform, the details are programmatically routed to our production facility, and raw materials are immediately allocated and cut. Because of this rapid manufacturing commencement, we enforce a highly stringent cancellation window.</p>
          <p><strong>You may only cancel your order within exactly two (2) hours of successful payment or order placement.</strong></p>
          <p>If two hours have elapsed since the order timestamp, the order is irrevocably locked into the production phase. At this point, the item has been permanently customized with your specific details, rendering it completely unsellable to any other customer. Therefore, we categorically will not accept, process, or entertain any cancellation requests beyond this 2-hour window under any circumstances.</p>
          
          <h2>2. How to Request a Cancellation</h2>
          <p>To request a cancellation within the permitted 2-hour window, you must immediately contact our emergency support team via the contact form on our website or reply directly to your order confirmation email with the subject line "URGENT CANCELLATION: Order #YourOrderID". Requests made via social media DMs are not considered official and may not be processed in time.</p>
          
          <h2>3. Cancellation Initiated by Octopus Perfume</h2>
          <p>Octopus Perfume reserves the absolute right to unilaterally cancel any order without prior consent from the customer in the following scenarios:</p>
          <ul>
            <li>Suspected fraudulent activity or failure to pass risk analysis checks.</li>
            <li>Incomplete, nonsensical, or unverifiable shipping addresses.</li>
            <li>Requests for personalization that violate our ethical guidelines (e.g., hate speech, profanity).</li>
            <li>Sudden, unforeseen depletion of raw materials or inventory discrepancies.</li>
            <li>Pricing errors due to system glitches.</li>
          </ul>
          <p>If we initiate a cancellation, you will be notified immediately via your registered email, and a 100% full refund will be processed.</p>
          
          <h2>4. Refund Logistics for Approved Cancellations</h2>
          <p>If your cancellation is officially approved (either within the 2-hour window by you, or initiated by us), the refund process will commence immediately. The funds will be credited back to your original mode of payment (Credit Card, Debit Card, UPI, or Netbanking) via our payment gateway partner (PayU). Please allow 5 to 7 business days for the financial institutions to process the transaction and reflect the credited amount in your account statement. For COD orders where an advance of ₹100 was paid, this advance will be fully refunded if the cancellation falls within the strict 2-hour parameter.</p>
        </>
      );
      break;
    case "privacy-policy":
      content = (
        <>
          <h2>1. Introduction to Data Privacy</h2>
          <p>At Octopus Perfume, we respect your privacy and are deeply committed to protecting your personal data. This extensive Privacy Policy outlines our rigorous practices regarding the collection, utilization, secure storage, and disclosure of your information when you interact with our platform, octopusperfume.in. By utilizing our services, you grant explicit consent to the data practices described in this document, which complies with the prevailing data protection regulations in India, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act.</p>

          <h2>2. Comprehensive Data Collection Protocols</h2>
          <p>To provide you with a frictionless, highly personalized e-commerce experience, we systematically collect various categories of data. <strong>Identity and Contact Data</strong> includes your full name, billing address, delivery address, email address, and telephone numbers. <strong>Financial Data</strong> is processed securely via our PCI-DSS compliant payment gateway (PayU); we do not store your raw credit card numbers or UPI PINs on our servers. <strong>Technical Data</strong> encompasses your internet protocol (IP) address, browser type and version, time zone setting, location, browser plug-in types, operating system, and the device you use to access our site. <strong>Profile and Usage Data</strong> includes your username, password, purchase history, your interests, preferences, and meticulous logs of how you navigate and interact with our website.</p>

          <h2>3. Purpose and Utilization of Your Data</h2>
          <p>We deploy your personal data strictly for legitimate business purposes. Primarily, we use it to process and deliver your orders, manage payments, and collect fees. Furthermore, we analyze Technical and Usage Data using advanced analytics to optimize our website layout, improve our artificial intelligence algorithms for product recommendations, and deliver highly relevant, targeted SEO content and advertisements. Your Contact Data may be utilized to dispatch critical service updates, order tracking information, and, if you have opted in, promotional newsletters and exclusive discount codes.</p>

          <h2>4. Data Sharing and Third-Party Disclosures</h2>
          <p>Octopus Perfume categorically does not sell, rent, or trade your personal data to external marketing agencies. However, to operate our platform efficiently, we must share specific data subsets with strictly vetted third-party service providers. This includes our logistics and courier partners (for order delivery), payment gateway providers like PayU (for secure financial processing), and analytics/hosting providers (like Firebase and Google Analytics). These entities are legally bound by strict confidentiality agreements and are permitted to process your data solely for specified purposes in accordance with our direct instructions. We may also disclose your data to law enforcement agencies if legally mandated to do so by a valid court order or statutory requirement.</p>

          <h2>5. Data Security Infrastructure</h2>
          <p>We have implemented an array of robust, enterprise-grade security measures to prevent your personal data from being accidentally lost, altered, disclosed, or accessed in an unauthorized manner. Our databases are secured behind complex firewalls, and all data transmitted between your browser and our servers is encrypted using industry-standard SSL/TLS protocols. Access to your personal data is strictly limited to employees, agents, and contractors who have a legitimate business need to know, and they are subject to a strict duty of confidentiality.</p>

          <h2>6. Data Retention and Your Rights</h2>
          <p>We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements. You possess specific rights under data protection laws, including the right to request access to your personal data, request correction of inaccurate data, and request the deletion of your data (subject to our legal retention obligations). To exercise any of these rights, please submit a formal request via our contact channels.</p>
        </>
      );
      break;
    default:
      content = (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Legal Document Not Found</h2>
          <p>
            The requested legal document could not be located in our directory. If you believe this is an error, please contact Octopus Perfume support.
          </p>
        </div>
      );
  }

  return (
    <div className="bg-stone-50 min-h-screen pt-24 pb-32">
      <div className="mx-auto max-w-[900px] px-6 md:px-12 bg-white p-10 md:p-16 border border-stone-200 shadow-sm">
        <h1 className="font-serif text-3xl md:text-5xl text-stone-900 mb-12 text-center capitalize tracking-wide border-b border-stone-100 pb-8">
          {slug.replace(/-/g, ' ')}
        </h1>

        <div className="prose prose-stone prose-p:leading-relaxed prose-p:text-justify prose-p:mb-6 prose-headings:font-serif prose-headings:text-[#800020] prose-headings:mt-10 prose-headings:mb-4 max-w-none text-stone-700">
          {content}
        </div>
      </div>
    </div>
  );
}
