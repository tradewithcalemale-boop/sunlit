import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Slide } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import {
  Heart,
  Globe,
  Users,
  Shield,
  Award,
  HandHeart,
} from "lucide-react";

const services = [
  {
    icon: Users,
    title: "NGO & INGO Staffing",
    description:
      "We connect non-governmental and international organisations with skilled professionals who are passionate about humanitarian work.",
  },
  {
    icon: Globe,
    title: "UN & Multilateral Agency Support",
    description:
      "Supporting United Nations agencies and multilateral organisations in sourcing experienced candidates for critical roles.",
  },
  {
    icon: Heart,
    title: "Community Development HR",
    description:
      "Building the human capital foundation for organisations driving sustainable community development across the region.",
  },
  {
    icon: Shield,
    title: "Emergency Response Staffing",
    description:
      "Rapid deployment of qualified personnel for disaster relief and emergency humanitarian operations.",
  },
  {
    icon: Award,
    title: "Capacity Building",
    description:
      "Training and development programmes tailored for humanitarian organisations to strengthen their workforce capabilities.",
  },
  {
    icon: HandHeart,
    title: "Volunteer Management",
    description:
      "Structured volunteer programmes and management systems to harness the power of passionate individuals.",
  },
];

const stats = [
  { label: "Humanitarian Organisations Supported", value: "50+" },
  { label: "Professionals Placed in NGO Roles", value: "1,200+" },
  { label: "Countries of Operation", value: "12+" },
  { label: "Years Serving the Sector", value: "10+" },
];

const Humanitarian = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero title="Humanitarian Services" imageSrc="https://i.ibb.co/GQSh45dX/image.png" />

      {/* Intro */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Empowering Organisations That Change Lives
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            At Sunlit Centre Kenya, we believe that behind every successful humanitarian mission
            is a team of dedicated, well-matched professionals. We specialise in providing HR
            solutions tailored to the unique demands of the humanitarian sector across East
            Africa and beyond.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            From NGOs and INGOs to UN agencies and social enterprises, we partner with
            organisations committed to making a difference — delivering the right talent at
            the right time.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <Slide direction="up" triggerOnce>
            <h2 className="text-3xl font-serif font-bold text-center mb-12">
              Our Humanitarian Services
            </h2>
          </Slide>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <Slide key={service.title} direction="up" triggerOnce delay={i * 80}>
                <div className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Slide>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment + Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Slide direction="left" triggerOnce>
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6">
                  Our Commitment to Humanitarian Excellence
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  The humanitarian sector operates under extraordinary pressure — time-sensitive,
                  resource-constrained, and mission-critical. Our team understands these dynamics
                  and works alongside your organisation to provide staffing solutions that are
                  both swift and rigorous.
                </p>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  We vet every candidate not just for technical competence, but for cultural
                  sensitivity, adaptability, and alignment with humanitarian principles —
                  ensuring your teams are prepared for the realities of the field.
                </p>
                <Button variant="cta" size="lg" asChild>
                  <Link to="/contact-us">Get in Touch</Link>
                </Button>
              </div>
            </Slide>

            <Slide direction="right" triggerOnce>
              <div className="bg-secondary rounded-2xl p-8">
                <div className="space-y-6">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex justify-between items-center border-b border-border pb-5 last:border-0 last:pb-0"
                    >
                      <span className="text-muted-foreground text-sm">{stat.label}</span>
                      <span className="text-2xl font-bold text-primary">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Slide>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-parallax py-20">
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white font-bold mb-4 drop-shadow">
            Partner With Us for Impact
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Let us help you build a workforce that delivers real change.
          </p>
          <Button variant="cta" size="xl" asChild>
            <Link to="/contact-us">Contact Us Today</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Humanitarian;
