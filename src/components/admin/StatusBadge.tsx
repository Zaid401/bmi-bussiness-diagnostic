import type { FollowupStatus } from '../../lib/adminTypes'

const STATUS_STYLES: Record<FollowupStatus, string> = {
  New: 'bg-gray-100 text-gray-700',
  Contacted: 'bg-blue-100 text-blue-800',
  'In conversation': 'bg-amber-100 text-amber-800',
  'Not interested': 'bg-red-100 text-red-700',
  Converted: 'bg-emerald-100 text-emerald-800',
}

export default function StatusBadge({ status }: { status: FollowupStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  )
}
