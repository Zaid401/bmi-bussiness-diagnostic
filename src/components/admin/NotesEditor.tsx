import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { FOLLOWUP_STATUSES, type FollowupStatus } from '../../lib/adminTypes'

interface NotesEditorProps {
  submissionId: string
  initialStatus: FollowupStatus
  initialNotes: string | null
  initialNextFollowupDate: string | null
  onSaved: (update: {
    status: FollowupStatus
    notes: string | null
    next_followup_date: string | null
    followup_id: string
  }) => void
}

export default function NotesEditor({
  submissionId,
  initialStatus,
  initialNotes,
  initialNextFollowupDate,
  onSaved,
}: NotesEditorProps) {
  const [status, setStatus] = useState<FollowupStatus>(initialStatus)
  const [notes, setNotes] = useState(initialNotes ?? '')
  const [nextDate, setNextDate] = useState(initialNextFollowupDate ?? '')
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const save = async (overrides?: Partial<{ status: FollowupStatus; notes: string; nextDate: string }>) => {
    const payload = {
      submission_id: submissionId,
      status: overrides?.status ?? status,
      notes: (overrides?.notes ?? notes) || null,
      next_followup_date: (overrides?.nextDate ?? nextDate) || null,
      updated_at: new Date().toISOString(),
    }

    setSaving(true)
    setError(null)

    const { data, error: saveError } = await supabase
      .from('admin_followups')
      .upsert(payload, { onConflict: 'submission_id' })
      .select('id, status, notes, next_followup_date')
      .single()

    setSaving(false)

    if (saveError || !data) {
      setError('Could not save. Please try again.')
      return
    }

    setSavedAt(new Date())
    onSaved({
      followup_id: data.id,
      status: data.status,
      notes: data.notes,
      next_followup_date: data.next_followup_date,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => {
            const value = e.target.value as FollowupStatus
            setStatus(value)
            void save({ status: value })
          }}
          className="mt-1.5 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          {FOLLOWUP_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Next follow-up date
        </label>
        <input
          type="date"
          value={nextDate}
          onChange={(e) => setNextDate(e.target.value)}
          onBlur={() => void save()}
          className="mt-1.5 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Notes
        </label>
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => void save()}
          placeholder="Internal notes about this lead…"
          className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        {error && <span className="text-red-600">{error}</span>}
        {!error && saving && <span className="text-gray-400">Saving…</span>}
        {!error && !saving && savedAt && (
          <span className="text-emerald-600">Saved {savedAt.toLocaleTimeString()}</span>
        )}
      </div>
    </div>
  )
}
