import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroLeader from "@/assets/hero-leader.jpg";

const Hero = ({ title, imageSrc }: { title?: string; imageSrc?: string }) => {
  const isSubpage = Boolean(title);

  return (
    <section className="hero-bg relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-hero-foreground leading-tight mb-6">
              {title ||
                "Your trusted partner in HR, organizational excellence, training, and ISO certification solutions."}
            </h1>
            {!isSubpage && (
              <div className="flex flex-wrap gap-4">
                <Button variant="cta" size="xl" asChild>
                  <Link to="/submit-job">Submit a Job</Link>
                </Button>
                <Button
                  size="xl"
                  className="bg-white/10 text-white border-white/40 hover:bg-white/20 border backdrop-blur-sm"
                  asChild
                >
                  <Link to="/view-jobs">View Jobs</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Right Content - Framed Portrait (jhammer style) */}
          <div className="relative flex justify-center lg:justify-end pr-6 pb-6">
            <div className="jh-photo-frame relative w-80 h-96 lg:w-[420px] lg:h-[520px]">
              <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img
                  src={imageSrc || heroLeader}
                  alt="Executive Leader"
                  className="w-full h-full object-cover object-top"
                />
                {/* Subtle navy gradient at base to blend with dark hero */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-hero/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative overlay */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-transparent via-white/5 to-white/10 -skew-x-12 translate-x-20 hidden lg:block" />
    </section>
  );
};

export default Hero;
