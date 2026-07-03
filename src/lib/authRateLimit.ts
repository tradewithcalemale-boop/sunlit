const KEY = "sck_login_rl";
const MAX = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

type Record = { count: number; first: number };

const get = (): Record => {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return { count: 0, first: Date.now() }; }
};
const set = (r: Record) => localStorage.setItem(KEY, JSON.stringify(r));

export const isRateLimited = (): { locked: boolean; minutesLeft: number } => {
  const r = get();
  if (!r.first || !r.count) return { locked: false, minutesLeft: 0 };
  const elapsed = Date.now() - r.first;
  if (elapsed >= WINDOW_MS) { set({ count: 0, first: Date.now() }); return { locked: false, minutesLeft: 0 }; }
  if (r.count >= MAX) return { locked: true, minutesLeft: Math.ceil((WINDOW_MS - elapsed) / 60000) };
  return { locked: false, minutesLeft: 0 };
};

export const recordFailure = () => {
  const r = get();
  const elapsed = Date.now() - (r.first || Date.now());
  if (!r.first || elapsed >= WINDOW_MS) set({ count: 1, first: Date.now() });
  else set({ count: (r.count || 0) + 1, first: r.first });
};

export const clearRateLimit = () => set({ count: 0, first: Date.now() });
