import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 hero-bg">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-hero-foreground mb-8">
          Ready to Hire Your Next
          <br />
          Game-Changing Leader?
        </h2>
        <Button variant="cta" size="xl" className="mb-3">
          Start a conversation
        </Button>
        <p className="text-hero-foreground/60 italic text-sm">
          With a human, not a bot.
        </p>
      </div>
    </section>
  );
};

export default CTASection;
