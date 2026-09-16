import { SECTORS, STAGES, REVENUE_RANGES } from '../../lib/submissionTypes'
import { FOLLOWUP_STATUSES, type FollowupStatus } from '../../lib/adminTypes'

export interface AdminFilters {
  sector: string
  stage: string
  revenueRange: string
  status: FollowupStatus | ''
  consent: '' | 'yes' | 'no'
  dateFrom: string
  dateTo: string
}

interface FilterBarProps {
  filters: AdminFilters
  onChange: (filters: AdminFilters) => void
}

const EMPTY_FILTERS: AdminFilters = {
  sector: '',
  stage: '',
  revenueRange: '',
  status: '',
  consent: '',
  dateFrom: '',
  dateTo: '',
}

const selectClass =
  'min-h-9 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100'

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const set = <K extends keyof AdminFilters>(key: K, value: AdminFilters[K]) =>
    onChange({ ...filters, [key]: value })

  const hasActiveFilters = Object.values(filters).some((v) => v !== '')

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-gray-400">Filter by:</span>

      <select
        className={selectClass}
        value={filters.sector}
        onChange={(e) => set('sector', e.target.value)}
      >
        <option value="">All sectors</option>
        {SECTORS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={filters.stage}
        onChange={(e) => set('stage', e.target.value)}
      >
        <option value="">All stages</option>
        {STAGES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={filters.revenueRange}
        onChange={(e) => set('revenueRange', e.target.value)}
      >
        <option value="">All revenue ranges</option>
        {REVENUE_RANGES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={filters.status}
        onChange={(e) => set('status', e.target.value as FollowupStatus | '')}
      >
        <option value="">All statuses</option>
        {FOLLOWUP_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={filters.consent}
        onChange={(e) => set('consent', e.target.value as AdminFilters['consent'])}
      >
        <option value="">Consent: any</option>
        <option value="yes">Consent: yes</option>
        <option value="no">Consent: no</option>
      </select>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => onChange(EMPTY_FILTERS)}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
        >
          Reset filters
        </button>
      )}
    </div>
  )
}
