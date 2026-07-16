import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact - Octopus" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-16">
      <div>
        <h1 className="font-serif-display text-4xl md:text-5xl mb-8">Get in Touch</h1>
        <ContactForm />
      </div>

      <div>
        <p className="text-[11px] tracking-[0.2em] uppercase text-muted mb-4">Our Office</p>
        <p className="text-sm leading-relaxed mb-8">
          Octopus Lifestyle Private Limited
          <br />
          1401, 14th Floor, Emaar Palm Spring Plaza,
          <br />
          Sector 54, Gurgaon, Haryana &ndash; 122011
        </p>

        <p className="text-[11px] tracking-[0.2em] uppercase text-muted mb-4">Email Us</p>
        <a href="mailto:support@octopusperfumes.in" className="text-sm underline">
          support@octopusperfumes.in
        </a>

        <p className="text-[11px] tracking-[0.2em] uppercase text-muted mb-4 mt-8">Follow Us</p>
        <a
          href="https://instagram.com/buyoctopus"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline"
        >
          @buyoctopus
        </a>
      </div>
    </div>
  );
}
