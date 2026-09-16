export const FOLLOWUP_STATUSES = [
  'New',
  'Contacted',
  'In conversation',
  'Not interested',
  'Converted',
] as const

export type FollowupStatus = (typeof FOLLOWUP_STATUSES)[number]

export interface AdminSubmissionRow {
  id: string
  created_at: string
  business_name: string
  sector: string
  stage: string
  years_in_operation: string | null
  team_size: string | null
  revenue_range: string
  customer_type: string
  processes_documented: string
  financial_planning: string
  tech_maturity: string
  biggest_challenge: string
  growth_goal: string | null
  share_with_organizers: boolean
  contact_name: string
  contact_email: string
  contact_phone: string | null
  consent_followup: boolean
  // joined from reports
  report_id: string | null
  overall_readiness: number | null
  categories: Record<string, number> | null
  summary: string | null
  top_strengths: string[] | null
  key_gaps: string[] | null
  priority_actions: string[] | null
  next_steps: string[] | null
  benchmark_note: string | null
  category_narratives: Record<string, string> | null
  recommended_focus_area: string | null
  pdf_url: string | null
  // joined from admin_followups
  followup_id: string | null
  status: FollowupStatus
  notes: string | null
  next_followup_date: string | null
}

export function readinessTag(score: number | null): { label: string; tone: 'low' | 'early' | 'high' } {
  if (score === null) return { label: '—', tone: 'low' }
  if (score >= 70) return { label: 'High Readiness', tone: 'high' }
  if (score >= 40) return { label: 'Early', tone: 'early' }
  return { label: 'Low', tone: 'low' }
}
