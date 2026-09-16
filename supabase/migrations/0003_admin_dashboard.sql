-- Admin Dashboard add-on — schema changes per admin-dashboard-spec.md §3-4.
-- Depends on submissions/reports from 0001_init.sql already existing.

-- ── §3: contact fields on submissions ──────────────────────────────────────

alter table submissions add column contact_name text not null default '';
alter table submissions add column contact_email text not null default '';
alter table submissions add column contact_phone text;
alter table submissions add column consent_followup boolean not null default false;

-- ── §3: admin_followups (workflow tracking, kept separate from submissions) ─

create table admin_followups (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions(id) on delete cascade unique,
  status text not null default 'New' check (status in ('New','Contacted','In conversation','Not interested','Converted')),
  assigned_to uuid references auth.users(id),
  notes text,
  next_followup_date date,
  updated_at timestamptz default now()
);

alter table admin_followups enable row level security;

-- ── §3: profiles (role management) ──────────────────────────────────────────

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','organizer')),
  full_name text
);

alter table profiles enable row level security;

-- Each user can read their own profile row (needed for the frontend to know
-- its own role after login and route-guard accordingly).
create policy "users can read own profile"
  on profiles for select
  to authenticated
  using (id = auth.uid());

-- ── §4: is_admin() / is_organizer() helpers, used by every gated policy ────

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function is_organizer()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'organizer'
  );
$$;

-- ── §4: tighten submissions/reports base-table access to admin-only. ───────
-- RLS in Postgres is row-scoped, not column-scoped: any policy that grants an
-- organizer `select` on the `submissions` table directly would also expose
-- contact_name/contact_email/contact_phone on every row it allows, since a
-- policy can't hide individual columns. So organizers get NO policy on the
-- base tables at all — they read exclusively through
-- organizer_submission_summary, a SECURITY DEFINER view (redefined below)
-- that whitelists only the non-contact columns and internally bypasses RLS
-- to do so. The view's own access is gated by is_organizer()/is_admin()
-- inside its WHERE clause plus a REVOKE/GRANT below, so an organizer who
-- queries `submissions` directly gets zero rows back.

drop policy if exists "organizers can select submissions" on submissions;
drop policy if exists "organizers can select reports" on reports;

create policy "admins can select submissions"
  on submissions for select
  to authenticated
  using (is_admin());

create policy "admins can select reports"
  on reports for select
  to authenticated
  using (is_admin());

-- ── admin_followups: admin-only, full CRUD ─────────────────────────────────

create policy "admins can select admin_followups"
  on admin_followups for select
  to authenticated
  using (is_admin());

create policy "admins can insert admin_followups"
  on admin_followups for insert
  to authenticated
  with check (is_admin());

create policy "admins can update admin_followups"
  on admin_followups for update
  to authenticated
  using (is_admin())
  with check (is_admin());

-- ── organizer_submission_summary: redefine as SECURITY DEFINER so it can
--    read the base tables on the organizer's behalf without granting the
--    organizer row access directly (which would leak contact columns). The
--    view's column list explicitly excludes contact_name/contact_email/
--    contact_phone/consent_followup and never joins admin_followups. Only
--    'admin' and 'organizer' roles may select from it (enforced both in the
--    WHERE clause and via GRANT below); anyone else gets zero rows / no
--    access. ───────────────────────────────────────────────────────────────

drop view if exists organizer_submission_summary;

create view organizer_submission_summary
with (security_invoker = false) as
  select
    s.id,
    s.created_at,
    s.business_name,
    s.sector,
    s.stage,
    s.share_with_organizers,
    r.id as report_id,
    r.overall_readiness,
    case when s.share_with_organizers then r.categories else null end as categories,
    case when s.share_with_organizers then r.summary else null end as summary,
    case when s.share_with_organizers then r.top_strengths else null end as top_strengths,
    case when s.share_with_organizers then r.key_gaps else null end as key_gaps,
    case when s.share_with_organizers then r.priority_actions else null end as priority_actions,
    case when s.share_with_organizers then r.next_steps else null end as next_steps,
    case when s.share_with_organizers then r.benchmark_note else null end as benchmark_note,
    case when s.share_with_organizers then r.category_narratives else null end as category_narratives,
    case when s.share_with_organizers then r.recommended_focus_area else null end as recommended_focus_area,
    case when s.share_with_organizers then r.pdf_url else null end as pdf_url
  from submissions s
  left join reports r on r.submission_id = s.id
  where is_organizer() or is_admin();

revoke all on organizer_submission_summary from public, anon;
grant select on organizer_submission_summary to authenticated;
