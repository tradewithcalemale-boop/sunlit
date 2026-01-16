import { Button } from "@/components/ui/button";
import { Fade } from "react-awesome-reveal";

const JobOpportunities = () => {
  return (
    <section className="py-20 bg-secondary">
      <Fade>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-6">
            Your Next Career Starts Here
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover a world of opportunities with over 20 new jobs posted every
            day. We are the bridge between your ambitions and the region's leading
            companies. Whether you are a seasoned professional or just starting,
            your next career move is just a click away. Explore our diverse
            listings and find a role that not only matches your skills but also
            fuels your passion.
          </p>
          <Button size="lg" variant="outline">
            View Jobs
          </Button>
        </div>
      </Fade>
    </section>
  );
};

export default JobOpportunities;
