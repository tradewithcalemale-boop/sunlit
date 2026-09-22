import { toHref } from "@/lib/safeUrl";

// Copied web content -> plain text, with <a href> kept as [words](address).
// Unsafe or relative addresses fall back to just the words.
export function htmlToLinkedText(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const BLOCK = /^(P|DIV|LI|H[1-6]|TR|UL|OL|TABLE|SECTION|ARTICLE|BLOCKQUOTE)$/;
  let out = "";
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      out += (node.textContent || "").replace(/\s+/g, " ");
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    if (el.tagName === "SCRIPT" || el.tagName === "STYLE") return;
    if (el.tagName === "BR") { out += "\n"; return; }
    const block = BLOCK.test(el.tagName);
    if (block && out && !out.endsWith("\n")) out += "\n";
    if (el.tagName === "A") {
      const href = toHref((el.getAttribute("href") || "").trim());
      const words = (el.textContent || "").replace(/\s+/g, " ").trim().replace(/[[\]]/g, "");
      if (href && words) {
        out += words === href || toHref(words) === href ? href : `[${words}](${href})`;
        return;
      }
    }
    if (el.tagName === "LI") out += "• ";
    el.childNodes.forEach(walk);
    if (block && !out.endsWith("\n")) out += "\n";
  };
  walk(doc.body);
  return out.replace(/[ \t]+\n/g, "\n").replace(/\n[ \t]+/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
