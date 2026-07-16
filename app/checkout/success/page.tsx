import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 text-center">
      <Image src="/logo.png" alt="Octopus" width={56} height={56} className="mb-6" />
      <CheckCircle size={48} className="text-green-600 mb-4" strokeWidth={1.5} />
      <h1 className="font-serif-display text-4xl md:text-5xl mb-4">Thank You!</h1>
      <p className="text-muted max-w-md mx-auto mb-4 leading-relaxed">
        Your payment was successful and your order has been placed. We will begin processing your items shortly.
      </p>
      <p className="text-muted max-w-md mx-auto mb-10 text-sm">
        This order has been saved to your account. You can view your order history anytime from your{" "}
        <Link href="/account" className="underline text-ink">Account</Link> page.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/account"
          className="border border-ink px-8 py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-ink hover:text-paper transition-colors"
        >
          View Orders
        </Link>
        <Link 
          href="/"
          className="bg-ink text-paper px-8 py-3 text-[11px] tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
