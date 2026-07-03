import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * jhammer-style feature icon: a thin orange line icon with a
 * red hand-drawn brush underline stroke beneath it (no boxed background).
 */
const BrushIcon = ({
  icon: Icon,
  align = "start",
  className,
}: {
  icon: LucideIcon;
  align?: "start" | "center";
  className?: string;
}) => (
  <div
    className={cn(
      "inline-flex flex-col",
      align === "center" ? "items-center" : "items-start",
      className,
    )}
  >
    <Icon className="w-11 h-11 text-cta" strokeWidth={1.25} aria-hidden="true" />
    <svg
      viewBox="0 0 120 14"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="mt-2 h-2.5 w-[4.5rem]"
    >
      <path
        d="M3 9 C 28 2, 74 3, 117 6"
        fill="none"
        stroke="#e5372b"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export default BrushIcon;
