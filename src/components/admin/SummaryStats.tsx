import { FileText, Zap, BarChart3, CheckCircle2, Clock } from 'lucide-react'
import type { AdminSubmissionRow } from '../../lib/adminTypes'

interface SummaryStatsProps {
  rows: AdminSubmissionRow[]
}

function CardShell({
  label,
  icon,
  children,
}: {
  label: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <span className="text-gray-300 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      </div>
      {children}
    </div>
  )
}

export default function SummaryStats({ rows }: SummaryStatsProps) {
  const total = rows.length
  const scored = rows.filter((r) => r.overall_readiness !== null)
  const avgReadiness = scored.length
    ? Math.round(
        scored.reduce((sum, r) => sum + (r.overall_readiness ?? 0), 0) /
          scored.length,
      )
    : 0

  const byStage = { Idea: 0, Execution: 0, Scale: 0 } as Record<string, number>
  rows.forEach((r) => {
    if (r.stage in byStage) byStage[r.stage] += 1
  })

  const consentCount = rows.filter((r) => r.consent_followup).length
  const consentRate = total ? Math.round((consentCount / total) * 100) : 0

  const newCount = rows.filter((r) => r.status === 'New').length

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <CardShell label="Total submissions" icon={<FileText />}>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{total}</p>
        <p className="mt-1 text-xs text-gray-400">Across all sectors</p>
      </CardShell>

      <CardShell label="Avg. readiness" icon={<Zap />}>
        <p className="mt-2 text-2xl font-semibold text-gray-900">
          {avgReadiness}
          <span className="text-sm font-normal text-gray-400"> / 100</span>
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-amber-500"
            style={{ width: `${avgReadiness}%` }}
          />
        </div>
      </CardShell>

      <CardShell label="By stage" icon={<BarChart3 />}>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
            I: {byStage.Idea}
          </span>
          <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
            E: {byStage.Execution}
          </span>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            S: {byStage.Scale}
          </span>
        </div>
        <p className="mt-2 text-xs text-gray-400">Idea · Execution · Scale</p>
      </CardShell>

      <CardShell label="Follow-up consent" icon={<CheckCircle2 />}>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{consentCount}</p>
        <p className="mt-1 text-xs font-medium text-emerald-600">
          {consentRate}% rate
        </p>
      </CardShell>

      <CardShell label="New / unreviewed" icon={<Clock />}>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{newCount}</p>
        {newCount > 0 ? (
          <p className="mt-1 text-xs font-medium text-violet-600">Action needed</p>
        ) : (
          <p className="mt-1 text-xs text-gray-400">All submissions current</p>
        )}
      </CardShell>
    </div>
  )
}
