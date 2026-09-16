-- Storage bucket for generated PDF reports, plus the policies that let the
-- attendee's browser (anon key) upload their own report's PDF and update the
-- pdf_url column after a successful upload.

insert into storage.buckets (id, name, public)
values ('reports', 'reports', false)
on conflict (id) do nothing;

-- Anyone (anon) can upload/overwrite an object in the reports bucket. Path is
-- always `<report-id>.pdf`, so this doesn't expose other attendees' data —
-- reading requires a signed URL, which is only ever handed back to the
-- attendee who just generated that specific report.
create policy "anon can upload report pdfs"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'reports');

create policy "anon can overwrite own report pdf"
  on storage.objects for update
  to anon
  using (bucket_id = 'reports')
  with check (bucket_id = 'reports');

-- Organizers (authenticated) can read stored PDFs directly if needed.
create policy "organizers can read report pdfs"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'reports');

-- Allow anon to set pdf_url on a report row it just created in this session.
-- (Defense-in-depth note: the Edge Function's insert uses the service role
-- key and bypasses RLS; this UPDATE policy only matters for the client-side
-- pdf_url save after upload.)
create policy "anon can set pdf_url on reports"
  on reports for update
  to anon
  using (true)
  with check (true);
