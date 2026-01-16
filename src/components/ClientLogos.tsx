import { Button } from "@/components/ui/button";

// Using placeholder company names that represent typical enterprise clients
const logos = [
  { name: "TechCorp", initials: "TC" },
  { name: "Global Finance", initials: "GF" },
  { name: "Africa Holdings", initials: "AH" },
  { name: "United Resources", initials: "UR" },
  { name: "Premier Bank", initials: "PB" },
  { name: "Continental", initials: "CO" },
  { name: "Meridian Group", initials: "MG" },
  { name: "Sunrise Capital", initials: "SC" },
  { name: "Impact Partners", initials: "IP" },
];

const LogoItem = ({ name, initials }: { name: string; initials: string }) => (
  <div className="flex-shrink-0 w-32 h-16 flex items-center justify-center mx-8 opacity-60 hover:opacity-100 transition-opacity">
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
        <span className="text-sm font-bold text-muted-foreground">{initials}</span>
      </div>
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{name}</span>
    </div>
  </div>
);

const ClientLogos = () => {
  return (
    <section className="py-16 bg-secondary overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-serif text-center text-foreground">
          Trusted By Africa's Most Progressive Companies
        </h2>
      </div>

      {/* First row - scrolling left */}
      <div className="relative mb-6">
        <div className="flex animate-scroll">
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <LogoItem key={`row1-${index}`} {...logo} />
          ))}
        </div>
      </div>

      {/* Second row - scrolling right */}
      <div className="relative mb-6">
        <div className="flex animate-scroll-reverse">
          {[...logos.reverse(), ...logos, ...logos].map((logo, index) => (
            <LogoItem key={`row2-${index}`} {...logo} />
          ))}
        </div>
      </div>

      {/* Third row - scrolling left */}
      <div className="relative mb-12">
        <div className="flex animate-scroll" style={{ animationDuration: '35s' }}>
          {[...logos.reverse(), ...logos, ...logos].map((logo, index) => (
            <LogoItem key={`row3-${index}`} {...logo} />
          ))}
        </div>
      </div>

      <div className="text-center">
        <Button variant="outline">Read our client success stories</Button>
      </div>
    </section>
  );
};

export default ClientLogos;
