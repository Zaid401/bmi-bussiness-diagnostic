import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Lock } from 'lucide-react'
import DiagnosticTopBar from '../components/form/DiagnosticTopBar'
import ProgressBar from '../components/form/ProgressBar'
import StepBasics from '../components/form/StepBasics'
import StepMarket from '../components/form/StepMarket'
import StepOperations from '../components/form/StepOperations'
import StepGoals from '../components/form/StepGoals'
import { validateStep } from '../lib/validateStep'
import { generateReport } from '../lib/generateReport'
import {
  emptySubmissionFormData,
  type SubmissionFormData,
} from '../lib/submissionTypes'

const STEP_LABELS = ['Basics', 'Market', 'Operations', 'Goals']
const TOTAL_STEPS = STEP_LABELS.length

export default function DiagnosticForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<SubmissionFormData>(emptySubmissionFormData)
  const [errors, setErrors] = useState<
    Partial<Record<keyof SubmissionFormData, string>>
  >({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = <K extends keyof SubmissionFormData>(
    field: K,
    value: SubmissionFormData[K],
  ) => {
    setData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleContinue = () => {
    const stepErrors = validateStep(step, data)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors({})
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      void handleSubmit()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    const stepErrors = validateStep(4, data)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await generateReport(data)
      sessionStorage.setItem(
        `report:${result.reportId}`,
        JSON.stringify({
          report: result.report,
          submission: data,
        }),
      )
      navigate(`/report/${result.reportId}`)
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Could not generate the report, please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-svh bg-gray-50 pb-28 sm:pb-8">
      <div className="mx-auto max-w-2xl px-4 pt-5 sm:px-6 lg:px-8">
        <DiagnosticTopBar />
      </div>

      <div className="mx-auto mt-6 max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                Business diagnostic
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Takes about 2 minutes. Answers power your AI-generated
                readiness report.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              {STEP_LABELS[step - 1]}
            </span>
          </div>

          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-400">
            Step {step} of {TOTAL_STEPS}
          </p>
          <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

          <div className="mt-8">
            {step === 1 && (
              <StepBasics data={data} errors={errors} onChange={handleChange} />
            )}
            {step === 2 && (
              <StepMarket data={data} errors={errors} onChange={handleChange} />
            )}
            {step === 3 && (
              <StepOperations data={data} errors={errors} onChange={handleChange} />
            )}
            {step === 4 && (
              <StepGoals data={data} errors={errors} onChange={handleChange} />
            )}
          </div>

          {submitError && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {submitError}
            </p>
          )}

          {/* Desktop/tablet inline controls */}
          <div className="mt-8 hidden items-center justify-between border-t border-gray-100 pt-6 sm:flex">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1 || submitting}
              className="min-h-11 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40"
            >
              Back
            </button>
            <div className="flex flex-col items-end gap-1.5">
              <button
                type="button"
                onClick={handleContinue}
                disabled={submitting}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting
                  ? 'Generating report…'
                  : step < TOTAL_STEPS
                    ? 'Continue'
                    : 'Get my report'}
                {!submitting && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </button>
              <p className="flex items-center gap-1 text-xs text-gray-400">
                <Lock className="h-3 w-3" aria-hidden="true" />
                256-bit encrypted · Auto-saves progress
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div
        className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white px-4 py-3 sm:hidden"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1 || submitting}
            className="min-h-11 flex-1 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={submitting}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting
              ? 'Generating…'
              : step < TOTAL_STEPS
                ? 'Continue'
                : 'Get my report'}
            {!submitting && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
        <p className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
          <Lock className="h-3 w-3" aria-hidden="true" />
          256-bit encrypted · Auto-saves progress
        </p>
      </div>
    </main>
  )
}
