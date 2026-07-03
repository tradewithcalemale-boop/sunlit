import { supabase } from "./supabase";

const ADMIN_EMAIL = "admin@sunlitcentrekenya.co.ke";
const RATE_KEY = "sck_admin_attempts";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

type AttemptRecord = { count: number; first: number; locked?: boolean };

function getAttempts(): AttemptRecord {
  try {
    return JSON.parse(localStorage.getItem(RATE_KEY) || "{}");
  } catch {
    return { count: 0, first: Date.now() };
  }
}

function setAttempts(r: AttemptRecord) {
  localStorage.setItem(RATE_KEY, JSON.stringify(r));
}

export function getRateLimitStatus(): { locked: boolean; minutesLeft: number } {
  const r = getAttempts();
  if (!r.first || !r.count) return { locked: false, minutesLeft: 0 };
  const elapsed = Date.now() - r.first;
  if (r.count >= MAX_ATTEMPTS && elapsed < LOCKOUT_MS) {
    return { locked: true, minutesLeft: Math.ceil((LOCKOUT_MS - elapsed) / 60000) };
  }
  if (elapsed >= LOCKOUT_MS) {
    setAttempts({ count: 0, first: Date.now() });
  }
  return { locked: false, minutesLeft: 0 };
}

function recordAttempt(success: boolean) {
  const r = getAttempts();
  if (success) {
    setAttempts({ count: 0, first: Date.now() });
    return;
  }
  const elapsed = Date.now() - (r.first || Date.now());
  if (!r.first || elapsed >= LOCKOUT_MS) {
    setAttempts({ count: 1, first: Date.now() });
  } else {
    setAttempts({ count: (r.count || 0) + 1, first: r.first });
  }
}

export async function adminLogin(password: string): Promise<{ error: string | null }> {
  const { locked, minutesLeft } = getRateLimitStatus();
  if (locked) {
    return { error: `Too many attempts. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}.` };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password,
  });

  if (error) {
    recordAttempt(false);
    return { error: "Invalid password. Please try again." };
  }

  recordAttempt(true);
  return { error: null };
}

export async function adminLogout() {
  await supabase.auth.signOut();
}

export async function getAdminSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
