import { Search, Bell } from 'lucide-react'

interface DashboardTopBarProps {
  userEmail: string
  search: string
  onSearchChange: (v: string) => void
  onSignOut: () => void
}

export default function DashboardTopBar({
  userEmail,
  search,
  onSearchChange,
  onSignOut,
}: DashboardTopBarProps) {
  const initials = userEmail.slice(0, 2).toUpperCase()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
            </svg>
          </span>
          <span className="hidden text-sm font-semibold text-gray-900 sm:inline">
            BMI <span className="text-indigo-600">Business Diagnostic</span>
          </span>
          <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 md:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live Feed Active
          </span>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Quick find submissions, founders, records…"
              className="min-h-10 w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="relative rounded-full p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" aria-hidden="true" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-600" />
          </button>

          <div className="hidden items-center gap-2.5 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
              {initials}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium text-gray-900">{userEmail.split('@')[0]}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="min-h-9 shrink-0 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
