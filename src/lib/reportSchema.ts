import { z } from 'zod'

export const CATEGORY_KEYS = [
  'Market readiness',
  'Execution',
  'Operations',
  'Financial discipline',
  'Team and process',
  'Technology',
  'Scale readiness',
] as const

export type CategoryKey = (typeof CATEGORY_KEYS)[number]

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

export const scoreBand = (score: number): string => {
  if (score >= 85) return 'Ready to scale'
  if (score >= 70) return 'Building momentum'
  if (score >= 50) return 'Finding its footing'
  return 'Early foundations'
}
