import { supabase } from './supabaseClient'
import { reportSchema, type ReportData } from './reportSchema'
import type { SubmissionFormData } from './submissionTypes'

export interface GenerateReportResult {
  reportId: string
  submissionId: string
  report: ReportData
}

export async function generateReport(
  formData: SubmissionFormData,
): Promise<GenerateReportResult> {
  const { data, error } = await supabase.functions.invoke('generate-report', {
    body: {
      businessName: formData.businessName,
      sector: formData.sector,
      stage: formData.stage,
      yearsInOperation: formData.yearsInOperation,
      teamSize: formData.teamSize,
      revenueRange: formData.revenueRange,
      customerType: formData.customerType,
      processesDocumented: formData.processesDocumented,
      financialPlanning: formData.financialPlanning,
      techMaturity: formData.techMaturity,
      biggestChallenge: formData.biggestChallenge,
      growthGoal: formData.growthGoal,
      shareWithOrganizers: formData.shareWithOrganizers,
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      consentFollowup: formData.consentFollowup,
    },
  })

  if (error) {
    throw new Error(
      'Could not generate the report, please try again.',
    )
  }

  if (!data || !data.reportId || !data.submissionId) {
    throw new Error('Could not generate the report, please try again.')
  }

  const parsed = reportSchema.safeParse(data.report)
  if (!parsed.success) {
    throw new Error('Could not generate the report, please try again.')
  }

  return {
    reportId: data.reportId,
    submissionId: data.submissionId,
    report: parsed.data,
  }
}
