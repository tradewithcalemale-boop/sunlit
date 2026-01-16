import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6">
          Never Ordinary.
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          For the last 24 years, we've been helping Africa's most{" "}
          <span className="font-bold text-foreground">PROGRESSIVE</span>{" "}
          organisations appoint GREAT leaders – and our headhunters are{" "}
          <span className="font-bold text-foreground">FANATICAL</span> about their work.
        </p>
        <Button variant="outline" size="lg">
          Learn more about us
        </Button>
      </div>
    </section>
  );
};

export default About;
