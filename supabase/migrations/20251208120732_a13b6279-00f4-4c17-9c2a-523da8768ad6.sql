-- Schedule daily cleanup of images older than 7 days (runs at midnight UTC)
SELECT cron.schedule(
  'cleanup-old-images-daily',
  '0 0 * * *',
  $$
  SELECT net.http_post(
    url := 'https://wahdjskwegycbrxiyjjg.supabase.co/functions/v1/cleanup-old-images',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhaGRqc2t3ZWd5Y2JyeGl5ampnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1Nzk4NTMsImV4cCI6MjA3NTE1NTg1M30._dfqI8RLWTjMS-hdPsynCAiy-wTd_czWvyqK6XSKyUo"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);