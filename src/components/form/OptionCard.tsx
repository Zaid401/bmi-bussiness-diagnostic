interface OptionCardProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  selected: boolean
  onClick: () => void
}

export default function OptionCard({
  icon,
  title,
  subtitle,
  selected,
  onClick,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-xl border p-3 text-left transition ${
        selected
          ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center [&>svg]:h-5 [&>svg]:w-5 ${selected ? 'text-indigo-600' : 'text-gray-400'}`}
      >
        {icon}
      </span>
      <p
        className={`mt-1.5 text-sm font-semibold ${
          selected ? 'text-indigo-700' : 'text-gray-900'
        }`}
      >
        {title}
      </p>
      {subtitle && (
        <p
          className={`text-xs ${selected ? 'text-indigo-500' : 'text-gray-400'}`}
        >
          {subtitle}
        </p>
      )}
    </button>
  )
}
