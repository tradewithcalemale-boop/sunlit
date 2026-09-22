import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Link2, X, Copy, Scissors } from "lucide-react";
import { toHref } from "@/lib/safeUrl";
import LinkifiedText from "@/components/LinkifiedText";
import { htmlToLinkedText } from "@/lib/htmlToLinkedText";

// A textarea that supports hyperlinks with custom words, stored in the text as
// [words to show](address) and rendered by LinkifiedText as a clickable link
// showing only the words. Ways to add one:
//   - select words, then right-click -> "Add hyperlink"
//   - select words, then the "Link selected text" button (or Ctrl+K)
//   - the "Insert link" button, to type both the words and the address
//   - paste from a web page: links in the copied text are kept automatically

type Props = {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  maxLength?: number;
  placeholder?: string;
};

const LINKED = /\[[^\]\n]+\]\([^\s)]+\)|https?:\/\/|www\.|@/;

const LinkTextarea = ({ value, onChange, rows = 4, maxLength, placeholder }: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [sel, setSel] = useState<[number, number]>([0, 0]);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [range, setRange] = useState<[number, number]>([0, 0]);
  const addressRef = useRef<HTMLInputElement>(null);

  const selected = value.slice(sel[0], sel[1]);
  const hasSelection = sel[1] > sel[0] && selected.trim().length > 0;

  const trackSelection = () => {
    const el = ref.current;
    if (el) setSel([el.selectionStart, el.selectionEnd]);
  };

  // Close the right-click menu on any outside click, scroll or Escape.
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const openDialog = () => {
    const el = ref.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    setRange([start, end]);
    setLabel(value.slice(start, end).trim());
    setAddress("");
    setError("");
    setMenu(null);
    setOpen(true);
    // With words already chosen, jump straight to the address box.
    requestAnimationFrame(() => (end > start ? addressRef.current?.focus() : undefined));
  };

  const replaceRange = (start: number, end: number, text: string) => {
    const next = value.slice(0, start) + text + value.slice(end);
    if (maxLength && next.length > maxLength) return false;
    onChange(next);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(start + text.length, start + text.length);
      setSel([start + text.length, start + text.length]);
    });
    return true;
  };

  const insert = () => {
    const words = label.trim().replace(/[[\]]/g, "");
    let addr = address.trim();
    if (addr && !/^(https?:\/\/|mailto:)/i.test(addr)) {
      addr = /^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(addr) ? `mailto:${addr}` : `https://${addr}`;
    }
    if (!words) return setError("Type the words people will click.");
    if (!addr || !toHref(addr)) return setError("Enter a valid web address (https://…) or email address.");
    if (!replaceRange(range[0], range[1], `[${words}](${addr})`)) return setError("That would make the text too long.");
    setOpen(false);
  };

  const onPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const html = e.clipboardData.getData("text/html");
    if (!html || !/<a\s[^>]*href/i.test(html)) return; // no links: normal paste
    const text = htmlToLinkedText(html);
    if (!text) return;
    e.preventDefault();
    const el = e.currentTarget;
    replaceRange(el.selectionStart, el.selectionEnd, text);
  };

  const onContextMenu = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    if (el.selectionEnd <= el.selectionStart) return; // nothing selected: browser menu
    e.preventDefault();
    setSel([el.selectionStart, el.selectionEnd]);
    setMenu({ x: e.clientX, y: e.clientY });
  };

  const copySelection = async (cut: boolean) => {
    const [start, end] = sel;
    try { await navigator.clipboard.writeText(value.slice(start, end)); } catch { /* clipboard blocked */ }
    if (cut) replaceRange(start, end, "");
    setMenu(null);
  };

  return (
    <div>
      <div className="flex items-center justify-end gap-3 mb-1 min-h-[1.5rem]">
        {hasSelection && !open && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // keep the selection
            onClick={openDialog}
            className="inline-flex items-center gap-1 text-xs font-semibold bg-primary text-primary-foreground px-2.5 py-1 rounded-md hover:opacity-90 max-w-[70%]"
          >
            <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Link "{selected.trim()}"</span>
          </button>
        )}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={openDialog}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          <Link2 className="w-3.5 h-3.5" /> Insert link
        </button>
      </div>

      {open && (
        <div className="mb-2 rounded-lg border border-border bg-secondary/40 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">Add a hyperlink</p>
            <button type="button" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <Input
            placeholder="Words to show, e.g. Digital Divide Data on smrtr.io"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={200}
          />
          <Input
            ref={addressRef}
            placeholder="Web address to open, e.g. https://smrtr.io/abc123"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); insert(); } }}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button
            type="button"
            onClick={insert}
            className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-md hover:opacity-90"
          >
            <Link2 className="w-3.5 h-3.5" /> Add link
          </button>
        </div>
      )}

      <Textarea
        ref={ref}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(e) => { onChange(e.target.value); trackSelection(); }}
        onSelect={trackSelection}
        onPaste={onPaste}
        onContextMenu={onContextMenu}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openDialog(); }
        }}
      />
      <p className="text-[11px] text-muted-foreground mt-1">
        Tip: select words, then right-click → <strong>Add hyperlink</strong> (or press Ctrl+K). Links in text copied from a website are kept when you paste.
      </p>

      {menu && (
        <div
          className="fixed z-[100] min-w-[170px] rounded-md border border-border bg-popover text-popover-foreground shadow-lg py-1 text-sm"
          style={{ left: Math.min(menu.x, window.innerWidth - 190), top: Math.min(menu.y, window.innerHeight - 130) }}
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" onClick={openDialog} className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-accent text-left font-medium">
            <Link2 className="w-3.5 h-3.5" /> Add hyperlink…
          </button>
          <button type="button" onClick={() => copySelection(false)} className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-accent text-left">
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
          <button type="button" onClick={() => copySelection(true)} className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-accent text-left">
            <Scissors className="w-3.5 h-3.5" /> Cut
          </button>
        </div>
      )}

      {LINKED.test(value) && (
        <div className="mt-2 rounded-md border border-dashed border-border px-3 py-2">
          <p className="text-[11px] font-medium text-muted-foreground mb-1">How candidates will see it:</p>
          <LinkifiedText text={value} className="text-sm" />
        </div>
      )}
    </div>
  );
};

export default LinkTextarea;
