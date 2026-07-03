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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-primary leading-[1.08] mb-6">
              {title ||
                "Your trusted partner in HR, organizational excellence, training, and ISO certification solutions."}
            </h1>
            {!isSubpage && (
              <>
                <p className="text-2xl md:text-3xl text-slate-500 font-light mb-8">
                  Ready to build a <span className="font-bold text-primary">Game-Changing</span> team?
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="cta" size="xl" asChild>
                    <Link to="/submit-job">Submit a Job</Link>
                  </Button>
                  <Button
                    size="xl"
                    className="rounded-full border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white font-semibold"
                    asChild
                  >
                    <Link to="/view-jobs">View Jobs</Link>
                  </Button>
                </div>
                <p className="text-sm italic text-slate-500 mt-4">With a human, not a bot.</p>
              </>
            )}
          </div>

          {/* Right Content - Circular Portrait with thin mint ring (jhammer style) */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="jh-photo-ring w-72 h-72 sm:w-80 sm:h-80 lg:w-[440px] lg:h-[440px]">
              <div className="w-full h-full rounded-full overflow-hidden shadow-2xl">
                <img
                  src={imageSrc || heroLeader}
                  alt="Executive Leader"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
