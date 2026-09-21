-- ============================================================================
-- Sunlit Centre Kenya: database security hardening
-- Run once in Supabase -> SQL Editor. Safe to re-run.
--
-- Before this, every logged-in user (anyone can register on the site) had full
-- read/write on every table, and anonymous visitors could publish jobs straight
-- to the public board, skipping approval. This script:
--   1. Makes only the admin account able to manage content and read messages
--   2. Forces public submissions into "pending"/"unread" and rate-limits them
--   3. Rejects dangerous links (javascript: etc.) and oversized input
--   4. Locks the media bucket to the admin, fixes the admin media listing,
--      and restricts upload types and size
--
-- The admin is identified by user ID, not email. If you ever change the admin
-- account, update the UUID in public.is_admin() below AND ADMIN_EMAIL in
-- src/lib/adminAuth.ts.
-- ============================================================================

-- 1. Who is the admin? -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE
SET search_path = ''
AS $$
  SELECT COALESCE(auth.uid() = 'eec43e0c-d42e-4bcb-b3ad-70d7dcede0b9'::uuid, false);
$$;

-- 2. Remove every existing policy on the app tables --------------------------
-- Dropped dynamically so policies added by hand in the dashboard are caught too.
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname, tablename FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('jobs','advertisements','contact_submissions','site_content')
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', p.policyname, p.tablename);
  END LOOP;
END $$;

ALTER TABLE public.jobs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content        ENABLE ROW LEVEL SECURITY;

-- 3. Row-level security policies ---------------------------------------------
-- Jobs: public sees approved jobs and may submit pending ones; admin does all.
CREATE POLICY jobs_public_read   ON public.jobs FOR SELECT TO anon, authenticated
  USING (status = 'approved');
CREATE POLICY jobs_public_submit ON public.jobs FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');
CREATE POLICY jobs_admin_all     ON public.jobs FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Advertisements: public sees active ads; admin does all.
CREATE POLICY ads_public_read ON public.advertisements FOR SELECT TO anon, authenticated
  USING (is_active = true);
CREATE POLICY ads_admin_all   ON public.advertisements FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Contact messages: public may only send; only admin can read or change them.
CREATE POLICY contact_public_submit ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'unread' AND admin_notes IS NULL);
CREATE POLICY contact_admin_all     ON public.contact_submissions FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Site content: public reads; admin edits.
CREATE POLICY content_public_read ON public.site_content FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY content_admin_all   ON public.site_content FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. Force safe values on public submissions and rate-limit them ------------
-- SECURITY DEFINER so it can count rows the submitter isn't allowed to see.
CREATE OR REPLACE FUNCTION public.guard_public_submission()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE recent int;
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  NEW.created_at := now();  -- can't be backdated to dodge the rate limit

  IF TG_TABLE_NAME = 'jobs' THEN
    NEW.status := 'pending';
    SELECT count(*) INTO recent FROM public.jobs
      WHERE created_at > now() - interval '1 minute';
  ELSE
    NEW.status := 'unread';
    NEW.admin_notes := NULL;
    SELECT count(*) INTO recent FROM public.contact_submissions
      WHERE created_at > now() - interval '1 minute';
  END IF;

  IF recent >= 10 THEN
    RAISE EXCEPTION 'Too many submissions right now. Please try again in a minute.'
      USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS guard_public_submission ON public.jobs;
CREATE TRIGGER guard_public_submission BEFORE INSERT ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.guard_public_submission();

DROP TRIGGER IF EXISTS guard_public_submission ON public.contact_submissions;
CREATE TRIGGER guard_public_submission BEFORE INSERT ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.guard_public_submission();

-- 5. Input limits and safe links ---------------------------------------------
-- NOT VALID: applies to new and edited rows without failing on existing data.
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_safe_input;
ALTER TABLE public.jobs ADD CONSTRAINT jobs_safe_input CHECK (
      char_length(title) <= 200
  AND char_length(company) <= 200
  AND char_length(location) <= 200
  AND char_length(type) <= 50
  AND char_length(category) <= 100
  AND char_length(description) <= 10000
  AND char_length(coalesce(requirements, '')) <= 10000
  AND char_length(coalesce(salary_range, '')) <= 100
  AND char_length(coalesce(contact_name, '')) <= 200
  AND char_length(coalesce(contact_email, '')) <= 320
  AND char_length(coalesce(contact_phone, '')) <= 50
  AND char_length(coalesce(apply_url, '')) <= 2048
  AND char_length(coalesce(company_logo, '')) <= 2048
  AND (coalesce(apply_url, '') = ''    OR apply_url    ~* '^(https?://|mailto:)')
  AND (coalesce(company_logo, '') = '' OR company_logo ~* '^https?://')
) NOT VALID;

ALTER TABLE public.contact_submissions DROP CONSTRAINT IF EXISTS contact_safe_input;
ALTER TABLE public.contact_submissions ADD CONSTRAINT contact_safe_input CHECK (
      char_length(name) BETWEEN 1 AND 200
  AND char_length(email) <= 320
  AND email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  AND char_length(message) BETWEEN 1 AND 5000
) NOT VALID;

ALTER TABLE public.advertisements DROP CONSTRAINT IF EXISTS ads_safe_links;
ALTER TABLE public.advertisements ADD CONSTRAINT ads_safe_links CHECK (
      link_url ~* '^https?://'
  AND (coalesce(image_url, '') = '' OR image_url ~* '^https?://')
) NOT VALID;

-- 6. Media storage -------------------------------------------------------------
DROP POLICY IF EXISTS "public_read_media" ON storage.objects;
DROP POLICY IF EXISTS "auth_upload_media" ON storage.objects;
DROP POLICY IF EXISTS "auth_delete_media" ON storage.objects;
DROP POLICY IF EXISTS media_public_read  ON storage.objects;
DROP POLICY IF EXISTS media_admin_insert ON storage.objects;
DROP POLICY IF EXISTS media_admin_update ON storage.objects;
DROP POLICY IF EXISTS media_admin_delete ON storage.objects;

-- Read now includes "authenticated", which is what fixes the admin Media page
-- showing empty and deletes silently failing.
CREATE POLICY media_public_read  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');
CREATE POLICY media_admin_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY media_admin_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin())
  WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY media_admin_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());

-- Images, video and PDF only, 50 MB max. SVG is excluded on purpose: SVG files
-- can carry scripts.
UPDATE storage.buckets
SET file_size_limit    = 52428800,
    allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif',
                               'video/mp4','video/webm','application/pdf']
WHERE id = 'media';

-- 7. Check the result -----------------------------------------------------------
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE (schemaname = 'public' AND tablename IN ('jobs','advertisements','contact_submissions','site_content'))
   OR (schemaname = 'storage' AND policyname LIKE 'media_%')
ORDER BY tablename, policyname;
