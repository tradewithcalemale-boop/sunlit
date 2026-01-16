import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div className="col-span-1">
            <div className="mb-4">
              <span className="text-2xl font-bold font-serif">Jack Hammer</span>
              <p className="text-xs tracking-wider mt-1">
                FINDING <span className="text-cta">GREAT</span> LEADERS
              </p>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Africa's #1 Boutique Executive Search Firm, helping progressive organisations appoint great leaders for over 24 years.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-cta transition-colors">Who We Are</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">What We Do</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Our Clients</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Resources</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Podcast</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-cta transition-colors">Executive Search</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Talent Mapping</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Board Appointments</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Leadership Coaching</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@jhammerglobal.com" className="hover:text-cta transition-colors">
                  info@jhammerglobal.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+27 11 XXX XXXX</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Johannesburg, South Africa</span>
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-cta transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-cta transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-cta transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/50">
          <p>© 2025 Jack Hammer Global. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
