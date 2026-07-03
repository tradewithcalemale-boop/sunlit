import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { Briefcase, Megaphone, MessageSquare, Clock, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

type Stats = {
  totalApproved: number;
  pendingJobs: number;
  activeAds: number;
  unreadMessages: number;
};

const StatCard = ({
  label, value, icon: Icon, color, href,
}: {
  label: string; value: number; icon: any; color: string; href: string;
}) => (
  <Link
    to={href}
    className="bg-white rounded-xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow flex items-center gap-4"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  </Link>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ totalApproved: 0, pendingJobs: 0, activeAds: 0, unreadMessages: 0 });
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [approved, pending, ads, unread, jobs, msgs] = await Promise.all([
        supabase.from("jobs").select("id", { count: "exact" }).eq("status", "approved"),
        supabase.from("jobs").select("id", { count: "exact" }).eq("status", "pending"),
        supabase.from("advertisements").select("id", { count: "exact" }).eq("is_active", true),
        supabase.from("contact_submissions").select("id", { count: "exact" }).eq("status", "unread"),
        supabase.from("jobs").select("id,title,company,status,created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("contact_submissions").select("id,name,email,status,created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({
        totalApproved: approved.count || 0,
        pendingJobs: pending.count || 0,
        activeAds: ads.count || 0,
        unreadMessages: unread.count || 0,
      });
      setRecentJobs(jobs.data || []);
      setRecentMessages(msgs.data || []);
      setLoading(false);
    };
    load();
  }, []);

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      pending:  "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      unread:   "bg-blue-100 text-blue-700",
      read:     "bg-gray-100 text-gray-600",
      replied:  "bg-green-100 text-green-700",
    };
    return map[s] || "bg-gray-100 text-gray-600";
  };

  return (
    <AdminLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Approved Jobs"     value={stats.totalApproved}  icon={CheckCircle}  color="bg-green-100 text-green-600"   href="/ssuunnlliitt/jobs" />
        <StatCard label="Pending Approval"  value={stats.pendingJobs}    icon={Clock}        color="bg-yellow-100 text-yellow-600" href="/ssuunnlliitt/jobs" />
        <StatCard label="Active Ads"        value={stats.activeAds}      icon={Megaphone}    color="bg-blue-100 text-blue-600"     href="/ssuunnlliitt/ads" />
        <StatCard label="Unread Messages"   value={stats.unreadMessages} icon={MessageSquare} color="bg-purple-100 text-purple-600" href="/ssuunnlliitt/contacts" />
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-border p-5 mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/ssuunnlliitt/jobs?tab=pending" className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Review Pending Jobs ({stats.pendingJobs})
          </Link>
          <Link to="/ssuunnlliitt/ads" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2">
            <Megaphone className="w-4 h-4" /> Manage Ads
          </Link>
          <Link to="/ssuunnlliitt/contacts" className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Read Messages ({stats.unreadMessages})
          </Link>
          <Link to="/ssuunnlliitt/content" className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Edit Site Content
          </Link>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent jobs */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Recent Job Submissions</h2>
            <Link to="/ssuunnlliitt/jobs" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">No jobs yet</div>
          ) : (
            <div className="divide-y divide-border">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.company}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(job.status)}`}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent messages */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Recent Messages</h2>
            <Link to="/ssuunnlliitt/contacts" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : recentMessages.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">No messages yet</div>
          ) : (
            <div className="divide-y divide-border">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{msg.name}</p>
                    <p className="text-xs text-muted-foreground">{msg.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(msg.status)}`}>
                    {msg.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
