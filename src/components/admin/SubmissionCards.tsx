import { Check } from 'lucide-react'
import type { AdminSubmissionRow } from '../../lib/adminTypes'
import { readinessTag } from '../../lib/adminTypes'
import StatusBadge from './StatusBadge'

interface SubmissionCardsProps {
  rows: AdminSubmissionRow[]
  onRowClick: (row: AdminSubmissionRow) => void
}

const READINESS_TONE: Record<'low' | 'early' | 'high', string> = {
  low: 'bg-red-50 text-red-700',
  early: 'bg-amber-50 text-amber-700',
  high: 'bg-emerald-50 text-emerald-700',
}

function initialAvatar(name: string) {
  return (name.trim().charAt(0) || '?').toUpperCase()
}

export default function SubmissionCards({ rows, onRowClick }: SubmissionCardsProps) {
  return (
    <div className="space-y-3 md:hidden">
      {rows.map((row) => {
        const tag = readinessTag(row.overall_readiness)
        return (
          <button
            key={row.id}
            type="button"
            onClick={() => onRowClick(row)}
            className="block w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm active:bg-gray-50"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-semibold text-indigo-700">
                  {initialAvatar(row.business_name)}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{row.business_name}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {row.contact_name || '—'} · {row.sector}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-lg font-semibold text-gray-900">
                  {row.overall_readiness ?? '—'}
                </span>
                <p
                  className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${READINESS_TONE[tag.tone]}`}
                >
                  {tag.label}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <StatusBadge status={row.status} />
              {row.consent_followup ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <Check className="h-3 w-3" aria-hidden="true" />
                  Consent
                </span>
              ) : (
                <span className="text-xs font-medium text-amber-700">
                  No follow-up consent
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-400">
              {new Date(row.created_at).toLocaleString()}
            </p>
          </button>
        )
      })}
    </div>
  )
}
