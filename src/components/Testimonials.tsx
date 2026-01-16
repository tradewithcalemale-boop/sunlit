import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "The executive search process is designed to get to the end result that everyone wants. But unfortunately, most search firms don't REALLY deliver the process that they promise. So honestly, it was so refreshing to see it happen with JH. It's both science and magic. The process is the process – and then comes the magic because you need to be convincing, you need to get them excited about the company – you need to motivate that person.",
    author: "Gill Hardy",
    title: "Head of Executive Talent EMEA: WPP",
  },
  {
    quote: "Jack Hammer allows me and my leaders to understand that their job is not to fill a role. Their job is to inform whether we should be filling a role or not in the first place. And that's a different ball game altogether.",
    author: "Linda Strydom",
    title: "Executive Talent Acquisition Partner: Prosus",
  },
  {
    quote: "It has been a great privilege for me to finally have the chance to work with you – and to see the consistency and professionalism you bring from both a board and hiring manager perspective. Congratulations on all you continue to do to grow Jack Hammer and have impact on the world!",
    author: "Chris Bradford",
    title: "co-Founder and CEO: African Leadership Academy",
  },
  {
    quote: "First and most important I think we found an ideal candidate. The process agreed for the search was implemented to plan. All in all a very positive experience; I would recommend your firm and I would rate your service highly.",
    author: "Steve Ross",
    title: "Board Director: Christel House International",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-center text-foreground mb-16">
          What Our Clients Say
        </h2>

        <div className="max-w-4xl mx-auto relative">
          <Quote className="absolute -top-6 -left-4 w-12 h-12 text-teal-dark/20" />
          
          <div className="bg-secondary rounded-2xl p-8 md:p-12 min-h-[300px] flex flex-col justify-center">
            <p className="text-lg md:text-xl text-foreground/80 italic leading-relaxed mb-8">
              "{current.quote}"
            </p>
            <div>
              <p className="font-bold text-foreground">– {current.author}</p>
              <p className="text-muted-foreground text-sm">{current.title}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-teal-dark" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
