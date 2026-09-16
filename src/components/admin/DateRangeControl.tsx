import { Calendar } from 'lucide-react'

interface DateRangeControlProps {
  dateFrom: string
  dateTo: string
  onFromChange: (v: string) => void
  onToChange: (v: string) => void
}

export default function DateRangeControl({
  dateFrom,
  dateTo,
  onFromChange,
  onToChange,
}: DateRangeControlProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
      <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => onFromChange(e.target.value)}
        aria-label="Submitted from"
        className="min-h-8 border-0 p-0 text-sm text-gray-700 focus:outline-none focus:ring-0"
      />
      <span className="text-xs text-gray-400">to</span>
      <input
        type="date"
        value={dateTo}
        onChange={(e) => onToChange(e.target.value)}
        aria-label="Submitted to"
        className="min-h-8 border-0 p-0 text-sm text-gray-700 focus:outline-none focus:ring-0"
      />
    </div>
  )
}
