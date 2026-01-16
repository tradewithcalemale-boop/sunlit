import { Search, Map, Users, Headphones } from "lucide-react";

const services = [
  {
    icon: Search,
    title: "Executive Search",
    description: "We uncover extraordinary leaders to give you the choice and confidence you need to make a high-impact appointment.",
  },
  {
    icon: Map,
    title: "Talent Mapping",
    description: "Get the data you need through talent mapping to make smarter, bolder talent decisions and stay ahead of the competition.",
  },
  {
    icon: Users,
    title: "Board Appointments",
    description: "Non-executive directors and board members who bring fresh perspectives and supercharge your strategy.",
  },
  {
    icon: Headphones,
    title: "Leadership Coaching",
    description: "Virtual Coaching Partners connects you with elite coaches for career and leadership growth -anytime, anywhere.",
  },
];

const Services = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-center text-foreground mb-16">
          Leverage Our Global Talent Networks
          <br />
          and Build Your Best Team Yet
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group text-center p-6 rounded-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-teal-dark/10 flex items-center justify-center group-hover:bg-teal-dark/20 transition-colors">
                <service.icon className="w-10 h-10 text-teal-dark" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-4">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {service.description}
              </p>
              <a
                href="#"
                className="text-teal-dark font-medium text-sm hover:underline"
              >
                Learn more
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
