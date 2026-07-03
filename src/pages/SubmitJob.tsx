import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Building2, MapPin, DollarSign, CheckCircle } from "lucide-react";

const SubmitJob = () => {
  const [form, setForm] = useState({
    company: "", contact_name: "", contact_email: "", contact_phone: "",
    title: "", type: "Full-time", location: "", salary_range: "",
    description: "", requirements: "", apply_url: "", category: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await supabase.from("jobs").insert({
      ...form,
      status: "pending",
    });
    setLoading(false);
    if (err) {
      setError("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-lg mx-auto">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4">Listing Submitted!</h2>
            <p className="text-muted-foreground mb-2">
              Thank you for submitting your job listing. Our team will review it and publish it within 24–48 hours.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              You'll hear from us at <strong>{form.contact_email}</strong>.
            </p>
            <Button variant="cta" onClick={() => { setSubmitted(false); setForm({ company: "", contact_name: "", contact_email: "", contact_phone: "", title: "", type: "Full-time", location: "", salary_range: "", description: "", requirements: "", apply_url: "", category: "" }); }}>
              Submit Another Job
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero title="Submit a Job" />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-serif font-bold mb-3">Post Your Job Opening</h2>
            <p className="text-muted-foreground">
              Reach thousands of qualified professionals. Your listing will be reviewed and published within 48 hours.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name <span className="text-destructive">*</span></label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="e.g. ABC Corporation" required value={form.company} onChange={set("company")} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Person <span className="text-destructive">*</span></label>
                <Input placeholder="Full name" required value={form.contact_name} onChange={set("contact_name")} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Email Address <span className="text-destructive">*</span></label>
                <Input type="email" placeholder="hr@company.com" required value={form.contact_email} onChange={set("contact_email")} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number <span className="text-destructive">*</span></label>
                <Input type="tel" placeholder="+254 700 000 000" required value={form.contact_phone} onChange={set("contact_phone")} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Job Title <span className="text-destructive">*</span></label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="e.g. Senior Software Engineer" required value={form.title} onChange={set("title")} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Employment Type <span className="text-destructive">*</span></label>
                <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" required value={form.type} onChange={set("type")}>
                  {["Full-time","Part-time","Contract","Internship","Remote"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category <span className="text-destructive">*</span></label>
                <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" required value={form.category} onChange={set("category")}>
                  <option value="">Select category</option>
                  {["Human Resources","Humanitarian","Finance","Marketing","Technology","Administration","Healthcare","Education","Legal","Other"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Location <span className="text-destructive">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="e.g. Nairobi, Kenya" required value={form.location} onChange={set("location")} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salary Range</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="e.g. KES 80,000 – 120,000/mo" value={form.salary_range} onChange={set("salary_range")} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Application / Company URL</label>
              <Input placeholder="https://yourcompany.com/careers (where candidates apply)" value={form.apply_url} onChange={set("apply_url")} />
              <p className="text-xs text-muted-foreground mt-1">Candidates will be redirected here to apply. Can be a website, LinkedIn post, or email link.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Job Description <span className="text-destructive">*</span></label>
              <Textarea placeholder="Describe the role, responsibilities, and day-to-day tasks…" rows={5} required value={form.description} onChange={set("description")} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Requirements &amp; Qualifications <span className="text-destructive">*</span></label>
              <Textarea placeholder="List educational qualifications, experience, and skills required…" rows={4} required value={form.requirements} onChange={set("requirements")} />
            </div>

            <Button type="submit" variant="cta" size="lg" className="w-full" disabled={loading}>
              {loading ? "Submitting…" : "Submit Job Listing"}
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SubmitJob;
