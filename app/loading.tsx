import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-stone-50/80 backdrop-blur-sm flex flex-col items-center justify-center min-h-screen w-full">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-[#800020] blur-xl opacity-20 rounded-full animate-pulse"></div>
        <Loader2 className="w-12 h-12 text-[#800020] animate-spin relative z-10" />
      </div>
      <p className="mt-4 text-[#800020] font-serif text-lg animate-pulse tracking-widest">
        Loading...
      </p>
    </div>
  );
}
