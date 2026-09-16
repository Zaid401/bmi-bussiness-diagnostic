import { ArrowUp, ArrowDown, Check, ArrowRight } from 'lucide-react'
import type { AdminSubmissionRow } from '../../lib/adminTypes'
import { readinessTag } from '../../lib/adminTypes'
import StatusBadge from './StatusBadge'

interface SubmissionsTableProps {
  rows: AdminSubmissionRow[]
  onRowClick: (row: AdminSubmissionRow) => void
  sortKey: 'score' | 'date' | 'status'
  sortDir: 'asc' | 'desc'
  onSortChange: (key: 'score' | 'date' | 'status') => void
}

function SortHeader({
  label,
  active,
  dir,
  onClick,
}: {
  label: string
  active: boolean
  dir: 'asc' | 'desc'
  onClick: () => void
}) {
  return (
    <th
      onClick={onClick}
      className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 hover:text-gray-600"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active &&
          (dir === 'asc' ? (
            <ArrowUp className="h-3 w-3" aria-hidden="true" />
          ) : (
            <ArrowDown className="h-3 w-3" aria-hidden="true" />
          ))}
      </span>
    </th>
  )
}

const STAGE_TONE: Record<string, string> = {
  Idea: 'bg-indigo-50 text-indigo-700',
  Execution: 'bg-violet-50 text-violet-700',
  Scale: 'bg-blue-50 text-blue-700',
}

const READINESS_TONE: Record<'low' | 'early' | 'high', string> = {
  low: 'bg-red-50 text-red-700',
  early: 'bg-amber-50 text-amber-700',
  high: 'bg-emerald-50 text-emerald-700',
}

function initialAvatar(name: string) {
  return (name.trim().charAt(0) || '?').toUpperCase()
}

export default function SubmissionsTable({
  rows,
  onRowClick,
  sortKey,
  sortDir,
  onSortChange,
}: SubmissionsTableProps) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-white md:block">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50/60">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
              Business
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
              Contact
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
              Sector
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
              Stage
            </th>
            <SortHeader
              label="Score"
              active={sortKey === 'score'}
              dir={sortDir}
              onClick={() => onSortChange('score')}
            />
            <SortHeader
              label="Status"
              active={sortKey === 'status'}
              dir={sortDir}
              onClick={() => onSortChange('status')}
            />
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
              Consent
            </th>
            <SortHeader
              label="Submitted"
              active={sortKey === 'date'}
              dir={sortDir}
              onClick={() => onSortChange('date')}
            />
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row) => {
            const tag = readinessTag(row.overall_readiness)
            return (
              <tr key={row.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-semibold text-indigo-700">
                      {initialAvatar(row.business_name)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {row.business_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        ID: SUB-{row.id.slice(0, 4).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {row.contact_name || '—'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <span className="mr-1 text-gray-300">•</span>
                  {row.sector}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STAGE_TONE[row.stage] ?? 'bg-gray-100 text-gray-600'}`}
                  >
                    {row.stage}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {row.overall_readiness ?? '—'}
                      <span className="text-xs font-normal text-gray-400">/100</span>
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${READINESS_TONE[tag.tone]}`}
                    >
                      {tag.label}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3">
                  {row.consent_followup ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      <Check className="h-3 w-3" aria-hidden="true" />
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                      No
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(row.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onRowClick(row)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    View Report
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
