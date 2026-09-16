import { Search } from 'lucide-react'

interface SearchBoxProps {
  value: string
  onChange: (v: string) => void
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="relative flex-1">
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search business, contact name, or email…"
        className="min-h-11 w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
      />
    </div>
  )
}
