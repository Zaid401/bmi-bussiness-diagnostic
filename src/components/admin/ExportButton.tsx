import { Download } from 'lucide-react'
import type { AdminSubmissionRow } from '../../lib/adminTypes'
import { exportSubmissionsCsv } from '../../lib/exportCsv'

interface ExportButtonProps {
  rows: AdminSubmissionRow[]
}

export default function ExportButton({ rows }: ExportButtonProps) {
  return (
    <button
      type="button"
      onClick={() => exportSubmissionsCsv(rows)}
      disabled={rows.length === 0}
      className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
    >
      <Download className="h-3.5 w-3.5" aria-hidden="true" />
      Export CSV
      <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-xs">
        {rows.length}
      </span>
    </button>
  )
}
