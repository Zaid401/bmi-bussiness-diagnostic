interface DiagnosticTopBarProps {
  subtitle?: string
}

export default function DiagnosticTopBar({ subtitle }: DiagnosticTopBarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
          </svg>
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-wide text-gray-900">
            BMI BUSINESS DIAGNOSTIC
          </p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>

      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        AI Engine Ready
      </span>
    </div>
  )
}
