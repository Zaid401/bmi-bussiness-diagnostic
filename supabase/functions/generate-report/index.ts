// Supabase Edge Function: generate-report
// Receives submission form data, calls Gemini for a structured diagnostic
// report, validates it, writes submission + report rows using the service
// role key, and returns the report to the client. The Gemini API key never
// reaches the browser — it only exists as an Edge Function secret.
import { createClient } from 'jsr:@supabase/supabase-js@2'
import {
  submissionSchema,
  reportSchema,
  geminiResponseSchema,
} from './schema.ts'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const GEMINI_MODEL = Deno.env.get('GEMINI_MODEL') ?? 'gemini-2.5-flash'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

const SYSTEM_INSTRUCTION = `You are a business analyst producing a diagnostic report for a small or growing
business at a corporate forum. Respond with ONLY valid JSON matching the given
schema — no markdown fences, no preamble. Base every score and observation
strictly on the inputs given. Be specific and honest, not generic or flattering.
Scores must vary meaningfully based on stage, revenue, process maturity and
financial discipline — a pre-revenue idea-stage business should score lower on
financial discipline and scale readiness than a scale-stage business with
integrated systems and documented processes.`

function buildUserContent(submission: ReturnType<typeof submissionSchema.parse>) {
  return `Business name: ${submission.businessName}
Sector: ${submission.sector}
Stage: ${submission.stage}
Years in operation: ${submission.yearsInOperation || 'Not specified'}
Team size: ${submission.teamSize || 'Not specified'}
Monthly revenue range: ${submission.revenueRange}
Primary customer type: ${submission.customerType}
Processes documented: ${submission.processesDocumented}
Financial planning tracked: ${submission.financialPlanning}
Systems/tools maturity: ${submission.techMaturity}
Biggest current challenge: ${submission.biggestChallenge}
12-month growth goal: ${submission.growthGoal || 'Not specified'}`
}

async function callGemini(userContent: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userContent }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: geminiResponseSchema,
      },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gemini API error (${res.status}): ${text}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error('Gemini returned no content')
  }

  return JSON.parse(text)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  if (!GEMINI_API_KEY) {
    return jsonResponse(
      { error: 'Server misconfigured: missing GEMINI_API_KEY secret.' },
      500,
    )
  }

  let rawBody: unknown
  try {
    rawBody = await req.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400)
  }

  const submissionParse = submissionSchema.safeParse(rawBody)
  if (!submissionParse.success) {
    return jsonResponse(
      {
        error: 'Invalid submission data.',
        details: submissionParse.error.flatten(),
      },
      422,
    )
  }
  const submission = submissionParse.data

  let reportJson: unknown
  try {
    reportJson = await callGemini(buildUserContent(submission))
  } catch (err) {
    console.error('Gemini call failed:', err)
    return jsonResponse(
      { error: 'Could not generate the report, please try again.' },
      502,
    )
  }

  const reportParse = reportSchema.safeParse(reportJson)
  if (!reportParse.success) {
    console.error('Gemini output failed validation:', reportParse.error.flatten())
    return jsonResponse(
      { error: 'Could not generate the report, please try again.' },
      422,
    )
  }
  const report = reportParse.data

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const { data: submissionRow, error: submissionError } = await supabaseAdmin
    .from('submissions')
    .insert({
      business_name: submission.businessName,
      sector: submission.sector,
      stage: submission.stage,
      years_in_operation: submission.yearsInOperation || null,
      team_size: submission.teamSize || null,
      revenue_range: submission.revenueRange,
      customer_type: submission.customerType,
      processes_documented: submission.processesDocumented,
      financial_planning: submission.financialPlanning,
      tech_maturity: submission.techMaturity,
      biggest_challenge: submission.biggestChallenge,
      growth_goal: submission.growthGoal || null,
      share_with_organizers: submission.shareWithOrganizers,
      contact_name: submission.contactName,
      contact_email: submission.contactEmail,
      contact_phone: submission.contactPhone || null,
      consent_followup: submission.consentFollowup,
    })
    .select('id')
    .single()

  if (submissionError || !submissionRow) {
    console.error('Failed to insert submission:', submissionError)
    return jsonResponse(
      { error: 'Could not save your submission, please try again.' },
      500,
    )
  }

  const { data: reportRow, error: reportError } = await supabaseAdmin
    .from('reports')
    .insert({
      submission_id: submissionRow.id,
      overall_readiness: report.overallReadiness,
      categories: report.categories,
      summary: report.summary,
      top_strengths: report.topStrengths,
      key_gaps: report.keyGaps,
      priority_actions: report.priorityActions,
      next_steps: report.nextSteps,
      benchmark_note: report.benchmarkNote,
      category_narratives: report.categoryNarratives,
      recommended_focus_area: report.recommendedFocusArea,
    })
    .select('id')
    .single()

  if (reportError || !reportRow) {
    console.error('Failed to insert report:', reportError)
    return jsonResponse(
      { error: 'Could not save your report, please try again.' },
      500,
    )
  }

  return jsonResponse({
    reportId: reportRow.id,
    submissionId: submissionRow.id,
    report,
  })
})
