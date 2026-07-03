import { Mail } from "lucide-react";

const TopBar = () => {
  return (
    <div className="gradient-rainbow-bar py-2 px-4 relative z-[60] hidden lg:block">
      <div className="container mx-auto flex items-center justify-end">
        <a
          href="mailto:info@sunlitcentrekenya.co.ke"
          className="flex items-center gap-2 text-sm font-medium text-white hover:opacity-80 transition-opacity"
        >
          <Mail className="h-4 w-4" />
          <span>info@sunlitcentrekenya.co.ke</span>
        </a>
      </div>
    </div>
  );
};

export default TopBar;
