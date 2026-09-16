import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useOrganizerSession } from '../lib/useOrganizerSession'
import type { AdminSubmissionRow, FollowupStatus } from '../lib/adminTypes'
import DashboardTopBar from '../components/admin/DashboardTopBar'
import SummaryStats from '../components/admin/SummaryStats'
import FilterBar, { type AdminFilters } from '../components/admin/FilterBar'
import SearchBox from '../components/admin/SearchBox'
import DateRangeControl from '../components/admin/DateRangeControl'
import SubmissionsTable from '../components/admin/SubmissionsTable'
import SubmissionCards from '../components/admin/SubmissionCards'
import ExportButton from '../components/admin/ExportButton'
import AdminSubmissionDetail from './AdminSubmissionDetail'

const EMPTY_FILTERS: AdminFilters = {
  sector: '',
  stage: '',
  revenueRange: '',
  status: '',
  consent: '',
  dateFrom: '',
  dateTo: '',
}

const PAGE_SIZE = 10

interface RawSubmission {
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
  reports: {
    id: string
    overall_readiness: number
    categories: Record<string, number>
    summary: string
    top_strengths: string[]
    key_gaps: string[]
    priority_actions: string[]
    next_steps: string[]
    benchmark_note: string | null
    category_narratives: Record<string, string> | null
    recommended_focus_area: string | null
    pdf_url: string | null
  }[]
  admin_followups: {
    id: string
    status: FollowupStatus
    notes: string | null
    next_followup_date: string | null
  }[]
}

function mapRow(row: RawSubmission): AdminSubmissionRow {
  const report = row.reports?.[0] ?? null
  const followup = row.admin_followups?.[0] ?? null
  return {
    id: row.id,
    created_at: row.created_at,
    business_name: row.business_name,
    sector: row.sector,
    stage: row.stage,
    years_in_operation: row.years_in_operation,
    team_size: row.team_size,
    revenue_range: row.revenue_range,
    customer_type: row.customer_type,
    processes_documented: row.processes_documented,
    financial_planning: row.financial_planning,
    tech_maturity: row.tech_maturity,
    biggest_challenge: row.biggest_challenge,
    growth_goal: row.growth_goal,
    share_with_organizers: row.share_with_organizers,
    contact_name: row.contact_name,
    contact_email: row.contact_email,
    contact_phone: row.contact_phone,
    consent_followup: row.consent_followup,
    report_id: report?.id ?? null,
    overall_readiness: report?.overall_readiness ?? null,
    categories: report?.categories ?? null,
    summary: report?.summary ?? null,
    top_strengths: report?.top_strengths ?? null,
    key_gaps: report?.key_gaps ?? null,
    priority_actions: report?.priority_actions ?? null,
    next_steps: report?.next_steps ?? null,
    benchmark_note: report?.benchmark_note ?? null,
    category_narratives: report?.category_narratives ?? null,
    recommended_focus_area: report?.recommended_focus_area ?? null,
    pdf_url: report?.pdf_url ?? null,
    followup_id: followup?.id ?? null,
    status: followup?.status ?? 'New',
    notes: followup?.notes ?? null,
    next_followup_date: followup?.next_followup_date ?? null,
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { session, loading: sessionLoading } = useOrganizerSession()
  const [rows, setRows] = useState<AdminSubmissionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AdminFilters>(EMPTY_FILTERS)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<'score' | 'date' | 'status'>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (sessionLoading) return
    if (!session) {
      navigate('/admin/login', { replace: true })
    }
  }, [sessionLoading, session, navigate])

  const fetchRows = useMemo(
    () => async () => {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('submissions')
        .select(
          `id, created_at, business_name, sector, stage, years_in_operation,
           team_size, revenue_range, customer_type, processes_documented,
           financial_planning, tech_maturity, biggest_challenge, growth_goal,
           share_with_organizers, contact_name, contact_email, contact_phone,
           consent_followup,
           reports (id, overall_readiness, categories, summary, top_strengths,
             key_gaps, priority_actions, next_steps, benchmark_note,
             category_narratives, recommended_focus_area, pdf_url),
           admin_followups (id, status, notes, next_followup_date)`,
        )
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError('Could not load submissions.')
        setLoading(false)
        return
      }

      setRows(((data ?? []) as unknown as RawSubmission[]).map(mapRow))
      setLoading(false)
    },
    [],
  )

  useEffect(() => {
    if (!session) return

    let cancelled = false

    async function load() {
      if (cancelled) return
      await fetchRows()
    }
    load()

    const channel = supabase
      .channel('admin-submissions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, () => fetchRows())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => fetchRows())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_followups' }, () => fetchRows())
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [session, fetchRows])

  const filteredRows = useMemo(() => {
    let result = rows

    if (filters.sector) result = result.filter((r) => r.sector === filters.sector)
    if (filters.stage) result = result.filter((r) => r.stage === filters.stage)
    if (filters.revenueRange)
      result = result.filter((r) => r.revenue_range === filters.revenueRange)
    if (filters.status) result = result.filter((r) => r.status === filters.status)
    if (filters.consent === 'yes') result = result.filter((r) => r.consent_followup)
    if (filters.consent === 'no') result = result.filter((r) => !r.consent_followup)
    if (filters.dateFrom)
      result = result.filter((r) => r.created_at >= filters.dateFrom)
    if (filters.dateTo)
      result = result.filter((r) => r.created_at <= `${filters.dateTo}T23:59:59`)

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (r) =>
          r.business_name.toLowerCase().includes(q) ||
          r.contact_name.toLowerCase().includes(q) ||
          r.contact_email.toLowerCase().includes(q),
      )
    }

    return [...result].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'score') {
        cmp = (a.overall_readiness ?? -1) - (b.overall_readiness ?? -1)
      } else if (sortKey === 'date') {
        cmp = a.created_at.localeCompare(b.created_at)
      } else if (sortKey === 'status') {
        cmp = a.status.localeCompare(b.status)
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [rows, filters, search, sortKey, sortDir])

  useEffect(() => {
    setPage(1)
  }, [filters, search, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const pagedRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSortChange = (key: 'score' | 'date' | 'status') => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  if (sessionLoading || !session) {
    return (
      <main className="flex min-h-svh items-center justify-center px-4">
        <p className="text-sm text-gray-500">Loading…</p>
      </main>
    )
  }

  const selectedRow = rows.find((r) => r.id === selectedId) ?? null

  if (selectedRow) {
    return (
      <AdminSubmissionDetail
        row={selectedRow}
        onBack={() => setSelectedId(null)}
        onUpdated={(update) =>
          setRows((prev) =>
            prev.map((r) => (r.id === selectedRow.id ? { ...r, ...update } : r)),
          )
        }
      />
    )
  }

  return (
    <div className="min-h-svh bg-gray-50">
      <DashboardTopBar
        userEmail={session.user.email ?? 'admin'}
        search={search}
        onSearchChange={setSearch}
        onSignOut={handleSignOut}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Submissions Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Live submissions, full report diagnostic details, scoring
              analytics, and follow-up tracking.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => void fetchRows()}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Refresh Data
            </button>
            <ExportButton rows={filteredRows} />
          </div>
        </div>

        <div className="mt-6">
          <SummaryStats rows={rows} />
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBox value={search} onChange={setSearch} />
            <DateRangeControl
              dateFrom={filters.dateFrom}
              dateTo={filters.dateTo}
              onFromChange={(v) => setFilters((f) => ({ ...f, dateFrom: v }))}
              onToChange={(v) => setFilters((f) => ({ ...f, dateTo: v }))}
            />
          </div>
          <div className="mt-3">
            <FilterBar filters={filters} onChange={setFilters} />
          </div>
        </div>

        <div className="mt-6">
          {loading && <p className="text-sm text-gray-500">Loading submissions…</p>}

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {!loading && !error && rows.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <h2 className="text-lg font-medium text-gray-900">
                No submissions yet
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Submissions will appear here as attendees complete the
                diagnostic.
              </p>
            </div>
          )}

          {!loading && !error && rows.length > 0 && filteredRows.length === 0 && (
            <p className="text-sm text-gray-500">
              No submissions match the current filters.
            </p>
          )}

          {!loading && !error && filteredRows.length > 0 && (
            <>
              <SubmissionsTable
                rows={pagedRows}
                onRowClick={(row) => setSelectedId(row.id)}
                sortKey={sortKey}
                sortDir={sortDir}
                onSortChange={handleSortChange}
              />
              <SubmissionCards
                rows={pagedRows}
                onRowClick={(row) => setSelectedId(row.id)}
              />

              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <p className="text-xs text-gray-500">
                  Showing {(page - 1) * PAGE_SIZE + 1} to{' '}
                  {Math.min(page * PAGE_SIZE, filteredRows.length)} of{' '}
                  {filteredRows.length} submissions
                </p>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-gray-500">
                    Rows per page:
                    <span className="font-medium text-gray-700">{PAGE_SIZE}</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="min-h-8 rounded-lg border border-gray-200 px-2.5 text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="min-h-8 rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white">
                      {page}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="min-h-8 rounded-lg border border-gray-200 px-2.5 text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-gray-400 sm:flex-row sm:px-6 lg:px-8">
          <p>BMI Business Diagnostic Admin · Version 2.4.0</p>
          <div className="flex items-center gap-4">
            <span>Documentation</span>
            <span>API Diagnostics</span>
            <span>Privacy &amp; Security</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
