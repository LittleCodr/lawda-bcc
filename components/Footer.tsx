"use client";

import { useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const POLICY_LINKS = [
  { href: "/pages/about-us", label: "Heritage" },
  { href: "/pages/shipping-policy", label: "Shipping" },
  { href: "/pages/privacy-policy", label: "Privacy" },
  { href: "/pages/returns-refund-policy", label: "Returns" },
  { href: "/pages/terms-conditions", label: "Terms" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    try {
      await addDoc(collection(db, "newsletter"), {
        email,
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <footer className="bg-stone-50 text-stone-900 relative overflow-hidden border-t border-stone-200">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-stone-200/40 blur-[120px] rounded-[100%] pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          <div className="md:col-span-5 flex flex-col items-start">
            <h2 className="font-serif-display text-4xl md:text-5xl tracking-[0.1em] uppercase mb-6 text-stone-900">
              Octopus
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed max-w-sm mb-8 font-light">
              High-quality fine fragrance, built for the Indian connoisseur at sensible prices -
              bypassing traditional branding and distributor markups.
            </p>
            <a
              href="https://instagram.com/buyoctopus"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-stone-600 hover:text-stone-900 transition-colors border border-stone-200 px-6 py-3 rounded-full hover:bg-white bg-transparent"
            >
              <InstagramIcon />
              @buyoctopus
            </a>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-8 font-medium">Discover</p>
            <ul className="space-y-4">
              {POLICY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-stone-600 hover:text-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-4" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-8 font-medium">Join the Club</p>
            <form onSubmit={handleNewsletter} className="flex border-b border-stone-300 pb-3 relative group focus-within:border-gold transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email Address"
                disabled={status === "loading" || status === "success"}
                className="w-full bg-transparent outline-none text-sm placeholder:text-stone-400 disabled:opacity-50 text-stone-900"
              />
              <button 
                type="submit" 
                disabled={status === "loading" || status === "success"}
                className="text-xs tracking-[0.2em] uppercase shrink-0 disabled:opacity-50 text-stone-500 group-hover:text-gold transition-colors"
              >
                {status === "loading" ? "..." : status === "success" ? "Joined ✓" : "Submit"}
              </button>
              {status === "error" && (
                <span className="absolute -bottom-6 left-0 text-[10px] text-red-500">Something went wrong. Try again.</span>
              )}
            </form>
            <p className="text-[11px] text-stone-500 mt-6 leading-relaxed">
              For order tracking:{" "}
              <a
                href="https://octopus-lifestyle.eshopbox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-700 hover:text-gold hover:underline transition-all"
              >
                Click here
              </a>
            </p>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-stone-500 tracking-[0.1em] uppercase">
          <span>© {new Date().getFullYear()} Octopus Lifestyle Private Limited.</span>
          <span>Crafted in India</span>
        </div>
      </div>
    </footer>
  );
}
