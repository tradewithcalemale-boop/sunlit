import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div className="col-span-1">
            <div className="mb-4">
              <span className="text-xl font-bold font-serif">
                Sunlit Centre Kenya
              </span>
              <p className="text-sm font-semibold text-cta tracking-wide mt-1">
                Dependable, Professional Partnership
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-cta uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link to="/our-services" className="hover:text-cta transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/humanitarian" className="hover:text-cta transition-colors">
                  Humanitarian
                </Link>
              </li>
              <li>
                <Link to="/cv-database" className="hover:text-cta transition-colors">
                  CV Database
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-cta transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/submit-job" className="hover:text-cta transition-colors">
                  Submit Job
                </Link>
              </li>
              <li>
                <Link to="/view-jobs" className="hover:text-cta transition-colors">
                  View Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-cta uppercase tracking-wider text-sm">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link to="/our-services" className="hover:text-cta transition-colors">
                  Human Resource Consulting
                </Link>
              </li>
              <li>
                <Link to="/our-services" className="hover:text-cta transition-colors">
                  Employee Recruitment & Retention
                </Link>
              </li>
              <li>
                <Link to="/our-services" className="hover:text-cta transition-colors">
                  Outsourced HR Services
                </Link>
              </li>
              <li>
                <Link to="/our-services" className="hover:text-cta transition-colors">
                  Head Hunting / Executive Search
                </Link>
              </li>
              <li>
                <Link to="/our-services" className="hover:text-cta transition-colors">
                  Training &amp; Development
                </Link>
              </li>
              <li>
                <Link to="/our-services" className="hover:text-cta transition-colors">
                  Psychometric Assessments
                </Link>
              </li>
              <li>
                <Link to="/our-services" className="hover:text-cta transition-colors">
                  Content Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-cta uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Blue Violets Plaza, 2nd Floor, Kamburu Drive, Off Ngong Road,
                  Kilimani.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+(254) 0737 687 881</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href="mailto:info@sunlitcentrekenya.co.ke"
                  className="hover:text-cta transition-colors"
                >
                  info@sunlitcentrekenya.co.ke
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex flex-wrap gap-4 mt-6">
              <a
                href="https://www.facebook.com/sharer.php?u=https%3A%2F%2Fwww.sunlitcentrekenya.co.ke&t=Sunlit%20Centre%20Kenya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cta transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/intent/post?text=Sunlit%20Centre%20Kenya&url=https%3A%2F%2Fwww.sunlitcentrekenya.co.ke"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cta transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2FshareArticle%3Fmini%3Dtrue%26url%3Dhttps%253A%252F%252Fwww.sunlitcentrekenya.co.ke%26title%3DSunlit%2520Centre%2520Kenya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cta transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/50">
          <p>© 2025 Sunlit Centre Kenya. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="hover:text-primary-foreground transition-colors">
              Privacy Policy
            </a>
            <span>|</span>
            <a href="#" className="hover:text-primary-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
