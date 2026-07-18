export const metadata = {
  title: "Returns & Refund Policy | Octopus Perfume",
  description: "Returns and refund policy for Octopus Lifestyle Private Limited.",
};

export default function ReturnsRefundPolicyPage() {
  return (
    <div className="bg-paper min-h-screen selection:bg-ink selection:text-paper pt-24 pb-16 px-6 md:px-10 md:pt-32 md:pb-24">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center border-b border-ink/10 pb-10">
          <h1 className="font-serif-display text-4xl md:text-5xl tracking-wide uppercase text-ink mb-4">
            Returns & Refund Policy
          </h1>
        </div>

        <div className="prose prose-sm md:prose-base prose-ink max-w-none space-y-8">
          <section>
            <h2 className="font-serif-display text-xl text-ink mb-3 uppercase tracking-widest">
              HOW DO I KNOW IF AN ITEM IS ELIGIBLE FOR RETURN?
            </h2>
            <p className="text-ink/80 leading-relaxed mb-4">
              Our products are not eligible for Return/Exchange.
            </p>
          </section>

          <section>
            <h2 className="font-serif-display text-xl text-ink mb-3 uppercase tracking-widest">
              WHAT SHOULD I DO IF I RECEIVE A DAMAGED, DEFECTIVE, OR INCORRECT PRODUCT?
            </h2>
            <p className="text-ink/80 leading-relaxed mb-4">
              If you receive a damaged, defective, or wrong item, please contact us within 24 hours of receiving your order. Ensure you include an unboxing video and pictures of the product along with the original packaging. Email us at <a href="mailto:support@octopusperfume.in" className="font-bold border-b border-ink">support@octopusperfume.in</a>, and we will resolve the issue promptly.
            </p>
          </section>

          <section>
            <h2 className="font-serif-display text-xl text-ink mb-3 uppercase tracking-widest">
              IS AN UNBOXING VIDEO REQUIRED TO MAKE A CLAIM?
            </h2>
            <p className="text-ink/80 leading-relaxed mb-4">
              Yes, an unboxing video showing the product in its original packaging is mandatory for any claims related to missing items, leakage, breakage, or incorrect products.
            </p>
          </section>

          <section>
            <h2 className="font-serif-display text-xl text-ink mb-3 uppercase tracking-widest">
              WHEN WILL I RECEIVE A REFUND?
            </h2>
            <p className="text-ink/80 leading-relaxed mb-4">
              We do not have a refund policy. There will be no refund in any conditions. If you have received a damaged, defective or incorrect order, please email us within 24 hours of receiving your order along with unboxing videos and we will dispatch the product again.
            </p>
          </section>

          <section>
            <h2 className="font-serif-display text-xl text-ink mb-3 uppercase tracking-widest">
              WHAT SHOULD I DO IF THE PACKAGE APPEARS TAMPERED WITH OR DAMAGED UPON DELIVERY?
            </h2>
            <p className="text-ink/80 leading-relaxed mb-4">
              If the package appears tampered with or visibly damaged, please refuse to accept it from the delivery partner and report it immediately.
            </p>
          </section>

          <section>
            <h2 className="font-serif-display text-xl text-ink mb-3 uppercase tracking-widest">
              DO YOU PERFORM QUALITY CHECKS BEFORE SHIPPING?
            </h2>
            <p className="text-ink/80 leading-relaxed mb-4">
              Yes, we perform thorough quality control checks on all products before dispatch. However, in the rare event that you receive an incorrect or damaged item, rest assured—we’re here to help.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
