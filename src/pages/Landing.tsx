import { Link } from 'react-router-dom'
import { Star, Zap, BarChart3, FileText, ArrowRight, Lock } from 'lucide-react'
import DiagnosticTopBar from '../components/form/DiagnosticTopBar'

const FEATURES = [
  {
    icon: Zap,
    title: 'Takes ~2 minutes',
    description: 'Fast 4-step interactive guided assessment',
  },
  {
    icon: BarChart3,
    title: 'Instant Readiness Score',
    description: 'Benchmark strategy, traction & execution',
  },
  {
    icon: FileText,
    title: 'Downloadable PDF Report',
    description: 'Investor-ready summary customized to your niche',
  },
]

export default function Landing() {
  return (
    <main className="min-h-svh bg-gradient-to-b from-indigo-50/60 via-white to-white">
      <div className="mx-auto max-w-2xl px-4 pt-5 sm:px-6 lg:px-8">
        <DiagnosticTopBar subtitle="BMI Growth Forum" />
      </div>

      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 pb-16 pt-10 text-center sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          <Star className="h-3 w-3 fill-indigo-700" aria-hidden="true" />
          BMI GROWTH FORUM
        </span>

        <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          BMI Business
          <br />
          <span className="text-indigo-600">Diagnostic</span>
        </h1>

        <p className="mt-4 max-w-md text-base text-gray-600">
          Answer a few quick questions about your business and get an
          AI-generated readiness report you can download and share.
        </p>

        <div className="mt-8 w-full space-y-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-[11px] font-semibold text-white">
                MK
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-violet-600 text-[11px] font-semibold text-white">
                AC
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-800 text-[11px] font-semibold text-white">
                JN
              </span>
            </div>
            <span className="text-sm text-gray-600">500+ founders evaluated</span>
          </div>
          <span className="flex items-center gap-1 text-sm font-semibold text-gray-900">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            4.9/5
          </span>
        </div>

        <Link
          to="/diagnostic"
          className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Start diagnostic
          <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
        </Link>

        <Link
          to="/admin/login"
          className="mt-4 text-sm font-medium text-gray-400 hover:text-gray-600"
        >
          Staff login
        </Link>

        <p className="mt-6 flex items-center gap-1.5 text-xs text-gray-400">
          <Lock className="h-3 w-3" aria-hidden="true" />
          256-bit encrypted · 100% confidential · Free
        </p>
      </div>
    </main>
  )
}
