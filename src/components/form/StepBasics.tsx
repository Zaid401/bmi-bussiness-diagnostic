import { Building2, LayoutGrid, Clock, Users, Lightbulb, Code2, TrendingUp } from 'lucide-react'
import type { SubmissionFormData, Stage } from '../../lib/submissionTypes'
import {
  SECTORS,
  STAGES,
  YEARS_IN_OPERATION,
  TEAM_SIZES,
} from '../../lib/submissionTypes'
import { inputWithIconClass, labelClass, errorClass } from './fieldStyles'
import OptionCard from './OptionCard'

interface StepBasicsProps {
  data: SubmissionFormData
  errors: Partial<Record<keyof SubmissionFormData, string>>
  onChange: <K extends keyof SubmissionFormData>(
    field: K,
    value: SubmissionFormData[K],
  ) => void
}

const STAGE_INFO: Record<Stage, { icon: React.ReactNode; subtitle: string }> = {
  Idea: { icon: <Lightbulb />, subtitle: 'Concept & Validation' },
  Execution: { icon: <Code2 />, subtitle: 'Early Revenue' },
  Scale: { icon: <TrendingUp />, subtitle: 'Expansion' },
}

export default function StepBasics({ data, errors, onChange }: StepBasicsProps) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="businessName" className={labelClass}>
          Business name
        </label>
        <div className="relative">
          <Building2
            className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="businessName"
            type="text"
            className={inputWithIconClass}
            value={data.businessName}
            onChange={(e) => onChange('businessName', e.target.value)}
            placeholder="e.g. Acme Logistics"
          />
        </div>
        {errors.businessName && <p className={errorClass}>{errors.businessName}</p>}
      </div>

      <div>
        <label htmlFor="sector" className={labelClass}>
          Sector
        </label>
        <div className="relative">
          <LayoutGrid
            className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <select
            id="sector"
            className={`${inputWithIconClass} appearance-none`}
            value={data.sector}
            onChange={(e) => onChange('sector', e.target.value as SubmissionFormData['sector'])}
          >
            <option value="">Select a sector</option>
            {SECTORS.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>
        {errors.sector && <p className={errorClass}>{errors.sector}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className={labelClass}>Stage</span>
          <span className="text-xs text-gray-400">Select current status</span>
        </div>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {STAGES.map((stage) => (
            <OptionCard
              key={stage}
              icon={STAGE_INFO[stage].icon}
              title={stage}
              subtitle={STAGE_INFO[stage].subtitle}
              selected={data.stage === stage}
              onClick={() => onChange('stage', stage)}
            />
          ))}
        </div>
        {errors.stage && <p className={errorClass}>{errors.stage}</p>}
      </div>

      <div>
        <label htmlFor="yearsInOperation" className={labelClass}>
          Years in operation
        </label>
        <div className="relative">
          <Clock
            className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <select
            id="yearsInOperation"
            className={`${inputWithIconClass} appearance-none`}
            value={data.yearsInOperation}
            onChange={(e) => onChange('yearsInOperation', e.target.value)}
          >
            <option value="">Select an option</option>
            {YEARS_IN_OPERATION.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="teamSize" className={labelClass}>
          Team size
        </label>
        <div className="relative">
          <Users
            className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <select
            id="teamSize"
            className={`${inputWithIconClass} appearance-none`}
            value={data.teamSize}
            onChange={(e) => onChange('teamSize', e.target.value)}
          >
            <option value="">Select an option</option>
            {TEAM_SIZES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
