import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Link2, X } from "lucide-react";
import { toHref } from "@/lib/safeUrl";

// A textarea with an "Insert link" button. The link is stored in the text as
// [words to show](address), which LinkifiedText renders as a clickable link
// showing only the words. Selecting text first uses it as the link's words.

type Props = {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  maxLength?: number;
  placeholder?: string;
};

const LinkTextarea = ({ value, onChange, rows = 4, maxLength, placeholder }: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [range, setRange] = useState<[number, number]>([0, 0]);

  const openDialog = () => {
    const el = ref.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    setRange([start, end]);
    setLabel(value.slice(start, end).trim());
    setAddress("");
    setError("");
    setOpen(true);
  };

  const insert = () => {
    const words = label.trim().replace(/[[\]]/g, "");
    let addr = address.trim();
    if (addr && !/^(https?:\/\/|mailto:)/i.test(addr)) {
      addr = /^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(addr) ? `mailto:${addr}` : `https://${addr}`;
    }
    if (!words) return setError("Type the words people will click.");
    if (!addr || !toHref(addr)) return setError("Enter a valid web address (https://…) or email address.");

    const md = `[${words}](${addr})`;
    const [start, end] = range;
    const next = value.slice(0, start) + md + value.slice(end);
    if (maxLength && next.length > maxLength) return setError("That would make the text too long.");

    onChange(next);
    setOpen(false);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(start + md.length, start + md.length);
    });
  };

  return (
    <div>
      <div className="flex justify-end mb-1">
        <button
          type="button"
          onClick={openDialog}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          <Link2 className="w-3.5 h-3.5" /> Insert link
        </button>
      </div>

      {open && (
        <div className="mb-2 rounded-lg border border-border bg-secondary/40 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">Insert a link</p>
            <button type="button" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <Input
            placeholder="Words to show, e.g. Apply on smrtr.io"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={200}
          />
          <Input
            placeholder="Web address, e.g. https://smrtr.io/abc123"
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
            <Link2 className="w-3.5 h-3.5" /> Insert
          </button>
        </div>
      )}

      <Textarea
        ref={ref}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default LinkTextarea;
