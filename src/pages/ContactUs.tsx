
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await supabase.from("contact_submissions").insert({
      name: form.name,
      email: form.email,
      message: form.message,
      status: "unread",
    });
    setLoading(false);
    if (err) {
      setError("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <Hero title="Contact Us" imageSrc="https://i.ibb.co/GQSh45dX/image.png" />

      <section className="container mx-auto px-4 py-16">
        {submitted ? (
          <div className="max-w-lg mx-auto text-center py-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-3xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Message Received!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you, <strong>{form.name}</strong>. We'll get back to you at{" "}
              <strong>{form.email}</strong> within 24–48 hours.
            </p>
            <Button
              variant="outline"
              onClick={() => { setSubmitted(false); setForm({ name: "", email: "", message: "" }); }}
            >
              Send Another Message
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Info */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
              <p className="mb-4 text-muted-foreground">
                Blue Violets Plaza, Off Kindaruma Road, Ngong Road
                <br />
                P O Box 56858-00200 Nairobi
              </p>
              <p className="mb-4">
                <strong>Email:</strong>{" "}
                <a href="mailto:info@sunlitcentrekenya.co.ke" className="text-primary hover:underline">
                  info@sunlitcentrekenya.co.ke
                </a>
              </p>
              <p>
                <strong>Office line:</strong> +254 737 687 881
              </p>
            </div>

            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <Input id="name" type="text" required value={form.name} onChange={set("name")} />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <Input id="email" type="email" required value={form.email} onChange={set("email")} />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <Textarea id="message" rows={5} required value={form.message} onChange={set("message")} />
                </div>
                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</div>
                )}
                <Button type="submit" disabled={loading}>
                  {loading ? "Sending…" : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
