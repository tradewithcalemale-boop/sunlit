import { Button } from "@/components/ui/button";
import heroLeader from "@/assets/hero-leader.jpg";

const Hero = ({ title, imageSrc }: { title?: string, imageSrc?: string }) => {
  return (
    <section className="hero-bg relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-hero-foreground leading-tight mb-6">
              {title || "Your trusted partner in HR, organizational excellence, training, and ISO certification solutions."}
            </h1>
            <div className="flex flex-wrap gap-4">
              <Button variant="cta" size="xl">
                Submit a Job
              </Button>
              <Button variant="outline" size="xl">
                View Jobs
              </Button>
            </div>
          </div>

          {/* Right Content - Image with Circle */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Decorative Circle */}
            <div className="absolute -right-20 -top-10 w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] rounded-full circle-outline opacity-40" />
            
            {/* Image Circle */}
            <div className="relative w-80 h-80 lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden border-4 border-cyan-accent/60 shadow-2xl">
              <img
                src={imageSrc || heroLeader}
                alt="Executive Leader"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Gray Triangle */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-transparent via-gray-300/20 to-gray-400/30 -skew-x-12 translate-x-20 hidden lg:block" />
    </section>
  );
};

export default Hero;
