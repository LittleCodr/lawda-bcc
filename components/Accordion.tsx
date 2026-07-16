"use client";

import { useState, ReactNode } from "react";
import { Plus, Minus } from "lucide-react";

export function Accordion({ items }: { items: { title: string; content: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink/10 border-t border-b border-ink/10">
      {items.map((item, i) => (
        <div key={item.title}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-5 text-left group"
          >
            <span className="text-xs tracking-[0.2em] uppercase text-ink/80 group-hover:text-gold transition-colors font-medium">{item.title}</span>
            <span className="text-ink/50 group-hover:text-gold transition-colors">
              {open === i ? <Minus size={16} strokeWidth={1.5} /> : <Plus size={16} strokeWidth={1.5} />}
            </span>
          </button>
          {open === i && <div className="pb-6 text-sm text-ink/70 leading-relaxed font-light animate-fade-in">{item.content}</div>}
        </div>
      ))}
    </div>
  );
}
