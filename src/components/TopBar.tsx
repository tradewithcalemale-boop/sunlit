import { Mail, Search } from "lucide-react";

const TopBar = () => {
  return (
    <div className="gradient-teal-bar py-2 px-4">
      <div className="container mx-auto flex items-center justify-end gap-6">
        <a 
          href="mailto:info@jhammerglobal.com" 
          className="flex items-center gap-2 text-sm text-primary-foreground hover:opacity-80 transition-opacity"
        >
          <Mail className="h-4 w-4" />
          <span>info@jhammerglobal.com</span>
        </a>
        <span className="text-primary-foreground/50">|</span>
        <a 
          href="#subscribe" 
          className="text-sm text-primary-foreground hover:opacity-80 transition-opacity"
        >
          SUBSCRIBE
        </a>
        <button className="text-primary-foreground hover:opacity-80 transition-opacity">
          <Search className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
