import { UserRound, Mail, Phone } from 'lucide-react'
import type { SubmissionFormData } from '../../lib/submissionTypes'
import { inputClass, inputWithIconClass, labelClass, errorClass } from './fieldStyles'

interface StepGoalsProps {
  data: SubmissionFormData
  errors: Partial<Record<keyof SubmissionFormData, string>>
  onChange: <K extends keyof SubmissionFormData>(
    field: K,
    value: SubmissionFormData[K],
  ) => void
}

export default function StepGoals({ data, errors, onChange }: StepGoalsProps) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="biggestChallenge" className={labelClass}>
          Biggest current challenge
        </label>
        <textarea
          id="biggestChallenge"
          rows={4}
          className={`${inputClass} rounded-xl`}
          value={data.biggestChallenge}
          onChange={(e) => onChange('biggestChallenge', e.target.value)}
          placeholder="What's the single biggest obstacle to growth right now?"
        />
        {errors.biggestChallenge && (
          <p className={errorClass}>{errors.biggestChallenge}</p>
        )}
      </div>

      <div>
        <label htmlFor="growthGoal" className={labelClass}>
          12-month growth goal
        </label>
        <textarea
          id="growthGoal"
          rows={3}
          className={`${inputClass} rounded-xl`}
          value={data.growthGoal}
          onChange={(e) => onChange('growthGoal', e.target.value)}
          placeholder="Where do you want the business to be a year from now? (optional)"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
        <h3 className="text-sm font-semibold text-gray-900">Contact details</h3>
        <p className="mt-1 text-xs text-gray-500">
          So we can follow up with you after the event, if you'd like.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="contactName" className={labelClass}>
              Contact person name
            </label>
            <div className="relative">
              <UserRound
                className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="contactName"
                type="text"
                className={inputWithIconClass}
                value={data.contactName}
                onChange={(e) => onChange('contactName', e.target.value)}
                placeholder="Your name"
              />
            </div>
            {errors.contactName && <p className={errorClass}>{errors.contactName}</p>}
          </div>

          <div>
            <label htmlFor="contactEmail" className={labelClass}>
              Email
            </label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="contactEmail"
                type="email"
                className={inputWithIconClass}
                value={data.contactEmail}
                onChange={(e) => onChange('contactEmail', e.target.value)}
                placeholder="you@business.com"
              />
            </div>
            {errors.contactEmail && <p className={errorClass}>{errors.contactEmail}</p>}
          </div>

          <div>
            <label htmlFor="contactPhone" className={labelClass}>
              Phone number
            </label>
            <div className="relative">
              <Phone
                className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="contactPhone"
                type="tel"
                className={inputWithIconClass}
                value={data.contactPhone}
                onChange={(e) => onChange('contactPhone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
            {errors.contactPhone && <p className={errorClass}>{errors.contactPhone}</p>}
          </div>
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-3.5">
        <input
          type="checkbox"
          className="mt-0.5 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          checked={data.shareWithOrganizers}
          onChange={(e) => onChange('shareWithOrganizers', e.target.checked)}
        />
        <span className="text-sm text-gray-700">
          Share my business name and overall readiness score with event
          organizers so they can help route me to the right mentor. Your full
          report (summary, gaps, strengths) is <strong>not</strong> shared
          unless you check this box.
        </span>
      </label>

      <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-3.5">
        <input
          type="checkbox"
          className="mt-0.5 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          checked={data.consentFollowup}
          onChange={(e) => onChange('consentFollowup', e.target.checked)}
        />
        <span className="text-sm text-gray-700">
          BMI Growth may contact me after the event about business
          opportunities and mentorship.
        </span>
      </label>
    </div>
  )
}
