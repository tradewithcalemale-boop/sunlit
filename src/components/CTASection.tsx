import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="cta-parallax py-24">
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-4 drop-shadow-lg">
          Dependable, Professional Partnership
        </h2>
        <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
          Your next career move or perfect hire is one click away.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="cta" size="xl" asChild>
            <Link to="/view-jobs">View Jobs</Link>
          </Button>
          <Button
            size="xl"
            className="bg-white text-primary hover:bg-white/90 border-0"
            asChild
          >
            <Link to="/submit-job">Submit a Job</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
