import { Fragment } from "react";
import { safeLink } from "@/lib/safeUrl";

// Renders plain text written by employers (e.g. "How to Apply") with any web
// addresses and email addresses turned into clickable links. Everything is
// built as React elements, never raw HTML, and every link goes through
// safeLink, so nothing an employer types can run code on the page.

const TOKEN = /(https?:\/\/[^\s<>"]+|www\.[^\s<>"]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
const TRAILING = /[.,;:!?)\]]+$/;

function toHref(token: string): string | undefined {
  if (/^https?:\/\//i.test(token)) return safeLink(token);
  if (/^www\./i.test(token)) return safeLink(`https://${token}`);
  if (token.includes("@")) return safeLink(`mailto:${token}`);
  return undefined;
}

const LinkifiedText = ({ text, className }: { text: string; className?: string }) => {
  const parts = text.split(TOKEN);
  return (
    <p className={`whitespace-pre-wrap break-words ${className ?? ""}`}>
      {parts.map((part, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
        // Keep sentence punctuation out of the link: "see www.x.com." -> www.x.com
        const trail = part.match(TRAILING)?.[0] ?? "";
        const token = trail ? part.slice(0, -trail.length) : part;
        const href = toHref(token);
        if (!href) return <Fragment key={i}>{part}</Fragment>;
        const external = !href.startsWith("mailto:");
        return (
          <Fragment key={i}>
            <a
              href={href}
              className="text-primary underline underline-offset-2 hover:opacity-80 break-all"
              {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}
            >
              {token}
            </a>
            {trail}
          </Fragment>
        );
      })}
    </p>
  );
};

export default LinkifiedText;
