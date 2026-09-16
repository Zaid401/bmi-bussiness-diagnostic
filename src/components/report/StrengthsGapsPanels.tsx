interface StrengthsGapsPanelsProps {
  topStrengths: string[]
  keyGaps: string[]
}

export default function StrengthsGapsPanels({
  topStrengths,
  keyGaps,
}: StrengthsGapsPanelsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
          Top strengths
        </h3>
        <ul className="mt-3 space-y-3">
          {topStrengths.map((s, i) => (
            <li key={i} className="text-sm text-emerald-900">
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-800">
          Key gaps
        </h3>
        <ul className="mt-3 space-y-3">
          {keyGaps.map((g, i) => (
            <li key={i} className="text-sm text-amber-900">
              {g}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
