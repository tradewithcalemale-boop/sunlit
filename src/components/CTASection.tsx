import { Button } from "@/components/ui/button";
import { Fade } from "react-awesome-reveal";

const CTASection = () => {
  return (
    <section className="py-20 hero-bg">
      <Fade>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-hero-foreground mb-8">
            Dependable, Professional Partnership
          </h2>
          <Button variant="cta" size="xl">
            View Jobs
          </Button>
        </div>
      </Fade>
    </section>
  );
};

export default CTASection;
