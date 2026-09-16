import type { AdminSubmissionRow } from './adminTypes'

function csvEscape(value: string | number | boolean | null): string {
  const str = value === null || value === undefined ? '' : String(value)
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

const CSV_COLUMNS: { header: string; get: (r: AdminSubmissionRow) => string | number | boolean | null }[] = [
  { header: 'Business name', get: (r) => r.business_name },
  { header: 'Contact name', get: (r) => r.contact_name },
  { header: 'Email', get: (r) => r.contact_email },
  { header: 'Phone', get: (r) => r.contact_phone },
  { header: 'Sector', get: (r) => r.sector },
  { header: 'Stage', get: (r) => r.stage },
  { header: 'Overall score', get: (r) => r.overall_readiness },
  { header: 'Status', get: (r) => r.status },
  { header: 'Consent', get: (r) => (r.consent_followup ? 'Yes' : 'No') },
  { header: 'Submitted date', get: (r) => r.created_at },
]

export function exportSubmissionsCsv(rows: AdminSubmissionRow[]): void {
  const header = CSV_COLUMNS.map((c) => csvEscape(c.header)).join(',')
  const lines = rows.map((row) =>
    CSV_COLUMNS.map((c) => csvEscape(c.get(row))).join(','),
  )
  const csv = [header, ...lines].join('\r\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bmi-diagnostic-submissions-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
