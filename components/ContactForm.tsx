"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      await addDoc(collection(db, "contact_messages"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-ink/5 border border-ink/10 p-6 text-center">
        <h3 className="font-serif-display text-2xl mb-2">Thank You</h3>
        <p className="text-sm text-ink/70">
          Your message has been received. We will get back to you shortly.
        </p>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-6 text-xs tracking-[0.2em] uppercase text-ink underline hover:opacity-70 transition-opacity"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="Name*"
        required
        disabled={status === "loading"}
        className="border-b border-ink/20 pb-2 bg-transparent outline-none text-sm placeholder:text-ink/40 disabled:opacity-50"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="Email*"
        required
        disabled={status === "loading"}
        className="border-b border-ink/20 pb-2 bg-transparent outline-none text-sm placeholder:text-ink/40 disabled:opacity-50"
      />
      <input
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        placeholder="Phone"
        disabled={status === "loading"}
        className="border-b border-ink/20 pb-2 bg-transparent outline-none text-sm placeholder:text-ink/40 disabled:opacity-50"
      />
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        placeholder="Message"
        rows={4}
        disabled={status === "loading"}
        className="border-b border-ink/20 pb-2 bg-transparent outline-none text-sm placeholder:text-ink/40 resize-none disabled:opacity-50"
      />
      <label className="flex items-center gap-2 text-xs text-muted">
        <input type="checkbox" required disabled={status === "loading"} />
        I have read and agreed to the Terms and Conditions.
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2 bg-ink text-paper py-3.5 text-[11px] tracking-[0.25em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
      {status === "error" && (
        <p className="text-xs text-rose-500 mt-2">Failed to send message. Please try again.</p>
      )}
    </form>
  );
}
