-- Consolidate the Organizer and Admin dashboards into a single dashboard.
-- The two-role split (organizer = restricted, admin = full access) is no
-- longer needed: any authenticated staff login should see full submission
-- detail, including contact info, and be able to manage follow-ups.

-- Any authenticated user can now read submissions/reports directly (full
-- columns, including contact_name/contact_email/contact_phone).
drop policy if exists "admins can select submissions" on submissions;
drop policy if exists "admins can select reports" on reports;

create policy "authenticated can select submissions"
  on submissions for select
  to authenticated
  using (true);

create policy "authenticated can select reports"
  on reports for select
  to authenticated
  using (true);

-- admin_followups: any authenticated user can manage follow-up workflow.
drop policy if exists "admins can select admin_followups" on admin_followups;
drop policy if exists "admins can insert admin_followups" on admin_followups;
drop policy if exists "admins can update admin_followups" on admin_followups;

create policy "authenticated can select admin_followups"
  on admin_followups for select
  to authenticated
  using (true);

create policy "authenticated can insert admin_followups"
  on admin_followups for insert
  to authenticated
  with check (true);

create policy "authenticated can update admin_followups"
  on admin_followups for update
  to authenticated
  using (true)
  with check (true);

-- The restricted organizer_submission_summary view and its role helpers are
-- no longer used by any page — dropped along with the profiles-based role
-- check. profiles/is_admin()/is_organizer() are left in place (harmless,
-- unused) in case role separation is reintroduced later; only the view and
-- its access model are removed since the dashboard now queries submissions/
-- reports/admin_followups directly.
drop view if exists organizer_submission_summary;
