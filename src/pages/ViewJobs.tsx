import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, PublicJob } from "@/lib/supabase";
import { safeImage } from "@/lib/safeUrl";
import { useAuth } from "@/hooks/useAuth";
import { typeColors, timeSince, formatDeadline, daysLeft, deadlineNote, jobPath } from "@/lib/jobFormat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin, Clock, Search, Building2,
  Bookmark, SlidersHorizontal, X, CalendarClock, LogIn, FileText,
} from "lucide-react";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
const CATEGORIES = [
  "Human Resources", "Humanitarian", "Finance", "Marketing",
  "Technology", "Administration", "Healthcare", "Education", "Legal",
];

const ViewJobs = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [allJobs, setAllJobs] = useState<PublicJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedCat, setSelectedCat] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const navigate = useNavigate();

  // Anyone can browse. The view has no employer contact details and only
  // lists approved jobs whose deadline hasn't passed.
  useEffect(() => {
    supabase
      .from("jobs_public")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setAllJobs((data as PublicJob[]) || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) { setSaved(new Set()); setShowSavedOnly(false); return; }
    supabase
      .from("saved_jobs")
      .select("job_id")
      .then(({ data }) => setSaved(new Set((data || []).map((r: { job_id: string }) => r.job_id))));
  }, [isAuthenticated]);

  const filtered = useMemo(() => {
    return allJobs.filter((j) => {
      const q = search.toLowerCase();
      const loc = location.toLowerCase();
      const matchSearch = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.description.toLowerCase().includes(q) || j.category.toLowerCase().includes(q);
      const matchLoc = !loc || j.location.toLowerCase().includes(loc);
      const matchType = selectedType.length === 0 || selectedType.includes(j.type);
      const matchCat = selectedCat.length === 0 || selectedCat.includes(j.category);
      const matchSaved = !showSavedOnly || saved.has(j.id);
      return matchSearch && matchLoc && matchType && matchCat && matchSaved;
    });
  }, [allJobs, search, location, selectedType, selectedCat, showSavedOnly, saved]);

  const toggleType = (t: string) =>
    setSelectedType((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  const toggleCat = (c: string) =>
    setSelectedCat((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  // Saved jobs belong to the user's account (saved_jobs table), so they're
  // kept across visits and devices. Visitors are sent to sign in first.
  const toggleSave = async (id: string) => {
    if (!isAuthenticated) {
      navigate("/login-register?returnUrl=/view-jobs");
      return;
    }
    const wasSaved = saved.has(id);
    const flip = (prev: Set<string>) => {
      const next = new Set(prev);
      if (wasSaved) next.delete(id); else next.add(id);
      return next;
    };
    setSaved(flip); // show the change straight away
    const { error } = wasSaved
      ? await supabase.from("saved_jobs").delete().eq("job_id", id)
      : await supabase.from("saved_jobs").insert({ job_id: id });
    if (error) setSaved((prev) => { const next = new Set(prev); if (wasSaved) next.add(id); else next.delete(id); return next; }); // undo
  };

  const clearFilters = () => { setSearch(""); setLocation(""); setSelectedType([]); setSelectedCat([]); };
  const hasFilters = !!(search || location || selectedType.length || selectedCat.length);

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Job Type */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Job Type</p>
        <div className="space-y-2">
          {JOB_TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedType.includes(t)}
                onChange={() => toggleType(t)}
                className="w-4 h-4 accent-primary rounded"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{t}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {allJobs.filter((j) => j.type === t).length}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Category</p>
        <div className="space-y-2">
          {CATEGORIES.map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCat.includes(c)}
                onChange={() => toggleCat(c)}
                className="w-4 h-4 accent-primary rounded"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{c}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {allJobs.filter((j) => j.category === c).length}
              </span>
            </label>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="text-xs text-destructive hover:underline flex items-center gap-1">
          <X className="w-3 h-3" /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero search bar */}
      <div className="hero-bg py-14">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif text-primary font-extrabold text-center mb-2">
            Find Your Next Opportunity
          </h1>
          <p className="text-slate-600 text-center mb-8">
            {allJobs.length > 0 ? `${allJobs.length} active jobs across Kenya and East Africa` : "Explore careers across Kenya and East Africa"}
          </p>
          <div className="bg-white rounded-2xl p-2 shadow-xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-9 border-0 shadow-none focus-visible:ring-0 text-base h-12"
                placeholder="Job title, company, or keyword…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-px bg-border hidden md:block self-stretch my-1" />
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-9 border-0 shadow-none focus-visible:ring-0 text-base h-12"
                placeholder="City or region…"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button variant="cta" size="lg" className="h-12 px-8 shrink-0">
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex gap-8">
          {/* Filter sidebar – desktop */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-border p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-destructive hover:underline">Reset</button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Main list */}
          <div className="flex-1 min-w-0">
            {/* Count + mobile filter button */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filtered.length}</span> job{filtered.length !== 1 ? "s" : ""} found
                {hasFilters ? " (filtered)" : ""}
              </p>
              {isAuthenticated && (
                <button
                  onClick={() => setShowSavedOnly(!showSavedOnly)}
                  className={`flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-1.5 border transition-colors ${showSavedOnly ? "bg-primary text-white border-primary" : "border-border hover:bg-accent"}`}
                >
                  <Bookmark className={`w-4 h-4 ${showSavedOnly ? "fill-current" : ""}`} />
                  Saved jobs ({saved.size})
                </button>
              )}
              <button
                className="lg:hidden flex items-center gap-2 text-sm font-medium border border-border rounded-lg px-3 py-1.5 hover:bg-accent"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters {(selectedType.length + selectedCat.length) > 0 && `(${selectedType.length + selectedCat.length})`}
              </button>
            </div>

            {/* Mobile filter panel */}
            {showFilters && (
              <div className="lg:hidden bg-white rounded-2xl border border-border p-5 mb-4">
                <FilterPanel />
              </div>
            )}

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {[...selectedType, ...selectedCat].map((chip) => (
                  <span
                    key={chip}
                    className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full cursor-pointer hover:bg-primary/20"
                    onClick={() => {
                      if (JOB_TYPES.includes(chip)) toggleType(chip);
                      else toggleCat(chip);
                    }}
                  >
                    {chip} <X className="w-3 h-3" />
                  </span>
                ))}
              </div>
            )}

            {/* Job cards */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-border p-6 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-3 bg-gray-100 rounded w-1/3" />
                        <div className="h-3 bg-gray-100 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border p-16 text-center">
                <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold mb-1">No jobs match your search</p>
                <p className="text-muted-foreground text-sm mb-4">Try different keywords or clear the filters</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white border border-border rounded-2xl p-5 hover:shadow-md transition-all hover:border-primary/30 group"
                  >
                    <div className="flex gap-4">
                      {/* Company logo */}
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        {safeImage(job.company_logo) ? (
                          <img src={safeImage(job.company_logo)} alt={job.company} className="w-10 h-10 object-contain" />
                        ) : (
                          <Building2 className="w-6 h-6 text-primary" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                              <Link to={jobPath(job.id)} className="text-left hover:underline">
                                {job.title}
                              </Link>
                            </h3>
                            <p className="text-sm text-muted-foreground">{job.company}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleSave(job.id)}
                              className={`p-1.5 rounded-lg transition-colors ${saved.has(job.id) ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-gray-100"}`}
                              title={!isAuthenticated ? "Sign in to save this job" : saved.has(job.id) ? "Remove from saved jobs" : "Save job"}
                            >
                              <Bookmark className={`w-4 h-4 ${saved.has(job.id) ? "fill-current" : ""}`} />
                            </button>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{job.description}</p>

                        {/* Tags row */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" /> {job.location}
                          </span>
                          <span className="text-muted-foreground">·</span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" /> {timeSince(job.created_at)}
                          </span>
                          {job.salary_range && (
                            <>
                              <span className="text-muted-foreground">·</span>
                              <span className="text-xs text-muted-foreground">{job.salary_range}</span>
                            </>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-auto ${typeColors[job.type] || "bg-gray-100 text-gray-700"}`}>
                            {job.type}
                          </span>
                          <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                            {job.category}
                          </span>
                        </div>

                        {job.deadline && (
                          <p className={`flex items-center gap-1.5 text-xs mt-3 font-medium ${daysLeft(job.deadline) <= 3 ? "text-destructive" : "text-muted-foreground"}`}>
                            <CalendarClock className="w-3.5 h-3.5" />
                            Apply by {formatDeadline(job.deadline)}{deadlineNote(job.deadline)}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <Link
                            to={jobPath(job.id)}
                            className="inline-flex items-center gap-1.5 bg-cta text-cta-foreground text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            {isAuthenticated ? "View Details & Apply" : "View Details"}
                          </Link>
                          {!authLoading && !isAuthenticated && (
                            <Link
                              to={`/login-register?returnUrl=${encodeURIComponent(jobPath(job.id))}`}
                              className="inline-flex items-center gap-1.5 border border-border text-sm font-semibold px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                            >
                              <LogIn className="w-3.5 h-3.5" /> Sign in to Apply
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Employer CTA */}
      <section className="bg-secondary py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-serif font-bold mb-3">Are You an Employer?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Post your job openings and reach thousands of qualified professionals today.
          </p>
          <Button variant="cta" size="lg" asChild>
            <Link to="/submit-job">Submit a Job Listing</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ViewJobs;
