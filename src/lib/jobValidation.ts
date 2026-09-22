import { safeLink, safeImage } from "@/lib/safeUrl";

// Field limits, kept in step with the CHECK constraints in
// supabase-security.sql. Checking here first means the form can say exactly
// which field is wrong instead of showing a raw database error.
export const JOB_LIMITS = {
  title: ["Job Title", 200],
  company: ["Company", 200],
  location: ["Location", 200],
  type: ["Employment Type", 50],
  category: ["Category", 100],
  description: ["Job Description", 20000],
  requirements: ["Requirements", 20000],
  salary_range: ["Salary Range", 100],
  contact_name: ["Contact Person", 200],
  contact_email: ["Contact Email", 320],
  contact_phone: ["Contact Phone", 50],
  apply_url: ["Application Link", 2048],
  company_logo: ["Company Logo URL", 2048],
  how_to_apply: ["How to Apply", 5000],
} as const;

type JobFields = Partial<Record<keyof typeof JOB_LIMITS, string | null | undefined>>;

const n = (x: number) => x.toLocaleString("en-US");

// Tidies the Application Link box: adds https:// or mailto: where missing.
// Text with spaces isn't a link; it's returned in `moveToHowToApply` so the
// caller can keep it rather than save a broken link.
export function normalizeApplyUrl(raw: string | null | undefined): { url: string; moveToHowToApply: string } {
  const v = (raw || "").trim();
  if (!v) return { url: "", moveToHowToApply: "" };
  if (/\s/.test(v)) return { url: "", moveToHowToApply: v };
  if (/^(https?:\/\/|mailto:)/i.test(v)) return { url: v, moveToHowToApply: "" };
  return { url: /^[^@]+@[^@]+\.[^@]+$/.test(v) ? `mailto:${v}` : `https://${v}`, moveToHowToApply: "" };
}

// Returns a message naming the first problem, or null if the job can be saved.
export function validateJob(job: JobFields): string | null {
  for (const [key, [label, max]] of Object.entries(JOB_LIMITS) as [keyof typeof JOB_LIMITS, readonly [string, number]][]) {
    const len = (job[key] || "").length;
    if (len > max) {
      return `${label} is too long: ${n(len)} characters, and the limit is ${n(max)}. Please shorten it by ${n(len - max)}.`;
    }
  }
  if (job.apply_url && !safeLink(job.apply_url)) {
    return "Application Link must be a single web address (https://…) or email address. Put instructions in How to Apply instead.";
  }
  if (job.company_logo && !safeImage(job.company_logo)) {
    return "Company Logo must be a web address starting with https://";
  }
  return null;
}

// Turns a database error into something readable, for anything the checks
// above didn't catch.
export function friendlyJobError(message: string): string {
  const m = message.match(/check constraint "jobs_(\w+?)_(len|safe)"/);
  if (m) {
    const field = m[1] === "apply_url" ? "Application Link" : m[1] === "logo" ? "Company Logo" : m[1].replace(/_/g, " ");
    return `The ${field} field is too long or not in the right format. Please check it and try again.`;
  }
  if (/jobs_safe_input/.test(message)) {
    return "One of the fields is too long or has an invalid link. Please check the description, requirements and Application Link.";
  }
  return message;
}
