import { Mail, Phone, MapPin, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

/* Brand icons not available in lucide — inline simple-icons paths */
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 005.71 1.454h.005c6.585 0 11.946-5.359 11.949-11.893a11.821 11.821 0 00-3.48-8.464z" />
  </svg>
);

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
                  What We Do
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
                href="https://x.com/intent/post?text=Sunlit%20Centre%20Kenya&url=https%3A%2F%2Fwww.sunlitcentrekenya.co.ke"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="hover:text-cta transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2FshareArticle%3Fmini%3Dtrue%26url%3Dhttps%253A%252F%252Fwww.sunlitcentrekenya.co.ke%26title%3DSunlit%2520Centre%2520Kenya"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-cta transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              {/* Dummy links — replace with real destinations later */}
              <a
                href="https://t.me/sunlitcentrekenya"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram Channel"
                className="hover:text-cta transition-colors"
              >
                <TelegramIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@sunlitcentrekenya"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="hover:text-cta transition-colors"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/254737687881"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="hover:text-cta transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" />
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
