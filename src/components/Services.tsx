import { Slide, JackInTheBox } from "react-awesome-reveal";
import { Search, Users, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const offerings = [
  {
    icon: Search,
    title: "Executive Search",
    href: "/our-services#head-hunting",
    desc: "We deliver the most committed and competent leaders — helping you find, attract, motivate and retain the best people in the market.",
  },
  {
    icon: Users,
    title: "HR Consulting",
    href: "/our-services#human-resource-consulting",
    desc: "Tailored HR strategies that reduce costs and sharpen your competitive edge — from audits and policy to organizational development.",
  },
  {
    icon: Briefcase,
    title: "Recruitment & Retention",
    href: "/our-services#employee-recruitment",
    desc: "An integrity-driven process that produces high-quality candidates — from a single appointment to major recruitment drives.",
  },
  {
    icon: GraduationCap,
    title: "Training & Development",
    href: "/our-services#training-development",
    desc: "Need-based training programmes and competency frameworks that translate directly into measurable performance gains.",
  },
];

const Services = () => {
  return (
    <>
      {/* jhammer-style 4-card offerings grid */}
      <section className="relative bg-secondary pt-20 pb-0 overflow-hidden">
        {/* teal band behind the lower portion of the cards */}
        <div className="cta-band absolute inset-x-0 bottom-0 h-48 lg:h-56" />

        <div className="relative z-10 container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-center text-foreground mb-14 max-w-4xl mx-auto leading-tight">
            Leverage Our HR Expertise and Build Your Best Team Yet
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
            {offerings.map((item, i) => {
              const Icon = item.icon;
              return (
                <Slide direction="up" triggerOnce fraction={0.1} delay={i * 80} key={item.title}>
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center h-full flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-cta/10 flex items-center justify-center mb-5">
                      <Icon className="w-7 h-7 text-cta" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-teal-light mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-foreground/70 leading-relaxed mb-6 flex-1">
                      {item.desc}
                    </p>
                    <Button variant="cta" size="sm" className="px-6" asChild>
                      <Link to={item.href}>Learn more</Link>
                    </Button>
                  </div>
                </Slide>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision / Mission / Philosophy (our content, preserved) */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Slide direction="left" triggerOnce>
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Our Vision</h2>
                <p className="text-lg text-muted-foreground">
                  To be the preferred consulting group in the region offering out of the box business solutions.
                </p>
              </div>
            </Slide>

            <Slide direction="right" triggerOnce>
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground">
                  We are committed to providing our valued clients with suitable and tailor-made solutions based on in-depth thinking and research.
                </p>
              </div>
            </Slide>

            <JackInTheBox triggerOnce>
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Our Philosophy</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  We’re not your typical staffing and training company. Unlike other staffing and training companies, we do not pass on resumes to our clients without careful vetting to ensure a perfect fit – skills, experience, and company culture. When we add a professional to our network, we map over 20 skills and personality characteristics to ensure the best possible match for your project.
                </p>
                <p className="text-lg text-muted-foreground">
                  By maintaining relationships with experienced professionals around the region, we find the candidates who are perfect for your unique needs. Our Strength is our ability to match talent with the perfect skills and culture fit for your needs, budget, and timelines.
                </p>
              </div>
            </JackInTheBox>

            <Slide direction="up" triggerOnce>
              <div>
                <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Why Choose Sunlit Centre Kenya?</h2>
                <p className="text-lg text-muted-foreground">
                  Sunlit Centre Kenya delivers the very best HR Consulting Services, Training Courses, and Workshops on a wide range of professional subjects with special emphasis on current best practices, skills, and up-to-minute techniques.
                </p>
              </div>
            </Slide>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
