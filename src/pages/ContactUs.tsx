
import { useState } from "react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReCAPTCHA from "react-google-recaptcha";

const ContactUs = () => {
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recaptchaValue) {
      // Handle form submission
      console.log("Form submitted");
    } else {
      alert("Please complete the reCAPTCHA");
    }
  };

  return (
    <div className="bg-background text-foreground">
      <TopBar />
      <Navbar />
      <Hero title="Contact Us" imageSrc="https://i.ibb.co/GQSh45dX/image.png" />
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="mb-4">
              Blue Violets Plaza, Off Kindaruma Road, Ngong Road
              <br />
              P O Box 56858-00200 Nairobi
            </p>
            <p className="mb-4">
              <strong>Email:</strong>{" "}
              <a href="mailto:info@sunlitcentrekenya.co.ke">
                info@sunlitcentrekenya.co.ke
              </a>
            </p>
            <p>
              <strong>Office line:</strong> +254 737 687 881
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <Input id="name" type="text" required />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input id="email" type="email" required />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1"
                >
                  Message
                </label>
                <Textarea id="message" required />
              </div>
              <div className="mb-4">
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZvrp5gWBcT4T2c8a-pP8c-9c9" // Replace with your actual site key
                  onChange={(value) => setRecaptchaValue(value)}
                />
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactUs;
