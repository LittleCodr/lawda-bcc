"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

const STORAGE_KEY = "octopus_wishlist";

export function readWishlistHandles(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export default function WishlistButton({
  handle,
  title,
  className = "",
}: {
  handle: string;
  title?: string;
  className?: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => {
      setSaved(readWishlistHandles().includes(handle));
    };
    sync();
    window.addEventListener("octopus-wishlist-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("octopus-wishlist-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, [handle]);

  const toggle = () => {
    const current = readWishlistHandles();
    const exists = current.includes(handle);
    const next = exists ? current.filter((h) => h !== handle) : [...current, handle];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("octopus-wishlist-change"));
    } catch {
      // Ignore storage quota errors
    }
    setSaved(!exists);
    toast.success(
      exists
        ? `Removed ${title ? `"${title}"` : "item"} from wishlist`
        : `Saved ${title ? `"${title}"` : "item"} to wishlist`,
      { duration: 1800 }
    );
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={saved}
      className={`inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white border border-[#E8E6E1] text-[#242424] shadow-sm transition-colors touch-manipulation cursor-pointer ${className}`}
    >
      <Heart
        size={15}
        className={saved ? "fill-[#B83232] text-[#B83232]" : "text-[#5C5954]"}
      />
    </button>
  );
}

