// URLs that come from the database (job apply links, company logos, ad links)
// can be written by the public. React does not block `javascript:` hrefs, so
// an unchecked value would run attacker code in the visitor's browser —
// including an admin's, whose session lives in localStorage.
//
// Only allow the schemes we actually use; anything else becomes undefined,
// which renders no link at all.

const LINK_SCHEMES = ["http:", "https:", "mailto:"];
const IMAGE_SCHEMES = ["http:", "https:"];

function check(url: string | null | undefined, schemes: string[]): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  try {
    const parsed = new URL(trimmed);
    return schemes.includes(parsed.protocol) ? parsed.href : undefined;
  } catch {
    return undefined;
  }
}

export const safeLink = (url: string | null | undefined) => check(url, LINK_SCHEMES);
export const safeImage = (url: string | null | undefined) => check(url, IMAGE_SCHEMES);
