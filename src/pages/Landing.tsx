import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <main className="min-h-svh flex flex-col items-center justify-center px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
          BMI Growth Forum
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl">
          BMI Business Diagnostic
        </h1>
        <p className="mt-4 text-base text-gray-600">
          Answer a few quick questions about your business and get an
          AI-generated readiness report you can download and share.
        </p>
        <Link
          to="/diagnostic"
          className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-lg bg-indigo-600 px-6 text-base font-medium text-white transition hover:bg-indigo-700 sm:w-auto"
        >
          Start diagnostic
        </Link>

        <Link
          to="/admin/login"
          className="mt-4 block text-sm text-gray-400 hover:text-gray-600"
        >
          Staff login
        </Link>
      </div>
    </main>
  )
}
