// URLs that come from the database (job apply links, company logos, ad links)
// can be written by the public. React does not block `javascript:` hrefs, so
// an unchecked value would run attacker code in the visitor's browser —
// including an admin's, whose session lives in localStorage.
//
// Only allow the schemes we actually use; anything else becomes undefined,
// which renders no link at all.

const LINK_SCHEMES = ["http:", "https:", "mailto:"];
const IMAGE_SCHEMES = ["http:", "https:"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function check(url: string | null | undefined, schemes: string[]): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  try {
    const parsed = new URL(trimmed);
    if (!schemes.includes(parsed.protocol)) return undefined;
    // "mailto:" must be one real address, not a sentence someone pasted in.
    if (parsed.protocol === "mailto:" && !EMAIL.test(decodeURIComponent(parsed.pathname))) return undefined;
    return parsed.href;
  } catch {
    return undefined;
  }
}

export const safeLink = (url: string | null | undefined) => check(url, LINK_SCHEMES);
export const safeImage = (url: string | null | undefined) => check(url, IMAGE_SCHEMES);

// Turns what someone typed (full URL, www. address or bare email) into a safe
// href, or undefined if it isn't a usable link.
export function toHref(address: string): string | undefined {
  if (/^(https?:\/\/|mailto:)/i.test(address)) return safeLink(address);
  if (/^www\./i.test(address)) return safeLink(`https://${address}`);
  if (/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(address)) return safeLink(`mailto:${address}`);
  return undefined;
}
