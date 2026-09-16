import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import type { AdminSubmissionRow, FollowupStatus } from '../lib/adminTypes'
import type { ReportData } from '../lib/reportSchema'
import NotesEditor from '../components/admin/NotesEditor'
import ReadinessRing from '../components/report/ReadinessRing'
import CategoryBars from '../components/report/CategoryBars'

interface AdminSubmissionDetailProps {
  row: AdminSubmissionRow
  onBack: () => void
  onUpdated: (update: Partial<AdminSubmissionRow>) => void
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        } catch {
          // clipboard API unavailable — silently ignore, link/text is still visible
        }
      }}
      className="ml-2 text-xs font-medium text-indigo-600 hover:text-indigo-800"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-gray-900">{value || '—'}</dd>
    </div>
  )
}

export default function AdminSubmissionDetail({
  row,
  onBack,
  onUpdated,
}: AdminSubmissionDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 md:p-4">
      <div className="h-full w-full overflow-y-auto bg-white p-5 shadow-xl sm:p-6 md:h-auto md:max-h-[90vh] md:max-w-2xl md:rounded-2xl">
        <div className="flex items-start justify-between">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to dashboard
            </button>
            <h1 className="mt-2 text-xl font-semibold text-gray-900">
              {row.business_name}
            </h1>
            <p className="text-sm text-gray-500">
              {row.sector} · {row.stage} · Submitted{' '}
              {new Date(row.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Contact block */}
        <section className="mt-6 rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">Contact</h2>

          {!row.consent_followup && (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
              This business did not consent to follow-up contact — do not
              reach out.
            </p>
          )}

          <dl className="mt-3 space-y-3">
            <Field label="Contact name" value={row.contact_name} />
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email
              </dt>
              <dd className="mt-0.5 flex items-center text-sm text-gray-900">
                <a href={`mailto:${row.contact_email}`} className="text-indigo-600 hover:underline">
                  {row.contact_email}
                </a>
                <CopyButton value={row.contact_email} />
              </dd>
            </div>
            {row.contact_phone && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Phone
                </dt>
                <dd className="mt-0.5 flex items-center text-sm text-gray-900">
                  <a href={`tel:${row.contact_phone}`} className="text-indigo-600 hover:underline">
                    {row.contact_phone}
                  </a>
                  <CopyButton value={row.contact_phone} />
                </dd>
              </div>
            )}
          </dl>
        </section>

        {/* Raw submission fields */}
        <section className="mt-6 rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Business details
          </h2>
          <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Years in operation" value={row.years_in_operation} />
            <Field label="Team size" value={row.team_size} />
            <Field label="Revenue range" value={row.revenue_range} />
            <Field label="Customer type" value={row.customer_type} />
            <Field label="Processes documented" value={row.processes_documented} />
            <Field label="Financial planning" value={row.financial_planning} />
            <Field label="Tech maturity" value={row.tech_maturity} />
          </dl>
          <div className="mt-3 space-y-3">
            <Field label="Biggest challenge" value={row.biggest_challenge} />
            <Field label="Growth goal" value={row.growth_goal} />
          </div>
        </section>

        {/* AI report */}
        {row.overall_readiness !== null && (
          <section className="mt-6 rounded-xl border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Diagnostic report
            </h2>

            <div className="mt-4 flex justify-center">
              <ReadinessRing score={row.overall_readiness} />
            </div>

            {row.summary && (
              <p className="mt-4 text-sm leading-relaxed text-gray-700">
                {row.summary}
              </p>
            )}

            {row.categories && (
              <div className="mt-4">
                <CategoryBars
                  categories={row.categories as ReportData['categories']}
                  variant="bar"
                />
              </div>
            )}

            {row.category_narratives && (
              <div className="mt-4 space-y-3">
                {Object.entries(row.category_narratives).map(([name, text]) => (
                  <div key={name}>
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    <p className="text-sm text-gray-600">{text}</p>
                  </div>
                ))}
              </div>
            )}

            {row.top_strengths && (
              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Strengths
                </h3>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-gray-700">
                  {row.top_strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {row.key_gaps && (
              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                  Gaps
                </h3>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-gray-700">
                  {row.key_gaps.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
            )}

            {row.priority_actions && (
              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Priority actions
                </h3>
                <ol className="mt-1.5 list-decimal space-y-1 pl-5 text-sm text-gray-700">
                  {row.priority_actions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ol>
              </div>
            )}

            {row.next_steps && (
              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Next steps
                </h3>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-gray-700">
                  {row.next_steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {row.recommended_focus_area && (
              <div className="mt-4 rounded-lg bg-indigo-50 p-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-indigo-800">
                  Recommended focus area
                </h3>
                <p className="mt-1 text-sm text-indigo-900">
                  {row.recommended_focus_area}
                </p>
              </div>
            )}

            {row.benchmark_note && (
              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Benchmark
                </h3>
                <p className="mt-1 text-sm text-gray-600">{row.benchmark_note}</p>
              </div>
            )}

            {row.pdf_url && (
              <a
                href={row.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Open PDF report
              </a>
            )}
          </section>
        )}

        {/* Editable workflow block */}
        <section className="mt-6 rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">Follow-up</h2>
          <div className="mt-3">
            <NotesEditor
              submissionId={row.id}
              initialStatus={row.status}
              initialNotes={row.notes}
              initialNextFollowupDate={row.next_followup_date}
              onSaved={(update) =>
                onUpdated({
                  followup_id: update.followup_id,
                  status: update.status as FollowupStatus,
                  notes: update.notes,
                  next_followup_date: update.next_followup_date,
                })
              }
            />
          </div>
        </section>
      </div>
    </div>
  )
}
