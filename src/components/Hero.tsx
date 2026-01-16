import { Button } from "@/components/ui/button";
import heroLeader from "@/assets/hero-leader.jpg";

const Hero = () => {
  return (
    <section className="hero-bg relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-hero-foreground leading-tight mb-6">
              Africa's #1 Boutique Executive Search Firm
            </h1>
            <div className="mb-8">
              <p className="text-xl md:text-2xl text-hero-foreground/80">
                Ready to Hire Your Next
              </p>
              <p className="text-xl md:text-2xl">
                <span className="text-cta font-bold">Game-Changing</span>{" "}
                <span className="text-hero-foreground/80">Leader?</span>
              </p>
            </div>
            <Button variant="cta" size="xl" className="mb-3">
              Start a Conversation
            </Button>
            <p className="text-hero-foreground/60 italic text-sm">
              With a human, not a bot.
            </p>
          </div>

          {/* Right Content - Image with Circle */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Decorative Circle */}
            <div className="absolute -right-20 -top-10 w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] rounded-full circle-outline opacity-40" />
            
            {/* Image Circle */}
            <div className="relative w-80 h-80 lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden border-4 border-cyan-accent/60 shadow-2xl">
              <img
                src={heroLeader}
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
