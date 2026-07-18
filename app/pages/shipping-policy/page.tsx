export const metadata = {
  title: "Shipping Policy | Octopus Perfume",
  description: "Shipping policy for Octopus Lifestyle Private Limited.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-paper min-h-screen selection:bg-ink selection:text-paper pt-24 pb-16 px-6 md:px-10 md:pt-32 md:pb-24">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center border-b border-ink/10 pb-10">
          <h1 className="font-serif-display text-4xl md:text-5xl tracking-wide uppercase text-ink mb-4">
            Shipping Policy
          </h1>
        </div>

        <div className="prose prose-sm md:prose-base prose-ink max-w-none space-y-8">
          <section>
            <h2 className="font-serif-display text-xl text-ink mb-3 uppercase tracking-widest">
              IS THERE AN ADDITIONAL SHIPPING CHARGE?
            </h2>
            <p className="text-ink/80 leading-relaxed mb-4">
              Shipping and handling rates vary based on product, packaging, size, volume, and other considerations. These charges will be shown at checkout for review before completing payment.
            </p>
          </section>

          <section>
            <h2 className="font-serif-display text-xl text-ink mb-3 uppercase tracking-widest">
              HOW LONG WILL IT TAKE FOR MY ORDER TO REACH ME?
            </h2>
            <p className="text-ink/80 leading-relaxed mb-4">
              It takes 7-8 days for shipping the product and 15-17 days for delivery from the order date.
            </p>
            <p className="text-ink/80 leading-relaxed mb-4">
              You will receive the tracking details on your E-Mail/Phone Number as soon as the product is dispatched.
            </p>
          </section>

          <section>
            <h2 className="font-serif-display text-xl text-ink mb-3 uppercase tracking-widest">
              WHAT IS ESHOPBOX?
            </h2>
            <p className="text-ink/80 leading-relaxed mb-4">
              Eshopbox (Eshopbox Ecommerce Private Limited) is an authorised seller of all our merchandise and/or products. Eshopbox handles, packs and dispatches all the orders.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
