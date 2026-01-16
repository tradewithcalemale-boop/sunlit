import TopBar from "@/components/TopBar";
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
import { Fade } from "react-awesome-reveal";

const Index = () => {
  return (
    <div className="min-h-screen">
      <TopBar />
      <Navbar />
      <Fade>
        <Hero />
      </Fade>
      <Fade>
        <Services />
      </Fade>
      <Fade>
        <About />
      </Fade>
      <Fade>
        <Stats />
      </Fade>
      <Fade>
        <ClientLogos />
      </Fade>
      <Fade>
        <JobOpportunities />
      </Fade>
      <Fade>
        <Resources />
      </Fade>
      <Fade>
        <CTASection />
      </Fade>
      <Fade>
        <Footer />
      </Fade>
    </div>
  );
};

export default Index;
