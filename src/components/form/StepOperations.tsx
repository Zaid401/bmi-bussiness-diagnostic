import { CheckCircle2, CircleDashed, XCircle, Settings } from 'lucide-react'
import type { SubmissionFormData } from '../../lib/submissionTypes'
import { YES_PARTIAL_NO, TECH_MATURITY } from '../../lib/submissionTypes'
import { inputWithIconClass, labelClass, errorClass } from './fieldStyles'
import OptionCard from './OptionCard'

interface StepOperationsProps {
  data: SubmissionFormData
  errors: Partial<Record<keyof SubmissionFormData, string>>
  onChange: <K extends keyof SubmissionFormData>(
    field: K,
    value: SubmissionFormData[K],
  ) => void
}

const YES_PARTIAL_NO_INFO: Record<string, { icon: React.ReactNode; subtitle: string }> = {
  Yes: { icon: <CheckCircle2 />, subtitle: 'Fully in place' },
  Partial: { icon: <CircleDashed />, subtitle: 'Somewhat in place' },
  No: { icon: <XCircle />, subtitle: 'Not yet' },
}

function YesPartialNoPicker({
  label,
  value,
  onSelect,
  error,
}: {
  label: string
  value: string
  onSelect: (v: (typeof YES_PARTIAL_NO)[number]) => void
  error?: string
}) {
  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="mt-1.5 grid grid-cols-3 gap-2">
        {YES_PARTIAL_NO.map((opt) => (
          <OptionCard
            key={opt}
            icon={YES_PARTIAL_NO_INFO[opt].icon}
            title={opt}
            subtitle={YES_PARTIAL_NO_INFO[opt].subtitle}
            selected={value === opt}
            onClick={() => onSelect(opt)}
          />
        ))}
      </div>
      {error && <p className={errorClass}>{error}</p>}
    </div>
  )
}

export default function StepOperations({
  data,
  errors,
  onChange,
}: StepOperationsProps) {
  return (
    <div className="space-y-6">
      <YesPartialNoPicker
        label="Are your business processes documented?"
        value={data.processesDocumented}
        onSelect={(v) => onChange('processesDocumented', v)}
        error={errors.processesDocumented}
      />

      <YesPartialNoPicker
        label="Do you track financial planning (budgets, forecasts)?"
        value={data.financialPlanning}
        onSelect={(v) => onChange('financialPlanning', v)}
        error={errors.financialPlanning}
      />

      <div>
        <label htmlFor="techMaturity" className={labelClass}>
          Systems / tools maturity
        </label>
        <div className="relative">
          <Settings
            className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <select
            id="techMaturity"
            className={`${inputWithIconClass} appearance-none`}
            value={data.techMaturity}
            onChange={(e) => onChange('techMaturity', e.target.value)}
          >
            <option value="">Select an option</option>
            {TECH_MATURITY.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        {errors.techMaturity && <p className={errorClass}>{errors.techMaturity}</p>}
      </div>
    </div>
  )
}
