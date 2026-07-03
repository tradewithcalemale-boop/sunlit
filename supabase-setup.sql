-- ============================================================
--  Sunlit Centre Kenya – Supabase Database Setup
--  Run this entire script in Supabase > SQL Editor
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES

CREATE TABLE IF NOT EXISTS jobs (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT        NOT NULL,
  company       TEXT        NOT NULL,
  company_logo  TEXT,
  location      TEXT        NOT NULL,
  type          TEXT        NOT NULL,
  category      TEXT        NOT NULL,
  description   TEXT        NOT NULL,
  requirements  TEXT,
  salary_range  TEXT,
  apply_url     TEXT,
  contact_name  TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  status        TEXT        NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending','approved','rejected')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS advertisements (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT        NOT NULL,
  description   TEXT,
  image_url     TEXT,
  link_url      TEXT        NOT NULL,
  placement     TEXT        NOT NULL DEFAULT 'sidebar'
                            CHECK (placement IN ('sidebar','banner','footer','inline')),
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  order_index   INTEGER     DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  message       TEXT        NOT NULL,
  status        TEXT        NOT NULL DEFAULT 'unread'
                            CHECK (status IN ('unread','read','replied')),
  admin_notes   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_content (
  key           TEXT        PRIMARY KEY,
  value         TEXT        NOT NULL,
  label         TEXT        NOT NULL,
  page          TEXT        NOT NULL,
  content_type  TEXT        DEFAULT 'text'
                            CHECK (content_type IN ('text','richtext','image','url')),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TRIGGER – auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER jobs_updated_at   BEFORE UPDATE ON jobs          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER ads_updated_at    BEFORE UPDATE ON advertisements FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER content_updated_at BEFORE UPDATE ON site_content  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 4. SEED default site content
INSERT INTO site_content (key, value, label, page, content_type) VALUES
  ('home_hero_title',   'Your trusted partner in HR, organizational excellence, training, and ISO certification solutions.', 'Hero Heading',   'home',   'text'),
  ('home_stats_jobs',   '20+',     'Daily New Jobs Stat',  'home',   'text'),
  ('home_stats_active', '500+',    'Active Listings Stat', 'home',   'text'),
  ('home_stats_placed', '10,000+', 'Placements Stat',      'home',   'text'),
  ('footer_address',    'Blue Violets Plaza, 2nd Floor, Kamburu Drive, Off Ngong Road, Kilimani.', 'Footer Address', 'global', 'text'),
  ('footer_phone',      '+(254) 0737 687 881',           'Footer Phone', 'global', 'text'),
  ('footer_email',      'info@sunlitcentrekenya.co.ke',  'Footer Email', 'global', 'url')
ON CONFLICT (key) DO NOTHING;

-- 5. ROW-LEVEL SECURITY
ALTER TABLE jobs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content        ENABLE ROW LEVEL SECURITY;

-- Public (anon) can read approved jobs & active ads & all content
CREATE POLICY "anon_read_approved_jobs" ON jobs            FOR SELECT TO anon USING (status = 'approved');
CREATE POLICY "anon_insert_jobs"        ON jobs            FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "anon_read_active_ads"    ON advertisements   FOR SELECT TO anon USING (is_active = TRUE);
CREATE POLICY "anon_read_content"       ON site_content     FOR SELECT TO anon USING (TRUE);
CREATE POLICY "anon_insert_contact"     ON contact_submissions FOR INSERT TO anon WITH CHECK (TRUE);

-- Authenticated admin gets full access
CREATE POLICY "auth_all_jobs"     ON jobs                FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "auth_all_ads"      ON advertisements      FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "auth_all_contacts" ON contact_submissions FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "auth_all_content"  ON site_content        FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- 6. STORAGE – media bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', TRUE)
ON CONFLICT DO NOTHING;

CREATE POLICY "public_read_media"  ON storage.objects FOR SELECT TO anon        USING (bucket_id = 'media');
CREATE POLICY "auth_upload_media"  ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');
CREATE POLICY "auth_delete_media"  ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media');

-- ============================================================
--  AFTER RUNNING THIS SQL:
--  Go to Supabase > Authentication > Users > Add User
--    Email:    admin@sunlitcentrekenya.co.ke
--    Password: SunlitAdmin908Q@
--  This creates the admin account used by the dashboard.
-- ============================================================
