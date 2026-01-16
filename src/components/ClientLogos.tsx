import { Button } from "@/components/ui/button";

const logos = [
  { name: "Safaricom", src: "/assets/logos/safaricom.png" },
  { name: "KCB Bank", src: "/assets/logos/kcb.png" },
  { name: "Equity Bank", src: "/assets/logos/equity.png" },
  { name: "Co-op Bank", src: "/assets/logos/coop-bank.png" },
  { name: "E.A Breweries", src: "/assets/logos/ea-breweries.png" },
  { name: "Kenya Airways", src: "/assets/logos/kenya-airways.png" },
  { name: "Nation Media", src: "/assets/logos/nation-media.png" },
  { name: "Standard Group", src: "/assets/logos/standard-group.png" },
  { name: "Britam", src: "/assets/logos/britam.png" },
  { name: "Jubilee Ins.", src: "/assets/logos/jubilee.png" },
];

const LogoItem = ({ name, src }: { name: string; src: string }) => (
  <div className="flex-shrink-0 w-48 h-24 flex items-center justify-center mx-8 opacity-80 hover:opacity-100 transition-opacity">
    <img src={src} alt={name} className="max-w-full max-h-full object-contain" />
  </div>
);

const ClientLogos = () => {
  return (
    <section className="py-16 bg-secondary overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-serif text-center text-foreground">
          Trusted By Kenya's Most Progressive Companies
        </h2>
      </div>

      {/* Scrolling rows */}
      <div className="relative mb-6">
        <div className="flex animate-scroll">
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <LogoItem key={`row1-${index}`} {...logo} />
          ))}
        </div>
      </div>
      <div className="relative mb-6">
        <div className="flex animate-scroll-reverse">
          {[...logos.slice().reverse(), ...logos.slice().reverse(), ...logos.slice().reverse()].map((logo, index) => (
            <LogoItem key={`row2-${index}`} {...logo} />
          ))}
        </div>
      </div>
      <div className="relative mb-12">
        <div className="flex animate-scroll" style={{ animationDuration: '35s' }}>
          {[...logos.slice(4), ...logos, ...logos.slice(0, 4)].map((logo, index) => (
            <LogoItem key={`row3-${index}`} {...logo} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
