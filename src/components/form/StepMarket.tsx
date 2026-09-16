import { Wallet, Building2, User, Repeat } from 'lucide-react'
import type { SubmissionFormData } from '../../lib/submissionTypes'
import { REVENUE_RANGES, CUSTOMER_TYPES } from '../../lib/submissionTypes'
import { inputWithIconClass, labelClass, errorClass } from './fieldStyles'
import OptionCard from './OptionCard'

interface StepMarketProps {
  data: SubmissionFormData
  errors: Partial<Record<keyof SubmissionFormData, string>>
  onChange: <K extends keyof SubmissionFormData>(
    field: K,
    value: SubmissionFormData[K],
  ) => void
}

const CUSTOMER_TYPE_INFO: Record<string, { icon: React.ReactNode; subtitle: string }> = {
  B2B: { icon: <Building2 />, subtitle: 'Business to business' },
  B2C: { icon: <User />, subtitle: 'Business to consumer' },
  Both: { icon: <Repeat />, subtitle: 'Mixed customer base' },
}

export default function StepMarket({ data, errors, onChange }: StepMarketProps) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="revenueRange" className={labelClass}>
          Monthly revenue range
        </label>
        <div className="relative">
          <Wallet
            className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <select
            id="revenueRange"
            className={`${inputWithIconClass} appearance-none`}
            value={data.revenueRange}
            onChange={(e) => onChange('revenueRange', e.target.value)}
          >
            <option value="">Select a range</option>
            {REVENUE_RANGES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        {errors.revenueRange && <p className={errorClass}>{errors.revenueRange}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className={labelClass}>Primary customer type</span>
        </div>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {CUSTOMER_TYPES.map((type) => (
            <OptionCard
              key={type}
              icon={CUSTOMER_TYPE_INFO[type].icon}
              title={type}
              subtitle={CUSTOMER_TYPE_INFO[type].subtitle}
              selected={data.customerType === type}
              onClick={() => onChange('customerType', type)}
            />
          ))}
        </div>
        {errors.customerType && <p className={errorClass}>{errors.customerType}</p>}
      </div>
    </div>
  )
}
