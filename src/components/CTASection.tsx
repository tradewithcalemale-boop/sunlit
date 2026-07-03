import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="cta-band py-24">
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 drop-shadow">
          Dependable, Professional Partnership
        </h2>
        <p className="text-white/90 text-lg mb-10 max-w-xl mx-auto">
          Your next career move or perfect hire is one click away.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="cta" size="xl" asChild>
            <Link to="/view-jobs">View Jobs</Link>
          </Button>
          <Button
            size="xl"
            className="rounded-full bg-primary text-white hover:bg-primary/90 border-0 font-semibold"
            asChild
          >
            <Link to="/submit-job">Submit a Job</Link>
          </Button>
        </div>
        <p className="text-sm italic text-white/90 mt-6">With a human, not a bot.</p>
      </div>
    </section>
  );
};

export default CTASection;
