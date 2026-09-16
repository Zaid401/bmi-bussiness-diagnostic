interface PriorityActionsProps {
  priorityActions: string[]
  nextSteps: string[]
  recommendedFocusArea: string
  benchmarkNote: string
}

export default function PriorityActions({
  priorityActions,
  nextSteps,
  recommendedFocusArea,
  benchmarkNote,
}: PriorityActionsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Priority actions
        </h3>
        <ol className="mt-3 space-y-3">
          {priorityActions.map((action, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-800">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                {i + 1}
              </span>
              <span className="pt-0.5">{action}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 sm:p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-800">
          Recommended focus area
        </h3>
        <p className="mt-2 text-sm text-indigo-900">{recommendedFocusArea}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Next steps
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          {nextSteps.map((step, i) => (
            <li key={i} className="text-sm text-gray-800">
              {step}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Benchmark
        </h3>
        <p className="mt-2 text-sm text-gray-600">{benchmarkNote}</p>
      </div>
    </div>
  )
}
