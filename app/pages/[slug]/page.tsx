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
          <h2>Our Story</h2>
          <p>Welcome to Octopus Perfume. We are a premium personalized gifting brand based in India, dedicated to curating the finest and most luxurious gifts for every relationship and occasion.</p>
          <p>Our mission is to help you express your love and appreciation through beautifully crafted, bespoke gifts that leave a lasting impression. Every item in our collection is carefully selected and personalized to perfection.</p>
          <p><strong>Registered Address for Verification:</strong><br />Octopus Perfume<br />Shri Shanta Sharnam<br />Tonk, Rajasthan, 304022</p>
        </>
      );
      break;
    case "terms-and-conditions":
      content = (
        <>
          <h2>1. Introduction</h2>
          <p>Welcome to Octopus Perfume. These Terms and Conditions govern your use of our website, octopusperfume.in, and the purchase of any products from us. By accessing our website, you agree to be bound by these Terms. If you do not agree with any part of these terms, please do not use our services.</p>
          <h2>2. Intellectual Property</h2>
          <p>All content included on this site, such as text, graphics, logos, button icons, images, and software, is the property of Octopus Perfume or its content suppliers and protected by international copyright laws. The compilation of all content on this site is the exclusive property of Octopus Perfume.</p>
          <h2>3. Product Descriptions and Pricing</h2>
          <p>We strive to ensure that all details, descriptions, and prices of products appearing on the website are accurate. However, errors may occur. If we discover an error in the price of any goods which you have ordered, we will inform you of this as soon as possible and give you the option of reconfirming your order at the correct price or cancelling it.</p>
          <h2>4. User Account</h2>
          <p>If you create an account on our website, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password.</p>
          <h2>5. Limitation of Liability</h2>
          <p>Octopus Perfume shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or the inability to use our website or products.</p>
          <h2>6. Governing Law</h2>
          <p>These terms and conditions shall be governed by and construed in accordance with the laws of India, and any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Rajasthan.</p>
        </>
      );
      break;
    case "return-policy":
      content = (
        <>
          <h2>1. Overview</h2>
          <p>At Octopus Perfume, we take immense pride in the quality and craftsmanship of our personalized gifts and perfumes. Due to the highly customized nature of our products, we operate under a strict no-return policy for customized or personalized items unless the item is defective or damaged upon arrival.</p>
          <h2>2. Defective or Damaged Products</h2>
          <p>If you receive a defective or damaged product, you must notify us within 48 hours of delivery. Please provide photographic evidence of the damage along with your order number. Once verified, we will arrange for a replacement to be sent to you at no additional cost.</p>
          <h2>3. Non-Customized Products</h2>
          <p>For non-customized products, we accept returns within 7 days of delivery. The item must be unused, in its original packaging, and in the same condition that you received it. Return shipping costs are the responsibility of the customer.</p>
          <h2>4. Refunds</h2>
          <p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. If approved, your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within 5-7 business days.</p>
          <h2>5. Exchanges</h2>
          <p>We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email via our contact page.</p>
        </>
      );
      break;
    case "shipping-policy":
      content = (
        <>
          <h2>1. Shipping Locations</h2>
          <p>We currently ship exclusively within India. We partner with reliable courier services to ensure your premium gifts reach you safely and on time.</p>
          <h2>2. Processing Time</h2>
          <p>All personalized orders require a processing and crafting time of 3-5 business days before they are shipped. Non-personalized items are processed within 1-2 business days.</p>
          <h2>3. Shipping Time and Costs</h2>
          <p>Standard shipping usually takes 4-7 business days after processing. Shipping costs are calculated at checkout based on your location and the weight of your order. We offer free shipping on all orders over ₹1500.</p>
          <h2>4. Tracking Your Order</h2>
          <p>Once your order is shipped, you will receive an email with your tracking number and a link to track your package. You can also track your order directly from your account dashboard.</p>
          <h2>5. Unforeseen Delays</h2>
          <p>While we strive to meet all delivery times, please note that shipping may be delayed due to unforeseen circumstances such as extreme weather, natural disasters, or logistical issues with our courier partners. Octopus Perfume is not liable for such delays.</p>
        </>
      );
      break;
    case "cancellation-policy":
      content = (
        <>
          <h2>1. Order Cancellation by Customer</h2>
          <p>Because we begin processing personalized orders immediately to ensure quick delivery, you may only cancel your order within 24 hours of placement. If 24 hours have passed, we cannot accept cancellations as the customization process will have already begun.</p>
          <h2>2. Non-Personalized Items</h2>
          <p>Non-personalized items can be cancelled any time before they are shipped. Once shipped, they must be processed as a return under our Return Policy.</p>
          <h2>3. Cancellation by Octopus Perfume</h2>
          <p>We reserve the right to cancel any order for any reason, including but not limited to stock unavailability, errors in pricing or product descriptions, or suspicion of fraudulent activity. If we cancel your order, you will be notified immediately and a full refund will be issued.</p>
          <h2>4. Refund Process for Cancellations</h2>
          <p>If your cancellation is approved, a full refund will be processed to your original method of payment within 5-7 business days. For Cash on Delivery orders where an advance was paid, the advance will be refunded if the cancellation is made within the acceptable window.</p>
        </>
      );
      break;
    default:
      content = (
        <p>
          Welcome to Octopus Perfume. This page content is currently being updated.
          Check back soon for more information about {slug.replace(/-/g, ' ')}.
        </p>
      );
  }

  return (
    <div className="bg-stone-50 min-h-screen pt-24 pb-32">
      <div className="mx-auto max-w-[800px] px-6 md:px-12 bg-white p-10 md:p-16 border border-stone-200 shadow-sm">
        <h1 className="font-serif text-3xl md:text-5xl text-stone-900 mb-12 text-center capitalize tracking-wide">
          {slug.replace(/-/g, ' ')}
        </h1>

        <div className="prose prose-stone prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-[#800020] max-w-none text-stone-600">
          {content}
        </div>
      </div>
    </div>
  );
}
