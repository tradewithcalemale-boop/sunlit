
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Slide } from "react-awesome-reveal";
import {
  Users, Briefcase, Building2, Search, GraduationCap, BarChart2, Megaphone, ArrowRight, CheckCircle,
} from "lucide-react";

const services = [
  {
    id: "human-resource-consulting",
    icon: Users,
    title: "Human Resource Consulting",
    tagline: "Tailored HR strategies that reduce costs and sharpen your competitive edge.",
    description:
      "We always purpose to understand the needs of our clients and effectively collaborate with them to tailor HR services that meet their unique needs. This ultimately increases the competitiveness of the company within the industry since they can address gaps, act on weak areas, and leverage their strengths.",
    subServices: [
      "Job Analysis and Evaluation",
      "Staff Training and Development",
      "Performance Management Review",
      "HR Policies and Procedures Development",
      "Market / Salary Surveys",
      "Employee Satisfaction Surveys",
      "Human Resource Audit",
      "Human Resource Information System",
      "Organizational Development / Restructuring",
    ],
  },
  {
    id: "employee-recruitment",
    icon: Briefcase,
    title: "Employee Recruitment, Selection & Retention",
    tagline: "Find and keep the best talent through a thorough, integrity-driven process.",
    description:
      "We measure our success in terms of our clients' return on investment in talent attraction and retention. A successful selection produces candidates of high quality through thoroughness and integrity our clients can testify to. Without the right people, strategies are just papers on shelves. No job is too big or small — we handle everything from a single appointment to major recruitment drives.",
    subServices: [],
  },
  {
    id: "outsourced-hr-services",
    icon: Building2,
    title: "Outsourced HR Services",
    tagline: "Full HR management so your team can focus on your core business.",
    description:
      "We offer employee outsourcing to local and international companies, taking on all HR responsibilities while the client focuses on core functions. We handle recruitment, induction, employment contracts, payroll processing, statutory payments, payslips, and day-to-day employee engagement.",
    subServices: [
      "Payroll Administration",
      "Ad-hoc Support (Market Research & Surveys)",
      "HR Helplines & Advice",
      "Benefits Administration",
      "HR Systems & Materials",
      "Personnel Administration",
    ],
  },
  {
    id: "head-hunting",
    icon: Search,
    title: "Head Hunting / Executive Search",
    tagline: "Attract and retain exceptional leadership talent for a decisive competitive advantage.",
    description:
      "People are the only treasure businesses truly ride on. Businesses that recognise their human resources as valuable assets have a comprehensive competitive advantage. Top talent cannot be sourced through adverts — we step in to deliver the most committed and competent leaders, helping you find, attract, motivate, and retain the best people in the market.",
    subServices: [],
  },
  {
    id: "training-development",
    icon: GraduationCap,
    title: "Training & Development",
    tagline: "Need-based training programmes that translate directly into performance gains.",
    description:
      "We recognise that to optimise human capital, need-based training is vital. Our team helps design competency frameworks, training plans, needs analysis, and training department setups. We collaborate with clients to understand their strategic focus and design programmes for desired outcomes — including OSH compliance training.",
    subServices: [
      "Team Work & Team Building",
      "Leadership Training",
      "Emotional Intelligence",
      "Strategic Management in the Public Sector",
      "Successful Female Leader",
      "Advanced Presentation Skills",
      "Sales Training",
      "Finance Training",
    ],
  },
  {
    id: "psychometric-assessments",
    icon: BarChart2,
    title: "Psychometric Assessments",
    tagline: "Objective evidence of ability, potential, and culture fit beyond the interview.",
    description:
      "Psychometric tests greatly enhance the recruitment process by providing evidence of ability or potential that may not surface in a normal interview. They help identify culture match — vital for new-employee adoption and future performance. We provide this service at an affordable rate, delivering a comprehensive report on cognitive abilities, behavioural traits, and interests.",
    subServices: [],
  },
  {
    id: "content-marketing",
    icon: Megaphone,
    title: "Content Marketing",
    tagline: "AI-powered content solutions that guide the right people to your brand.",
    description:
      "Make your connection more meaningful with Sunlit Centre Kenya's content marketing solutions. Powered by AI and machine learning, it automatically puts the right messages in front of the right people — guiding them through the recruiting funnel towards conversion quickly, seamlessly, and efficiently. We offer modern solutions for targeted marketing with flexible day-part scheduling.",
    subServices: [],
  },
];

const OurServices = () => {
  const [selected, setSelected] = useState<typeof services[0] | null>(null);

  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <Hero title="What We Offer" imageSrc="https://i.ibb.co/RTYskxLv/image.png" />

      {/* Intro */}
      <section className="py-16 container mx-auto px-4 text-center max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 bg-gradient-to-r from-primary via-primary to-teal-light bg-clip-text text-transparent">
          Our Services
        </h2>
        <p className="text-muted-foreground text-lg">
          We deliver tailored HR, recruitment, and organisational development solutions
          for businesses of every size across East Africa and beyond.
        </p>
      </section>

      {/* Services grid */}
      <section className="pb-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <Slide key={svc.id} direction="up" triggerOnce delay={i * 70}>
              <div
                className="bg-white border border-border rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group hover:border-primary/40 h-full flex flex-col"
                onClick={() => setSelected(svc)}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <svc.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {svc.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{svc.tagline}</p>
                <div className="mt-4 flex items-center gap-1 text-cta text-sm font-semibold">
                  Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Slide>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-serif font-bold mb-3">Ready to transform your organisation?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Talk to our HR experts and discover how we can support your goals.
          </p>
          <Button variant="cta" size="lg" asChild>
            <Link to="/contact-us">Get in Touch</Link>
          </Button>
        </div>
      </section>

      <Footer />

      {/* Service detail modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              {selected && (
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <selected.icon className="w-5 h-5 text-primary" />
                </div>
              )}
              <DialogTitle className="text-xl font-serif">{selected?.title}</DialogTitle>
            </div>
          </DialogHeader>
          {selected && (
            <div className="space-y-5 text-sm">
              <p className="text-base text-foreground font-medium italic border-l-4 border-cta pl-4">
                {selected.tagline}
              </p>
              <p className="text-muted-foreground leading-relaxed">{selected.description}</p>
              {selected.subServices.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Key areas include:</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {selected.subServices.map((sub) => (
                      <div key={sub} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-2">
                <Button variant="cta" asChild onClick={() => setSelected(null)}>
                  <Link to="/contact-us">Enquire About This Service</Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OurServices;
