import { ReactNode } from "react";

export function PolicyPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <h1 className="font-serif-display text-4xl md:text-5xl mb-10">{title}</h1>
      <div className="prose-policy space-y-5 text-sm leading-relaxed text-ink/75">{children}</div>
    </div>
  );
}
