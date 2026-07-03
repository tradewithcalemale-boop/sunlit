import { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Copy, Check, ImageIcon, X } from "lucide-react";

type MediaFile = {
  name: string;
  url: string;
  size: number;
  created_at: string;
};

const AdminMedia = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.storage.from("media").list("", { sortBy: { column: "created_at", order: "desc" } });
    if (data) {
      const mapped = data
        .filter((f) => f.name !== ".emptyFolderPlaceholder")
        .map((f) => ({
          name: f.name,
          url: supabase.storage.from("media").getPublicUrl(f.name).data.publicUrl,
          size: f.metadata?.size || 0,
          created_at: f.created_at || "",
        }));
      setFiles(mapped);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const uploadFiles = async (fileList: FileList) => {
    setUploading(true);
    const uploads = Array.from(fileList).map(async (file) => {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
      if (!error) {
        const url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
        return { name: path, url, size: file.size, created_at: new Date().toISOString() };
      }
      return null;
    });
    const results = await Promise.all(uploads);
    const valid = results.filter(Boolean) as MediaFile[];
    setFiles((prev) => [...valid, ...prev]);
    setUploading(false);
  };

  const deleteFile = async (name: string) => {
    if (!confirm("Delete this file? This cannot be undone.")) return;
    await supabase.storage.from("media").remove([name]);
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1048576).toFixed(1)}MB`;
  };

  return (
    <AdminLayout title="Media Library">
      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors mb-6 ${
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-white"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf"
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        <Upload className={`w-10 h-10 mx-auto mb-3 ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
        <p className="text-sm font-medium text-foreground">
          {uploading ? "Uploading…" : "Drop files here or click to upload"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supports images, videos, and PDFs
        </p>
      </div>

      {/* File count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{files.length} file{files.length !== 1 ? "s" : ""}</p>
        <Button variant="cta" size="sm" onClick={() => fileInputRef.current?.click()}>
          <Upload className="w-3.5 h-3.5 mr-1" /> Upload
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square bg-white rounded-xl border border-border animate-pulse" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-16 text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No files uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {files.map((file) => (
            <div key={file.name} className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-square bg-gray-50">
                {/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name) ? (
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  </div>
                )}
                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyUrl(file.url)}
                    title="Copy URL"
                    className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
                  >
                    {copied === file.url ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-foreground" />}
                  </button>
                  <button
                    onClick={() => deleteFile(file.name)}
                    title="Delete"
                    className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-muted-foreground truncate" title={file.name}>{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMedia;
