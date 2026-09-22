import { Fragment, ReactNode } from "react";
import { toHref } from "@/lib/safeUrl";

// Renders plain text written by employers (e.g. "How to Apply") with links
// made clickable. Two kinds of link are recognised:
//   - named links written as [text](address), which the "Insert link" button
//     produces: "[Apply on smrtr.io](https://smrtr.io/abc)" shows as
//     "Apply on smrtr.io"
//   - bare web and email addresses typed straight into the text
// Everything is built as React elements, never raw HTML, and every address
// goes through safeLink, so nothing an employer types can run code on the
// page. A named link with an unsafe address is shown as plain text.

const TOKEN =
  /\[([^\]\n]{1,200})\]\(\s*([^\s)]+)\s*\)|(https?:\/\/[^\s<>"]+|www\.[^\s<>"]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
const TRAILING = /[.,;:!?)\]]+$/;

const linkClass = "text-primary underline underline-offset-2 hover:opacity-80 break-words";

function anchor(key: string, href: string, label: string) {
  const external = !href.startsWith("mailto:");
  return (
    <a
      key={key}
      href={href}
      className={linkClass}
      {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}
    >
      {label}
    </a>
  );
}

const LinkifiedText = ({ text, className }: { text: string; className?: string }) => {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;

  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) out.push(<Fragment key={`t${last}`}>{text.slice(last, m.index)}</Fragment>);

    if (m[1] !== undefined) {
      // [label](address)
      const href = toHref(m[2]);
      out.push(href ? anchor(`n${m.index}`, href, m[1]) : <Fragment key={`n${m.index}`}>{m[0]}</Fragment>);
    } else {
      // Bare address. Keep sentence punctuation out of the link:
      // "see www.x.com." -> www.x.com
      const raw = m[3];
      const trail = raw.match(TRAILING)?.[0] ?? "";
      const token = trail ? raw.slice(0, -trail.length) : raw;
      const href = toHref(token);
      out.push(
        href ? (
          <Fragment key={`b${m.index}`}>
            {anchor(`a${m.index}`, href, token)}
            {trail}
          </Fragment>
        ) : (
          <Fragment key={`b${m.index}`}>{raw}</Fragment>
        )
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={`t${last}`}>{text.slice(last)}</Fragment>);

  return <p className={`whitespace-pre-wrap break-words ${className ?? ""}`}>{out}</p>;
};

export default LinkifiedText;
