import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rdxxbhcfsbogaplzdspi.supabase.co";
// Anon key is safe for client-side – RLS policies enforce security
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkeHhiaGNmc2JvZ2FwbHpkc3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NDE2MjMsImV4cCI6MjA5MzQxNzYyM30.xiTPuUSSBz2CzIBwnRgnqT98JlEDi9xEv3Tj1WybOpQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Job = {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  type: string;
  category: string;
  description: string;
  requirements?: string;
  salary_range?: string;
  apply_url?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
};

export type Advertisement = {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  link_url: string;
  placement: "sidebar" | "banner" | "footer" | "inline";
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read" | "replied";
  admin_notes?: string;
  created_at: string;
};

export type SiteContent = {
  key: string;
  value: string;
  label: string;
  page: string;
  content_type: "text" | "richtext" | "image" | "url";
  updated_at: string;
};
