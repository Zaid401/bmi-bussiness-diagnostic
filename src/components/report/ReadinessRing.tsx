import { scoreBand } from '../../lib/reportSchema'

interface ReadinessRingProps {
  score: number
}

export default function ReadinessRing({ score }: ReadinessRingProps) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-44 w-44 sm:h-52 sm:w-52">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-semibold text-gray-900 sm:text-5xl">
            {score}
          </span>
          <span className="text-sm text-gray-500">/ 100</span>
        </div>
      </div>
      <p className="mt-3 text-lg font-medium text-gray-900">{scoreBand(score)}</p>
    </div>
  )
}
