import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase, Job } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle, XCircle, Eye, Plus, Pencil, Trash2, Search,
} from "lucide-react";

type Tab = "all" | "pending" | "approved" | "rejected";

const statusColors: Record<string, string> = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const emptyJob: Partial<Job> = {
  title: "", company: "", location: "", type: "Full-time",
  category: "", description: "", requirements: "", salary_range: "",
  apply_url: "", contact_name: "", contact_email: "", contact_phone: "",
};

const AdminJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [editJob, setEditJob] = useState<Partial<Job> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const q = supabase.from("jobs").select("*").order("created_at", { ascending: false });
    const { data } = await q;
    setJobs(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = jobs.filter((j) => {
    if (tab !== "all" && j.status !== tab) return false;
    const s = search.toLowerCase();
    return !s || j.title.toLowerCase().includes(s) || j.company.toLowerCase().includes(s);
  });

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    await supabase.from("jobs").update({ status }).eq("id", id);
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
    if (viewJob?.id === id) setViewJob({ ...viewJob, status });
  };

  const deleteJob = async (id: string) => {
    if (!confirm("Delete this job listing?")) return;
    await supabase.from("jobs").delete().eq("id", id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const saveJob = async () => {
    if (!editJob) return;
    setSaving(true);
    if (editJob.id) {
      const { data } = await supabase.from("jobs").update(editJob).eq("id", editJob.id).select().single();
      if (data) setJobs((prev) => prev.map((j) => (j.id === data.id ? data : j)));
    } else {
      const payload = { ...editJob, status: "pending" as const };
      const { data } = await supabase.from("jobs").insert(payload).select().single();
      if (data) setJobs((prev) => [data, ...prev]);
    }
    setSaving(false);
    setEditJob(null);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <AdminLayout title="Job Listings">
      {/* Header actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tab === t.key ? "bg-primary text-white" : "bg-white border border-border text-muted-foreground hover:border-primary"
              }`}
            >
              {t.label}
              <span className="ml-1.5 text-xs opacity-70">
                {t.key === "all" ? jobs.length : jobs.filter((j) => j.status === t.key).length}
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9 w-52" placeholder="Search jobs…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="cta" onClick={() => setEditJob({ ...emptyJob })} className="flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Job
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Job Title</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Company</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Location</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Submitted</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-muted-foreground">No jobs found</td>
                </tr>
              ) : (
                filtered.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium max-w-[200px] truncate">{job.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{job.company}</td>
                    <td className="px-4 py-3 text-muted-foreground">{job.location}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button title="View" onClick={() => setViewJob(job)} className="p-1.5 hover:bg-gray-100 rounded text-muted-foreground hover:text-foreground">
                          <Eye className="w-4 h-4" />
                        </button>
                        {job.status === "pending" && (
                          <>
                            <button title="Approve" onClick={() => updateStatus(job.id, "approved")} className="p-1.5 hover:bg-green-50 rounded text-muted-foreground hover:text-green-600">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button title="Reject" onClick={() => updateStatus(job.id, "rejected")} className="p-1.5 hover:bg-red-50 rounded text-muted-foreground hover:text-red-600">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button title="Edit" onClick={() => setEditJob(job)} className="p-1.5 hover:bg-blue-50 rounded text-muted-foreground hover:text-blue-600">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button title="Delete" onClick={() => deleteJob(job.id)} className="p-1.5 hover:bg-red-50 rounded text-muted-foreground hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View modal */}
      <Dialog open={!!viewJob} onOpenChange={() => setViewJob(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewJob?.title}</DialogTitle>
          </DialogHeader>
          {viewJob && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Company", viewJob.company], ["Location", viewJob.location],
                  ["Type", viewJob.type], ["Category", viewJob.category],
                  ["Salary", viewJob.salary_range || "—"], ["Apply URL", viewJob.apply_url || "—"],
                  ["Contact", viewJob.contact_name || "—"], ["Email", viewJob.contact_email || "—"],
                  ["Phone", viewJob.contact_phone || "—"], ["Status", viewJob.status],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-xs text-muted-foreground font-medium">{l}</p>
                    <p className="text-foreground break-all">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Description</p>
                <p className="text-foreground whitespace-pre-wrap">{viewJob.description}</p>
              </div>
              {viewJob.requirements && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Requirements</p>
                  <p className="text-foreground whitespace-pre-wrap">{viewJob.requirements}</p>
                </div>
              )}
              {viewJob.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => updateStatus(viewJob.id, "approved")} className="bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button onClick={() => updateStatus(viewJob.id, "rejected")} variant="destructive">
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit/Add modal */}
      <Dialog open={!!editJob} onOpenChange={() => setEditJob(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editJob?.id ? "Edit Job" : "Add New Job"}</DialogTitle>
          </DialogHeader>
          {editJob && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                {([ ["title","Job Title"], ["company","Company"], ["location","Location"],
                    ["salary_range","Salary Range"], ["apply_url","Apply URL"],
                    ["contact_name","Contact Name"], ["contact_email","Contact Email"],
                    ["contact_phone","Contact Phone"] ] as [keyof Job, string][]).map(([f, lbl]) => (
                  <div key={f} className={f === "title" || f === "apply_url" ? "col-span-2" : ""}>
                    <label className="block text-xs font-medium mb-1">{lbl}</label>
                    <Input
                      value={(editJob as any)[f] || ""}
                      onChange={(e) => setEditJob({ ...editJob, [f]: e.target.value })}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium mb-1">Type</label>
                  <select
                    className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={editJob.type || "Full-time"}
                    onChange={(e) => setEditJob({ ...editJob, type: e.target.value })}
                  >
                    {["Full-time","Part-time","Contract","Internship","Remote"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Category</label>
                  <Input value={editJob.category || ""} onChange={(e) => setEditJob({ ...editJob, category: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Status</label>
                  <select
                    className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={editJob.status || "pending"}
                    onChange={(e) => setEditJob({ ...editJob, status: e.target.value as any })}
                  >
                    {["pending","approved","rejected"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Description</label>
                <Textarea rows={5} value={editJob.description || ""} onChange={(e) => setEditJob({ ...editJob, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Requirements</label>
                <Textarea rows={4} value={editJob.requirements || ""} onChange={(e) => setEditJob({ ...editJob, requirements: e.target.value })} />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setEditJob(null)}>Cancel</Button>
                <Button onClick={saveJob} disabled={saving} className="bg-primary text-white hover:bg-primary/90">
                  {saving ? "Saving…" : "Save Job"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminJobs;
