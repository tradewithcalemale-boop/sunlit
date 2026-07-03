import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Stats from "@/components/Stats";
import ClientLogos from "@/components/ClientLogos";
import JobOpportunities from "@/components/Testimonials";
import Resources from "@/components/Resources";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { Slide } from "react-awesome-reveal";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Slide direction="right" triggerOnce fraction={0.15}>
        <About />
      </Slide>
      <Stats />
      <ClientLogos />
      <JobOpportunities />
      <Resources />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
