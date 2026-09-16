// Zod schema mirrors src/lib/reportSchema.ts — kept separate because Edge
// Functions run on Deno and don't share a bundler with the frontend.
import { z } from 'npm:zod@3'

export const CATEGORY_KEYS = [
  'Market readiness',
  'Execution',
  'Operations',
  'Financial discipline',
  'Team and process',
  'Technology',
  'Scale readiness',
] as const

const categoryScoresSchema = z.object({
  'Market readiness': z.number().min(0).max(100),
  Execution: z.number().min(0).max(100),
  Operations: z.number().min(0).max(100),
  'Financial discipline': z.number().min(0).max(100),
  'Team and process': z.number().min(0).max(100),
  Technology: z.number().min(0).max(100),
  'Scale readiness': z.number().min(0).max(100),
})

const categoryNarrativesSchema = z.object({
  'Market readiness': z.string().min(1),
  Execution: z.string().min(1),
  Operations: z.string().min(1),
  'Financial discipline': z.string().min(1),
  'Team and process': z.string().min(1),
  Technology: z.string().min(1),
  'Scale readiness': z.string().min(1),
})

export const reportSchema = z.object({
  overallReadiness: z.number().min(0).max(100),
  categories: categoryScoresSchema,
  summary: z.string().min(1),
  topStrengths: z.array(z.string().min(1)).min(1),
  keyGaps: z.array(z.string().min(1)).min(1),
  priorityActions: z.array(z.string().min(1)).min(1),
  nextSteps: z.array(z.string().min(1)).min(1),
  benchmarkNote: z.string().min(1),
  categoryNarratives: categoryNarrativesSchema,
  recommendedFocusArea: z.string().min(1),
})

export type ReportData = z.infer<typeof reportSchema>

export const submissionSchema = z.object({
  businessName: z.string().min(1),
  sector: z.string().min(1),
  stage: z.enum(['Idea', 'Execution', 'Scale']),
  yearsInOperation: z.string().optional().default(''),
  teamSize: z.string().optional().default(''),
  revenueRange: z.string().min(1),
  customerType: z.enum(['B2B', 'B2C', 'Both']),
  processesDocumented: z.enum(['Yes', 'Partial', 'No']),
  financialPlanning: z.enum(['Yes', 'Partial', 'No']),
  techMaturity: z.string().min(1),
  biggestChallenge: z.string().min(1),
  growthGoal: z.string().optional().default(''),
  shareWithOrganizers: z.boolean().optional().default(true),
  contactName: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z
    .string()
    .min(1)
    .regex(/^[+]?[\d\s-()]{10,15}$/, 'Invalid phone number'),
  consentFollowup: z.boolean().optional().default(false),
})

export type SubmissionInput = z.infer<typeof submissionSchema>

// The JSON Schema Gemini's structured output config needs (responseSchema).
// Kept hand-written (not derived from zod) since Gemini's schema dialect is
// a restricted subset of OpenAPI 3.0, not JSON Schema.
export const geminiResponseSchema = {
  type: 'object',
  properties: {
    overallReadiness: { type: 'integer' },
    categories: {
      type: 'object',
      properties: Object.fromEntries(
        CATEGORY_KEYS.map((k) => [k, { type: 'integer' }]),
      ),
      required: [...CATEGORY_KEYS],
    },
    summary: { type: 'string' },
    topStrengths: { type: 'array', items: { type: 'string' } },
    keyGaps: { type: 'array', items: { type: 'string' } },
    priorityActions: { type: 'array', items: { type: 'string' } },
    nextSteps: { type: 'array', items: { type: 'string' } },
    benchmarkNote: { type: 'string' },
    categoryNarratives: {
      type: 'object',
      properties: Object.fromEntries(
        CATEGORY_KEYS.map((k) => [k, { type: 'string' }]),
      ),
      required: [...CATEGORY_KEYS],
    },
    recommendedFocusArea: { type: 'string' },
  },
  required: [
    'overallReadiness',
    'categories',
    'summary',
    'topStrengths',
    'keyGaps',
    'priorityActions',
    'nextSteps',
    'benchmarkNote',
    'categoryNarratives',
    'recommendedFocusArea',
  ],
}
