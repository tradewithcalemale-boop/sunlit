import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase, SiteContent } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, RotateCcw } from "lucide-react";

type Page = "home" | "global" | "humanitarian" | "services";

const AdminContent = () => {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [original, setOriginal] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [page, setPage] = useState<Page>("home");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("site_content").select("*").order("page").order("key");
    setContent(data || []);
    setOriginal(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = (key: string, value: string) => {
    setContent((prev) => prev.map((c) => (c.key === key ? { ...c, value } : c)));
  };

  const saveAll = async () => {
    setSaving(true);
    const changed = content.filter((c, i) => c.value !== original[i]?.value);
    await Promise.all(
      changed.map((c) =>
        supabase.from("site_content").upsert({ ...c, updated_at: new Date().toISOString() })
      )
    );
    setOriginal([...content]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const reset = () => setContent([...original]);

  const pages: { key: Page; label: string }[] = [
    { key: "home",        label: "Homepage" },
    { key: "global",      label: "Global / Footer" },
    { key: "humanitarian", label: "Humanitarian" },
    { key: "services",    label: "Services" },
  ];

  const filtered = content.filter((c) => c.page === page);
  const hasChanges = JSON.stringify(content) !== JSON.stringify(original);

  return (
    <AdminLayout title="Site Content">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex gap-2 flex-wrap">
          {pages.map((p) => (
            <button
              key={p.key}
              onClick={() => setPage(p.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                page === p.key ? "bg-primary text-white" : "bg-white border border-border text-muted-foreground hover:border-primary"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={reset} className="flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>
          )}
          <Button
            onClick={saveAll}
            disabled={saving || !hasChanges}
            className={`flex items-center gap-1 ${saved ? "bg-green-600 hover:bg-green-600" : "bg-primary hover:bg-primary/90"} text-white`}
          >
            <Save className="w-3.5 h-3.5" />
            {saved ? "Saved!" : saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white rounded-xl border border-border animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <p className="text-muted-foreground">No editable content for this page yet.</p>
          <p className="text-xs text-muted-foreground mt-2">Add entries in the database with page = "{page}"</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div key={item.key} className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-foreground">{item.label}</label>
                <span className="text-xs text-muted-foreground font-mono bg-gray-100 px-2 py-0.5 rounded">{item.key}</span>
              </div>
              {item.content_type === "text" && item.value.length > 100 ? (
                <Textarea
                  rows={4}
                  value={item.value}
                  onChange={(e) => update(item.key, e.target.value)}
                />
              ) : (
                <Input
                  value={item.value}
                  onChange={(e) => update(item.key, e.target.value)}
                />
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {new Date(item.updated_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {hasChanges && (
        <div className="fixed bottom-6 right-6 shadow-lg">
          <Button onClick={saveAll} disabled={saving} className="bg-primary text-white hover:bg-primary/90 shadow-lg">
            <Save className="w-4 h-4 mr-1" /> {saving ? "Saving…" : "Save All Changes"}
          </Button>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminContent;
