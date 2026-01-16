import { Mail, Phone, Search } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const TopBar = () => {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="gradient-rainbow-bar py-2 px-4 relative z-[60]">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-4 sm:justify-end sm:gap-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="mailto:info@sunlitcentrekenya.co.ke"
                className="flex items-center gap-2 text-sm text-primary-foreground hover:opacity-80 transition-opacity"
              >
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">
                  info@sunlitcentrekenya.co.ke
                </span>
              </a>
            </TooltipTrigger>
            <TooltipContent className="sm:hidden">
              info@sunlitcentrekenya.co.ke
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="tel:+(254) 0737 687 881"
                className="flex items-center gap-2 text-sm text-primary-foreground hover:opacity-80 transition-opacity"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">+(254) 0737 687 881</span>
              </a>
            </TooltipTrigger>
            <TooltipContent className="sm:hidden">
              +(254) 0737 687 881
            </TooltipContent>
          </Tooltip>

          <button className="text-primary-foreground hover:opacity-80 transition-opacity">
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TopBar;
