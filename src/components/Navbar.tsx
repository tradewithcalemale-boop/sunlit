import { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navItems = [
    {
      label: "Our Services",
      href: "/our-services",
    },
    {
      label: "CV Database",
      href: "/cv-database",
    },
    { label: "Contact Us", href: "/contact-us" },
    { label: "Submit Job", href: "#" },
    { label: "Login/Register", href: "/login-register" },
  ];

  return (
    <Sheet>
      <nav className="bg-background py-4 px-4 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img
              src="https://i.ibb.co/tTfFThfq/image.png"
              alt="Sunlit Centre Kenya Logo"
              className="h-12"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                Sunlit Centre Kenya
              </span>
              <span className="text-xs tracking-wider font-semibold text-gray-500">
                Dependable, Professional Partnership
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <SheetContent side="left" className="w-[20rem] bg-background p-0 [&>button]:hidden">
        <SheetHeader className="flex-row items-center justify-between p-2">
          <a href="/" className="flex items-center gap-2">
            <img
              src="https://i.ibb.co/tTfFThfq/image.png"
              alt="Sunlit Centre Kenya"
              className="h-12"
            />
             <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                Sunlit Centre Kenya
              </span>
            </div>
          </a>
          <SheetClose asChild>
            <Button variant="ghost" size="icon">
              <X />
            </Button>
          </SheetClose>
        </SheetHeader>
        <div className="p-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.label} className="mb-2">
                <SheetClose asChild>
                  <Link
                    to={item.href}
                    className="block rounded-md p-2 font-medium hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Navbar;
