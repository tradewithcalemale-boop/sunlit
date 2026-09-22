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
--   5. Keeps employers' contact details private: the public job board reads
--      from a view without them, and application details (how to apply,
--      apply link) are only served to signed-in users
--   6. Deletes jobs automatically once their deadline day has passed
--      (Kenya time), every night just after midnight
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

-- Today's date in Kenya. The database clock runs on UTC, three hours behind
-- Nairobi, so plain current_date would keep a job open until 3am.
CREATE OR REPLACE FUNCTION public.kenya_today()
RETURNS date
LANGUAGE sql STABLE
SET search_path = ''
AS $$
  SELECT (now() AT TIME ZONE 'Africa/Nairobi')::date;
$$;

-- 1b. Job fields ---------------------------------------------------------------
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS how_to_apply text;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS deadline date;

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
-- Jobs: public may submit pending jobs; admin does all. There is deliberately
-- NO public read policy on the table: it holds employers' contact details.
-- The job board reads the jobs_public / jobs_apply_info views (section 7).
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
  -- Application deadline is mandatory for every new job, admin included.
  -- (Enforced on insert only, so existing jobs without one can still be
  -- approved or edited.)
  IF TG_TABLE_NAME = 'jobs' AND NEW.deadline IS NULL THEN
    RAISE EXCEPTION 'An application deadline is required.' USING ERRCODE = 'P0001';
  END IF;

  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  NEW.created_at := now();  -- can't be backdated to dodge the rate limit

  IF TG_TABLE_NAME = 'jobs' THEN
    NEW.status := 'pending';
    IF NEW.deadline < public.kenya_today() THEN
      RAISE EXCEPTION 'Please choose an application deadline that is today or later.'
        USING ERRCODE = 'P0001';
    END IF;
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

-- (Deadline is required by the insert trigger above, not a CHECK: a CHECK
-- would also block approving existing jobs that predate the field.)
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_deadline_required;
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_how_to_apply_len;
ALTER TABLE public.jobs ADD CONSTRAINT jobs_how_to_apply_len
  CHECK (char_length(coalesce(how_to_apply, '')) <= 5000) NOT VALID;

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

-- 7. Job board views -------------------------------------------------------------
-- Views run with the owner's rights, so they return exactly these columns and
-- rows regardless of table RLS. Approved jobs whose deadline hasn't passed.
-- No contact_name / contact_email / contact_phone anywhere public.
CREATE OR REPLACE VIEW public.jobs_public AS
SELECT id, title, company, company_logo, location, type, category,
       description, requirements, salary_range, deadline, created_at
FROM public.jobs
WHERE status = 'approved' AND (deadline IS NULL OR deadline >= public.kenya_today());

-- How to apply: signed-in users only, so visitors must register to apply.
CREATE OR REPLACE VIEW public.jobs_apply_info AS
SELECT id, apply_url, how_to_apply
FROM public.jobs
WHERE status = 'approved' AND (deadline IS NULL OR deadline >= public.kenya_today());

REVOKE ALL ON public.jobs_public     FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.jobs_apply_info FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.jobs_public     TO anon, authenticated;
GRANT SELECT ON public.jobs_apply_info TO authenticated;

NOTIFY pgrst, 'reload schema';

-- 8. Delete expired jobs automatically -------------------------------------------
-- A job's deadline is the last day to apply. From the next day (Kenya time) it
-- is deleted for good. Jobs without a deadline (posted before the field
-- existed) are never deleted by this; give them a deadline in the admin.
CREATE OR REPLACE FUNCTION public.delete_expired_jobs()
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE removed integer;
BEGIN
  DELETE FROM public.jobs WHERE deadline IS NOT NULL AND deadline < public.kenya_today();
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed;
END $$;

-- Only the scheduler (and the admin, via SQL) may run it.
REVOKE ALL ON FUNCTION public.delete_expired_jobs() FROM PUBLIC, anon, authenticated;

-- Clear out anything already expired right now.
SELECT public.delete_expired_jobs() AS expired_jobs_deleted_now;

-- Every night at 00:05 Kenya time (21:05 UTC; the scheduler runs on UTC).
-- Scheduling under the same name replaces the old schedule, so re-running is safe.
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('delete-expired-jobs', '5 21 * * *', 'SELECT public.delete_expired_jobs()');

-- 9. Check the result -----------------------------------------------------------
-- You should see one row: delete-expired-jobs | 5 21 * * * | active = true
SELECT jobname, schedule, command, active FROM cron.job WHERE jobname = 'delete-expired-jobs';
