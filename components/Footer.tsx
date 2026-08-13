"use client";

import Link from "next/link";

const POLICY_LINKS = [
  { href: "/pages/about-us", label: "About Us" },
  { href: "/pages/shipping-policy", label: "Shipping" },
  { href: "/pages/privacy-policy", label: "Privacy" },
  { href: "/pages/returns-refund-policy", label: "Returns" },
  { href: "/pages/terms-conditions", label: "Terms" },
];

export default function Footer() {
  return (
    <footer className="bg-stone-50 text-stone-900 relative overflow-hidden border-t border-stone-200 mt-20">
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          <div className="md:col-span-5 flex flex-col items-start">
            <h2 className="font-serif text-3xl md:text-4xl tracking-widest uppercase mb-6 text-stone-900">
              Everlasting
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed max-w-sm mb-8 font-light">
              Personalized, timeless jewelry designed for everyday elegance.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-8 font-medium">Discover</p>
            <ul className="space-y-4">
              {POLICY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-2 group"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-8 font-medium">Join our Newsletter</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex border-b border-stone-300 pb-3 relative group focus-within:border-stone-500 transition-colors">
              <input
                type="email"
                required
                placeholder="Email Address"
                className="w-full bg-transparent outline-none text-sm placeholder:text-stone-400 text-stone-900"
              />
              <button 
                type="submit" 
                className="text-xs tracking-widest uppercase shrink-0 text-stone-500 hover:text-stone-900 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-stone-500 tracking-widest uppercase">
          <span>© {new Date().getFullYear()} Everlasting Shop. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
