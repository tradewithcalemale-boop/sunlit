// Display helpers shared by the job list and the job details page.

export const typeColors: Record<string, string> = {
  "Full-time":  "bg-green-100 text-green-700",
  "Part-time":  "bg-blue-100 text-blue-700",
  "Contract":   "bg-orange-100 text-orange-700",
  "Internship": "bg-purple-100 text-purple-700",
  "Remote":     "bg-teal-100 text-teal-700",
};

export const timeSince = (date: string) => {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
};

// Deadlines are plain dates (YYYY-MM-DD); read them as local midnight.
export const formatDeadline = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
export const daysLeft = (d: string) =>
  Math.round((new Date(`${d}T00:00:00`).getTime() - new Date(new Date().toDateString()).getTime()) / 86400000);

// "(closes today)", "(2 days left)" etc. Only shown when the deadline is close.
export const deadlineNote = (d: string) => {
  const left = daysLeft(d);
  if (left < 0) return " (closed)";
  if (left === 0) return " (closes today)";
  if (left <= 3) return ` (${left} day${left !== 1 ? "s" : ""} left)`;
  return "";
};

// Path of a job's own page, which can be shared as a link.
export const jobPath = (id: string) => `/jobs/${id}`;
