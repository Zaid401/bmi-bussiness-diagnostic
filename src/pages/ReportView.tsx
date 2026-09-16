import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReadinessRing from '../components/report/ReadinessRing'
import CategoryBars from '../components/report/CategoryBars'
import StrengthsGapsPanels from '../components/report/StrengthsGapsPanels'
import PriorityActions from '../components/report/PriorityActions'
import { reportSchema, type ReportData } from '../lib/reportSchema'
import type { SubmissionFormData } from '../lib/submissionTypes'
import { buildReportPdf } from '../components/pdf/buildReportPdf'
import { uploadReportPdf } from '../lib/uploadReportPdf'

interface StoredReport {
  report: ReportData
  submission: SubmissionFormData
}

export default function ReportView() {
  const { reportId } = useParams<{ reportId: string }>()
  const [stored, setStored] = useState<StoredReport | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (!reportId) return
    const raw = sessionStorage.getItem(`report:${reportId}`)
    if (!raw) {
      setNotFound(true)
      return
    }
    try {
      const parsed = JSON.parse(raw)
      const result = reportSchema.safeParse(parsed.report)
      if (!result.success) {
        setNotFound(true)
        return
      }
      setStored({ report: result.data, submission: parsed.submission })
    } catch {
      setNotFound(true)
    }
  }, [reportId])

  if (notFound) {
    return (
      <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center px-4 text-center">
        <h1 className="text-xl font-semibold text-gray-900">
          Report not found
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          This report is only available in the browser session it was
          created in. Please complete the diagnostic again.
        </p>
        <Link
          to="/diagnostic"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-indigo-600 px-6 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Start diagnostic
        </Link>
      </main>
    )
  }

  if (!stored) {
    return (
      <main className="flex min-h-svh items-center justify-center px-4">
        <p className="text-sm text-gray-500">Loading report…</p>
      </main>
    )
  }

  const { report, submission } = stored

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const blob = await buildReportPdf(report, submission)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${submission.businessName || 'business'}-diagnostic-report.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      if (reportId) {
        void uploadReportPdf(reportId, blob)
      }
    } finally {
      setDownloading(false)
    }
  }

  return (
    <main className="mx-auto min-h-svh max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            {submission.sector} · {submission.stage}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900 sm:text-3xl">
            {submission.businessName}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-indigo-600 px-6 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 sm:w-auto"
        >
          {downloading ? 'Preparing PDF…' : 'Download PDF'}
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
        <ReadinessRing score={report.overallReadiness} />
        <p className="text-base leading-relaxed text-gray-700">
          {report.summary}
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">
          Category breakdown
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CategoryBars categories={report.categories} variant="bar" />
          <CategoryBars categories={report.categories} variant="radar" />
        </div>
      </section>

      <section className="mt-10">
        <StrengthsGapsPanels
          topStrengths={report.topStrengths}
          keyGaps={report.keyGaps}
        />
      </section>

      <section className="mt-10 rounded-xl border border-gray-200 p-4 sm:p-6">
        <PriorityActions
          priorityActions={report.priorityActions}
          nextSteps={report.nextSteps}
          recommendedFocusArea={report.recommendedFocusArea}
          benchmarkNote={report.benchmarkNote}
        />
      </section>
    </main>
  )
}
