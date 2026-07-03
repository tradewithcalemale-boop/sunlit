import { Menu, X, LogOut, User } from "lucide-react";
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

const servicesItems = [
  { label: "Our Services", href: "/our-services", desc: "HR consulting, recruitment & more" },
  { label: "Humanitarian", href: "/humanitarian",  desc: "NGO, INGO & UN sector staffing" },
  { label: "CV Database",  href: "/cv-database",   desc: "Professional CV writing & matching" },
];

const jobsItems = [
  { label: "View Jobs",    href: "/view-jobs",  desc: "Browse current job opportunities" },
  { label: "Submit a Job", href: "/submit-job", desc: "Post an opening for your company" },
];

const DropItem = ({ label, href, desc }: { label: string; href: string; desc: string }) => (
  <li>
    <NavigationMenuLink asChild>
      <Link
        to={href}
        className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <div className="text-sm font-medium leading-none mb-1">{label}</div>
        <p className="text-xs leading-snug text-muted-foreground">{desc}</p>
      </Link>
    </NavigationMenuLink>
  </li>
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
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[380px] gap-1 p-3">
                      {servicesItems.map((item) => <DropItem key={item.href} {...item} />)}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-xs font-semibold uppercase tracking-wider text-white bg-transparent hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white data-[active]:bg-white/10">
                    Jobs
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[340px] gap-1 p-3">
                      {jobsItems.map((item) => <DropItem key={item.href} {...item} />)}
                    </ul>
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
      <SheetContent side="left" className="w-[22rem] bg-background p-0 [&>button]:hidden">
        <SheetHeader className="flex-row items-center justify-between p-4 border-b">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Sunlit Centre Kenya" className="h-9 w-auto object-contain" />
            <span className="text-base font-bold font-serif text-primary">
              Sunlit Centre Kenya
            </span>
          </a>
          <SheetClose asChild>
            <Button variant="ghost" size="icon"><X /></Button>
          </SheetClose>
        </SheetHeader>

        <div className="p-4 overflow-y-auto">
          {/* Logged-in user badge (mobile) */}
          {isAuthenticated && (
            <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2.5 mb-4">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="text-sm font-medium truncate">{user?.email}</p>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 px-2">Services</p>
          <ul className="mb-4">
            {servicesItems.map((item) => (
              <li key={item.href}>
                <SheetClose asChild>
                  <Link to={item.href} className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent">{item.label}</Link>
                </SheetClose>
              </li>
            ))}
          </ul>

          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 px-2">Jobs</p>
          <ul className="mb-4">
            {jobsItems.map((item) => (
              <li key={item.href}>
                <SheetClose asChild>
                  <Link to={item.href} className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent">{item.label}</Link>
                </SheetClose>
              </li>
            ))}
          </ul>

          <div className="border-t border-border pt-4 space-y-1">
            <SheetClose asChild>
              <Link to="/contact-us" className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent">Contact Us</Link>
            </SheetClose>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full rounded-md px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <SheetClose asChild>
                <Link to="/login-register" className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent">Login / Register</Link>
              </SheetClose>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Navbar;
