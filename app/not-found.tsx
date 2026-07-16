import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-stone-50 px-6 text-center">
      <p className="text-[11px] tracking-[0.3em] uppercase text-stone-400 mb-6 font-semibold">
        Error 404
      </p>
      <h1 className="font-serif-display text-5xl md:text-7xl text-stone-900 mb-6 leading-tight">
        Page Not Found
      </h1>
      <p className="text-stone-500 max-w-md mx-auto mb-10 leading-relaxed">
        The scent you are looking for seems to have faded away. The page might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        href="/"
        className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-[#d4af37] transition-colors duration-300"
      >
        Return to Shop <ArrowRight size={16} />
      </Link>
    </div>
  );
}
