import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Bag | Octopus Perfumes India",
  robots: { index: false, follow: true },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}

