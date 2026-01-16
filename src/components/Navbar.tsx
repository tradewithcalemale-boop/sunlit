import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "WHO WE ARE", href: "#about" },
    { label: "WHAT WE DO", href: "#services", hasDropdown: true },
    { label: "RESOURCES", href: "#resources" },
    { label: "OUR CLIENTS", href: "#clients", hasDropdown: true },
    { label: "PODCAST", href: "#podcast" },
  ];

  return (
    <nav className="bg-background py-4 px-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex flex-col">
          <span className="text-2xl font-bold font-serif text-primary">Jack Hammer</span>
          <span className="text-xs tracking-wider">
            FINDING <span className="text-cta font-semibold">GREAT</span> LEADERS
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {item.label}
              {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
            </a>
          ))}
          <Button variant="cta" size="lg">
            HIRE LEADERS
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t">
          <div className="flex flex-col gap-4 pt-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors px-4"
              >
                {item.label}
              </a>
            ))}
            <div className="px-4">
              <Button variant="cta" className="w-full">
                HIRE LEADERS
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
