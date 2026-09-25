import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LinkifiedText from "@/components/LinkifiedText";
import { Button } from "@/components/ui/button";
import { supabase, PublicJob, JobApplyInfo } from "@/lib/supabase";
import { safeImage, safeLink } from "@/lib/safeUrl";
import { useAuth } from "@/hooks/useAuth";
import { typeColors, timeSince, formatDeadline, daysLeft, deadlineNote, jobPath } from "@/lib/jobFormat";
import {
  MapPin, Clock, Briefcase, Building2, ChevronLeft, ChevronRight,
  Bookmark, ExternalLink, CalendarClock, LogIn, Share2, Check, SearchX,
} from "lucide-react";

// A job's own page (/jobs/:id), so a single job can be shared as a link.
// Everyone sees the description and requirements; how to apply is only
// served to signed-in users (the database won't send it otherwise).
const JobDetails = () => {
  const { id = "" } = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<PublicJob | null>(null);
  const [info, setInfo] = useState<JobApplyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const signInUrl = `/login-register?returnUrl=${encodeURIComponent(jobPath(id))}`;

  // jobs_public only has approved jobs whose deadline hasn't passed, so an
  // expired or removed job shows the "no longer available" message.
  useEffect(() => {
    setLoading(true);
    supabase
      .from("jobs_public")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setJob((data as PublicJob) || null);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) { setInfo(null); setSaved(false); return; }
    supabase
      .from("jobs_apply_info")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => setInfo((data as JobApplyInfo) || null));
    supabase
      .from("saved_jobs")
      .select("job_id")
      .eq("job_id", id)
      .then(({ data }) => setSaved((data || []).length > 0));
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (!job) return;
    const previous = document.title;
    document.title = `${job.title} at ${job.company} | Sunlit Centre Kenya`;
    return () => { document.title = previous; };
  }, [job]);

  const toggleSave = async () => {
    if (!isAuthenticated) { navigate(signInUrl); return; }
    const wasSaved = saved;
    setSaved(!wasSaved); // show the change straight away
    const { error } = wasSaved
      ? await supabase.from("saved_jobs").delete().eq("job_id", id)
      : await supabase.from("saved_jobs").insert({ job_id: id });
    if (error) setSaved(wasSaved); // undo
  };

  // Phones get the native share sheet (WhatsApp etc.); elsewhere copy the link.
  const share = async () => {
    const url = window.location.origin + jobPath(id);
    if (navigator.share) {
      try { await navigator.share({ title: job ? `${job.title} at ${job.company}` : "Job", url }); } catch { /* cancelled */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link to share the job:", url);
    }
  };

  const link = safeLink(info?.apply_url);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/view-jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to all jobs
        </Link>

        {loading ? (
          <div className="bg-white rounded-2xl border border-border p-8 animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
          </div>
        ) : !job ? (
          <div className="bg-white rounded-2xl border border-border p-16 text-center">
            <SearchX className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h1 className="font-semibold text-lg mb-1">This job is no longer available</h1>
            <p className="text-muted-foreground text-sm mb-4">Its deadline may have passed, or it was removed.</p>
            <Button variant="cta" asChild>
              <Link to="/view-jobs">Browse current jobs</Link>
            </Button>
          </div>
        ) : (
          <article className="bg-white rounded-2xl border border-border p-6 md:p-8 space-y-6">
            <header className="flex gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                {safeImage(job.company_logo) ? (
                  <img src={safeImage(job.company_logo)} alt={job.company} className="w-12 h-12 object-contain" />
                ) : (
                  <Building2 className="w-7 h-7 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary">{job.title}</h1>
                <p className="text-base text-muted-foreground mt-1">{job.company}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={toggleSave}
                    className={`inline-flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-1.5 border transition-colors ${saved ? "bg-primary/10 text-primary border-primary/30" : "border-border hover:bg-accent"}`}
                  >
                    <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
                    {!isAuthenticated ? "Sign in to save" : saved ? "Saved" : "Save job"}
                  </button>
                  <button
                    onClick={share}
                    className="inline-flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-1.5 border border-border hover:bg-accent transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
                    {copied ? "Link copied" : "Share job"}
                  </button>
                </div>
              </div>
            </header>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
              <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[job.type] || "bg-gray-100 text-gray-700"}`}>
                <Briefcase className="w-3 h-3" /> {job.type}
              </span>
              <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">{job.category}</span>
              {job.salary_range && <span>{job.salary_range}</span>}
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Posted {timeSince(job.created_at)}</span>
            </div>

            {job.deadline && (
              <p className={`flex items-center gap-1.5 text-sm font-semibold ${daysLeft(job.deadline) <= 3 ? "text-destructive" : "text-foreground"}`}>
                <CalendarClock className="w-4 h-4" /> Application deadline: {formatDeadline(job.deadline)}{deadlineNote(job.deadline)}
              </p>
            )}

            <section>
              <h2 className="font-semibold text-lg mb-2">Job Description</h2>
              <LinkifiedText text={job.description} className="text-sm md:text-base text-foreground leading-relaxed" />
            </section>

            {job.requirements && (
              <section>
                <h2 className="font-semibold text-lg mb-2">Requirements &amp; Qualifications</h2>
                <LinkifiedText text={job.requirements} className="text-sm md:text-base text-foreground leading-relaxed" />
              </section>
            )}

            <section className="rounded-xl border border-border bg-secondary/40 p-5">
              <h2 className="font-semibold text-lg mb-2">How to Apply</h2>
              {authLoading ? null : !isAuthenticated ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Sign in or create a free account to see how to apply for this job.
                  </p>
                  <Link
                    to={signInUrl}
                    className="inline-flex items-center gap-1.5 bg-cta text-cta-foreground text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <LogIn className="w-3.5 h-3.5" /> Sign in to Apply
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {info?.how_to_apply ? (
                    <LinkifiedText text={info.how_to_apply} className="text-sm text-foreground" />
                  ) : !link ? (
                    <p className="text-sm text-muted-foreground">Contact us to apply for this role.</p>
                  ) : null}
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-cta text-cta-foreground text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Apply Now <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : !info?.how_to_apply ? (
                    <Link to="/contact-us" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                      Contact us <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : null}
                </div>
              )}
            </section>
          </article>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default JobDetails;
