import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase, Advertisement } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, ExternalLink, ImageIcon, Megaphone } from "lucide-react";

const emptyAd: Partial<Advertisement> = {
  title: "", description: "", image_url: "", link_url: "",
  placement: "sidebar", is_active: true, order_index: 0,
};

const placementColors: Record<string, string> = {
  sidebar: "bg-blue-100 text-blue-700",
  banner:  "bg-purple-100 text-purple-700",
  footer:  "bg-gray-100 text-gray-600",
  inline:  "bg-orange-100 text-orange-700",
};

const AdminAds = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editAd, setEditAd] = useState<Partial<Advertisement> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("advertisements").select("*").order("order_index");
    setAds(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (id: string, val: boolean) => {
    await supabase.from("advertisements").update({ is_active: val }).eq("id", id);
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, is_active: val } : a)));
  };

  const deleteAd = async (id: string) => {
    if (!confirm("Delete this advertisement?")) return;
    await supabase.from("advertisements").delete().eq("id", id);
    setAds((prev) => prev.filter((a) => a.id !== id));
  };

  const saveAd = async () => {
    if (!editAd) return;
    setSaving(true);
    if (editAd.id) {
      const { data } = await supabase.from("advertisements").update(editAd).eq("id", editAd.id).select().single();
      if (data) setAds((prev) => prev.map((a) => (a.id === data.id ? data : a)));
    } else {
      const { data } = await supabase.from("advertisements").insert(editAd).select().single();
      if (data) setAds((prev) => [...prev, data]);
    }
    setSaving(false);
    setEditAd(null);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `ads/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setEditAd((prev) => prev ? { ...prev, image_url: data.publicUrl } : prev);
    }
    setUploading(false);
  };

  return (
    <AdminLayout title="Advertisements">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{ads.length} advertisement{ads.length !== 1 ? "s" : ""}</p>
        <Button variant="cta" onClick={() => setEditAd({ ...emptyAd })} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Advertisement
        </Button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-4 h-48 animate-pulse" />
          ))}
        </div>
      ) : ads.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <Megaphone className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No advertisements yet. Add one to get started.</p>
          <Button variant="cta" className="mt-4" onClick={() => setEditAd({ ...emptyAd })}>Add First Ad</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
              {ad.image_url ? (
                <img src={ad.image_url} alt={ad.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm text-foreground leading-tight">{ad.title}</h3>
                  <Switch checked={ad.is_active} onCheckedChange={(v) => toggleActive(ad.id, v)} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${placementColors[ad.placement]}`}>
                    {ad.placement}
                  </span>
                  {!ad.is_active && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">inactive</span>
                  )}
                </div>
                {ad.description && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{ad.description}</p>
                )}
                <div className="flex items-center gap-2">
                  <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> Visit
                  </a>
                  <button onClick={() => setEditAd(ad)} className="ml-auto p-1.5 hover:bg-gray-100 rounded text-muted-foreground hover:text-blue-600">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteAd(ad.id)} className="p-1.5 hover:bg-red-50 rounded text-muted-foreground hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add modal */}
      <Dialog open={!!editAd} onOpenChange={() => setEditAd(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editAd?.id ? "Edit Advertisement" : "New Advertisement"}</DialogTitle>
          </DialogHeader>
          {editAd && (
            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium mb-1">Title *</label>
                <Input value={editAd.title || ""} onChange={(e) => setEditAd({ ...editAd, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Description</label>
                <Input value={editAd.description || ""} onChange={(e) => setEditAd({ ...editAd, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Destination URL *</label>
                <Input value={editAd.link_url || ""} onChange={(e) => setEditAd({ ...editAd, link_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Placement</label>
                  <select
                    className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={editAd.placement || "sidebar"}
                    onChange={(e) => setEditAd({ ...editAd, placement: e.target.value as any })}
                  >
                    {["sidebar","banner","footer","inline"].map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Order</label>
                  <Input
                    type="number" value={editAd.order_index || 0}
                    onChange={(e) => setEditAd({ ...editAd, order_index: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Ad Image</label>
                <div className="space-y-2">
                  <Input
                    placeholder="Image URL or upload below"
                    value={editAd.image_url || ""}
                    onChange={(e) => setEditAd({ ...editAd, image_url: e.target.value })}
                  />
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 bg-gray-100 rounded text-xs hover:bg-gray-200 transition-colors">
                      {uploading ? "Uploading…" : "Upload from device"}
                      <input
                        type="file" accept="image/*" className="hidden"
                        onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
                      />
                    </label>
                    {editAd.image_url && (
                      <img src={editAd.image_url} alt="" className="w-10 h-10 object-cover rounded" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={editAd.is_active ?? true} onCheckedChange={(v) => setEditAd({ ...editAd, is_active: v })} />
                <span className="text-sm">Active (visible on site)</span>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setEditAd(null)}>Cancel</Button>
                <Button onClick={saveAd} disabled={saving} className="bg-primary text-white hover:bg-primary/90">
                  {saving ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminAds;
