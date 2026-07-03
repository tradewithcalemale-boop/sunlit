import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase, ContactSubmission } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Clock, CheckCircle, MessageSquare } from "lucide-react";

type Filter = "all" | "unread" | "read" | "replied";

const statusColors: Record<string, string> = {
  unread:  "bg-blue-100 text-blue-700",
  read:    "bg-gray-100 text-gray-600",
  replied: "bg-green-100 text-green-700",
};

const statusIcons: Record<string, any> = {
  unread:  Mail,
  read:    Clock,
  replied: CheckCircle,
};

const AdminContacts = () => {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const open = async (msg: ContactSubmission) => {
    setSelected(msg);
    setNotes(msg.admin_notes || "");
    // Mark as read
    if (msg.status === "unread") {
      await supabase.from("contact_submissions").update({ status: "read" }).eq("id", msg.id);
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, status: "read" as const } : m));
    }
  };

  const updateStatus = async (id: string, status: ContactSubmission["status"]) => {
    await supabase.from("contact_submissions").update({ status, admin_notes: notes }).eq("id", id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status, admin_notes: notes } : m));
    setSelected(null);
  };

  const filtered = messages.filter((m) => filter === "all" || m.status === filter);

  const filters: { key: Filter; label: string }[] = [
    { key: "all",     label: "All" },
    { key: "unread",  label: "Unread" },
    { key: "read",    label: "Read" },
    { key: "replied", label: "Replied" },
  ];

  return (
    <AdminLayout title="Contact Messages">
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {filters.map((f) => {
          const count = f.key === "all" ? messages.length : messages.filter((m) => m.status === f.key).length;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f.key ? "bg-primary text-white" : "bg-white border border-border text-muted-foreground hover:border-primary"
              }`}
            >
              {f.label} <span className="ml-1 opacity-70 text-xs">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No messages in this category</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((msg) => {
              const Icon = statusIcons[msg.status];
              return (
                <div
                  key={msg.id}
                  onClick={() => open(msg)}
                  className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    msg.status === "unread" ? "bg-blue-50/40" : ""
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${statusColors[msg.status]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className={`text-sm font-medium ${msg.status === "unread" ? "text-foreground" : "text-muted-foreground"}`}>
                        {msg.name}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{msg.email}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{msg.message}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusColors[msg.status]}`}>
                    {msg.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message detail modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message from {selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">From</p>
                  <p className="font-medium">{selected.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Email</p>
                  <a href={`mailto:${selected.email}`} className="text-primary hover:underline">{selected.email}</a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Received</p>
                  <p>{new Date(selected.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Status</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[selected.status]}`}>
                    {selected.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Message</p>
                <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">{selected.message}</div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Admin Notes</label>
                <Textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this message…"
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                <Button
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                  onClick={() => updateStatus(selected.id, "replied")}
                >
                  <CheckCircle className="w-4 h-4 mr-1" /> Mark Replied
                </Button>
                <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90">
                  <Mail className="w-4 h-4" /> Reply via Email
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminContacts;
