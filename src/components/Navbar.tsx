import { Menu, X, LogOut, User, Mail, Phone, ChevronRight } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTrigger, SheetClose,
} from "./ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import TopBar from "./TopBar";

const servicesItems = [
  { label: "What We Do", href: "/our-services", desc: "HR consulting, recruitment & more" },
  { label: "Humanitarian", href: "/humanitarian",  desc: "NGO, INGO & UN sector staffing" },
  { label: "CV Database",  href: "/cv-database",   desc: "Professional CV writing & matching" },
];

const jobsItems = [
  { label: "View Jobs",    href: "/view-jobs",  desc: "Browse current job opportunities" },
  { label: "Submit a Job", href: "/submit-job", desc: "Post an opening for your company" },
];

const whoWeServeItems = [
  { label: "Africa",         href: "/our-services", desc: "Talent solutions across Africa" },
  { label: "Global Markets", href: "/our-services", desc: "Beyond borders, worldwide reach" },
];

const DropItem = ({ label, href, desc }: { label: string; href: string; desc: string }) => (
  <li>
    <NavigationMenuLink asChild>
      <Link
        to={href}
        className="group/item block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
      >
        <div className="text-sm font-semibold uppercase tracking-wide leading-none mb-1 text-white group-hover/item:text-cyan-accent transition-colors">{label}</div>
        <p className="text-xs leading-snug text-white/60">{desc}</p>
      </Link>
    </NavigationMenuLink>
  </li>
);

const MegaHeader = ({ children }: { children: string }) => (
  <p className="text-xs font-bold uppercase tracking-widest text-cta pb-2 mb-2 border-b border-teal-light/50">
    {children}
  </p>
);

const Navbar = () => {
  const { isAuthenticated, user, loading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const shortEmail = user?.email
    ? user.email.length > 20 ? user.email.slice(0, 18) + "…" : user.email
    : "";

  return (
    <Sheet>
      {/* Top utility bar — large screens only */}
      <TopBar />

      <nav className="bg-hero py-4 px-4 sticky top-0 z-50 shadow-md border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/logo.png" alt="Sunlit Centre Kenya Logo" className="h-10 w-auto object-contain drop-shadow-sm" />
            <div className="flex flex-col">
              <span className="text-lg font-bold font-serif text-white leading-tight">
                Sunlit Centre Kenya
              </span>
              <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-cta leading-tight">
                Dependable, Professional Partnership
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-xs font-semibold uppercase tracking-wider text-white bg-transparent hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white data-[active]:bg-white/10">
                    What We Do
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex gap-8 w-[620px] p-6">
                      <div className="flex-1">
                        <MegaHeader>By Solution</MegaHeader>
                        <ul className="grid gap-1">
                          {servicesItems.map((item) => <DropItem key={item.href} {...item} />)}
                        </ul>
                      </div>
                      <div className="flex-1">
                        <MegaHeader>Who We Serve</MegaHeader>
                        <ul className="grid gap-1">
                          {whoWeServeItems.map((item) => <DropItem key={item.label} {...item} />)}
                        </ul>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-xs font-semibold uppercase tracking-wider text-white bg-transparent hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white data-[active]:bg-white/10">
                    Jobs
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[340px] p-5">
                      <MegaHeader>Opportunities</MegaHeader>
                      <ul className="grid gap-1">
                        {jobsItems.map((item) => <DropItem key={item.href} {...item} />)}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link to="/contact-us" className="text-xs font-semibold uppercase tracking-wider text-white bg-transparent hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">
                      Contact Us
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Auth state */}
            {!loading && (
              isAuthenticated ? (
                <div className="flex items-center gap-2 ml-3">
                  <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{shortEmail}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 text-sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </Button>
                </div>
              ) : (
                <Button
                  variant="cta"
                  size="sm"
                  className="ml-3 uppercase tracking-wider text-xs px-5"
                  asChild
                >
                  <Link to="/login-register">Login / Register</Link>
                </Button>
              )
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden">
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white"><Menu /></Button>
            </SheetTrigger>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar */}
      <SheetContent
        side="left"
        className="w-[86vw] max-w-[20rem] bg-hero text-white p-0 gap-0 flex flex-col border-r border-white/10 [&>button]:hidden"
      >
        {/* Header */}
        <SheetHeader className="flex-row items-center justify-between px-5 py-4 border-b border-white/10 space-y-0">
          <a href="/" className="flex items-center gap-2 min-w-0">
            <img src="/logo.png" alt="Sunlit Centre Kenya" className="h-9 w-auto object-contain flex-shrink-0" />
            <span className="text-base font-bold font-serif text-white truncate">
              Sunlit Centre Kenya
            </span>
          </a>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white flex-shrink-0">
              <X className="w-5 h-5" />
            </Button>
          </SheetClose>
        </SheetHeader>

        {/* Scrollable nav body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-7">
          {/* Logged-in user badge */}
          {isAuthenticated && (
            <div className="flex items-center gap-3 bg-white/5 ring-1 ring-white/10 rounded-xl px-3 py-3">
              <div className="w-9 h-9 rounded-full bg-cta flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-white/50">Signed in as</p>
                <p className="text-sm font-medium truncate text-white">{user?.email}</p>
              </div>
            </div>
          )}

          {/* Services group */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-cta pb-2 mb-2 border-b border-teal-light/40">
              By Solution
            </p>
            <ul className="-mx-2">
              {servicesItems.map((item) => (
                <li key={item.href}>
                  <SheetClose asChild>
                    <Link
                      to={item.href}
                      className="group flex items-start gap-3 rounded-lg px-2 py-2.5 hover:bg-white/10 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white group-hover:text-cyan-accent transition-colors">{item.label}</p>
                        <p className="text-xs text-white/50 leading-snug truncate">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 mt-0.5 text-white/30 group-hover:text-cyan-accent flex-shrink-0" />
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </div>

          {/* Who We Serve group */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-cta pb-2 mb-2 border-b border-teal-light/40">
              Who We Serve
            </p>
            <ul className="-mx-2">
              {whoWeServeItems.map((item) => (
                <li key={item.label}>
                  <SheetClose asChild>
                    <Link
                      to={item.href}
                      className="group flex items-start gap-3 rounded-lg px-2 py-2.5 hover:bg-white/10 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white group-hover:text-cyan-accent transition-colors">{item.label}</p>
                        <p className="text-xs text-white/50 leading-snug truncate">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 mt-0.5 text-white/30 group-hover:text-cyan-accent flex-shrink-0" />
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </div>

          {/* Jobs group */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-cta pb-2 mb-2 border-b border-teal-light/40">
              Opportunities
            </p>
            <ul className="-mx-2">
              {jobsItems.map((item) => (
                <li key={item.href}>
                  <SheetClose asChild>
                    <Link
                      to={item.href}
                      className="group flex items-start gap-3 rounded-lg px-2 py-2.5 hover:bg-white/10 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white group-hover:text-cyan-accent transition-colors">{item.label}</p>
                        <p className="text-xs text-white/50 leading-snug truncate">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 mt-0.5 text-white/30 group-hover:text-cyan-accent flex-shrink-0" />
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </div>

          {/* More group */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-cta pb-2 mb-2 border-b border-teal-light/40">
              More
            </p>
            <ul className="-mx-2">
              <li>
                <SheetClose asChild>
                  <Link
                    to="/contact-us"
                    className="group flex items-center justify-between rounded-lg px-2 py-2.5 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm font-semibold text-white group-hover:text-cyan-accent transition-colors">Contact Us</span>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-cyan-accent" />
                  </Link>
                </SheetClose>
              </li>
            </ul>
          </div>
        </div>

        {/* Sticky footer: CTA + contact */}
        <div className="border-t border-white/10 px-5 py-5 space-y-4">
          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          ) : (
            <SheetClose asChild>
              <Button variant="cta" size="lg" className="w-full uppercase tracking-wider text-xs" asChild>
                <Link to="/login-register">Login / Register</Link>
              </Button>
            </SheetClose>
          )}

          <div className="space-y-2 pt-1">
            <a href="mailto:info@sunlitcentrekenya.co.ke" className="flex items-center gap-2.5 text-xs text-white/70 hover:text-cyan-accent transition-colors">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">info@sunlitcentrekenya.co.ke</span>
            </a>
            <a href="tel:+254737687881" className="flex items-center gap-2.5 text-xs text-white/70 hover:text-cyan-accent transition-colors">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <span>+(254) 0737 687 881</span>
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Navbar;
