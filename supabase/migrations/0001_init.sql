-- BMI Business Diagnostic Platform — initial schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on your own project.

create extension if not exists "pgcrypto";

-- businesses / submissions
create table submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  business_name text not null,
  sector text not null,
  stage text not null check (stage in ('Idea','Execution','Scale')),
  years_in_operation text,
  team_size text,
  revenue_range text not null,
  customer_type text not null check (customer_type in ('B2B','B2C','Both')),
  processes_documented text not null check (processes_documented in ('Yes','Partial','No')),
  financial_planning text not null check (financial_planning in ('Yes','Partial','No')),
  tech_maturity text not null,
  biggest_challenge text not null,
  growth_goal text,
  share_with_organizers boolean default true
);

-- AI-generated reports, one-to-one with submissions
create table reports (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions(id) on delete cascade,
  created_at timestamptz default now(),
  overall_readiness int not null,
  categories jsonb not null,       -- { "Market readiness": 78, "Execution": 70, ... }
  summary text not null,
  top_strengths jsonb not null,    -- string[]
  key_gaps jsonb not null,         -- string[]
  priority_actions jsonb not null, -- string[]
  next_steps jsonb not null,       -- string[]
  benchmark_note text,             -- sector-relative comparison
  category_narratives jsonb,       -- { "Market readiness": "...", ... }
  recommended_focus_area text,
  pdf_url text                     -- Supabase Storage URL once generated
);

-- organizer accounts use Supabase Auth (email/password or magic link) — no custom table needed

alter table submissions enable row level security;
alter table reports enable row level security;

-- Anon insert (the Edge Function actually writes using the service role key,
-- which bypasses RLS — these policies exist for defense-in-depth / direct-insert cases).
create policy "anon can insert submissions"
  on submissions for insert
  to anon
  with check (true);

create policy "anon can insert reports"
  on reports for insert
  to anon
  with check (true);

-- No public select policy on either table — attendees read their freshly
-- created report via the Edge Function response / local state, not via a
-- Supabase query using the anon key.

-- Authenticated organizers can read everything (full row) — the "opted out"
-- restriction is enforced by exposing a limited view instead, see below.
create policy "organizers can select submissions"
  on submissions for select
  to authenticated
  using (true);

create policy "organizers can select reports"
  on reports for select
  to authenticated
  using (true);

-- Limited view for organizer dashboard rows where the attendee opted out of
-- sharing full report detail. The dashboard should query this view rather
-- than the base tables when share_with_organizers = false.
create view organizer_submission_summary as
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
  left join reports r on r.submission_id = s.id;

alter view organizer_submission_summary set (security_invoker = true);
