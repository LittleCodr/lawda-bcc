"use client";

import { useState } from "react";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const trimmed = email.trim();
    if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
      setStatus("error");
      setFeedback("Enter a valid email address (for example, name@domain.com).");
      return;
    }

    setStatus("submitting");
    setFeedback("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source: "storefront_newsletter" }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        setStatus("error");
        setFeedback(data.error || "Unable to subscribe right now.");
        return;
      }
      setStatus("done");
      setFeedback(data.message || "Subscribed to Octopus Perfumes dispatches.");
      setEmail("");
      setTouched(false);
    } catch {
      setStatus("error");
      setFeedback("Network issue prevented subscribing. Please retry.");
    }
  };

  return (
    <div className="bg-[#F7F6F3] border border-[#E8E6E1] rounded-[12px] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
      <div className="lg:col-span-6 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A7953] flex items-center gap-1.5">
          <Mail size={13} /> Collector Dispatch
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#242424]">
          Batch Restocks &amp; Seasonal Releases
        </h2>
        <p className="text-sm text-[#5C5954] leading-relaxed">
          Receive alerts when rare Middle Eastern batches, niche arrivals, and member-only promotional codes like <strong>OCTOPUS5</strong> drop.
        </p>
      </div>

      <div className="lg:col-span-6">
        {status === "done" ? (
          <div className="p-4 rounded-[8px] bg-white border border-[#CBE4D7] text-sm text-[#347A54] font-medium flex items-center gap-2.5">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{feedback}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2" noValidate>
            <label htmlFor="newsletter-email" className="block text-xs font-semibold text-[#242424]">
              Email Address
            </label>
            <p className="text-[11px] text-[#777777]">
              Example: collector@domain.com · Unsubscribe anytime
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                id="newsletter-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="Enter your email address"
                className={`flex-1 fc-input px-4 py-3 text-sm ${
                  touched && status === "error" ? "user-invalid-fallback" : ""
                }`}
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-luxury-primary px-6 py-3 text-xs shrink-0 disabled:opacity-60"
              >
                <span>{status === "submitting" ? "Joining..." : "Subscribe"}</span>
                <ArrowRight size={14} />
              </button>
            </div>
            {status === "error" && feedback && (
              <p className="text-xs text-[#B83232] font-medium pt-1">{feedback}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

