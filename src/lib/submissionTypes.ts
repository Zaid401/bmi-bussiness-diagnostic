export const SECTORS = [
  'Technology & Digital Business',
  'Logistics & Supply Chain',
  'FMCG & Consumer Business',
  'Manufacturing & Industrial',
  'Retail & Commerce',
  'Business & Professional Services',
  'Hospitality & Food Services',
  'Real Estate & Infrastructure',
  'Agribusiness',
  'Automotive & Mobility',
] as const

export const STAGES = ['Idea', 'Execution', 'Scale'] as const

export const REVENUE_RANGES = [
  'Pre-revenue',
  'Under ₹50,000/mo',
  '₹50,000 - ₹2,00,000/mo',
  '₹2,00,000 - ₹10,00,000/mo',
  '₹10,00,000 - ₹50,00,000/mo',
  'Over ₹50,00,000/mo',
] as const

export const CUSTOMER_TYPES = ['B2B', 'B2C', 'Both'] as const

export const YES_PARTIAL_NO = ['Yes', 'Partial', 'No'] as const

export const TEAM_SIZES = [
  'Just me',
  '2-5',
  '6-15',
  '16-50',
  '50+',
] as const

export const YEARS_IN_OPERATION = [
  'Not yet launched',
  'Under 1 year',
  '1-3 years',
  '3-7 years',
  '7+ years',
] as const

export const TECH_MATURITY = [
  'No dedicated tools/systems',
  'Basic tools (spreadsheets, WhatsApp)',
  'Some integrated software (CRM, accounting)',
  'Fully integrated systems across the business',
] as const

export type Sector = (typeof SECTORS)[number]
export type Stage = (typeof STAGES)[number]
export type CustomerType = (typeof CUSTOMER_TYPES)[number]
export type YesPartialNo = (typeof YES_PARTIAL_NO)[number]

export interface SubmissionFormData {
  businessName: string
  sector: Sector | ''
  stage: Stage | ''
  yearsInOperation: string
  teamSize: string
  revenueRange: string
  customerType: CustomerType | ''
  processesDocumented: YesPartialNo | ''
  financialPlanning: YesPartialNo | ''
  techMaturity: string
  biggestChallenge: string
  growthGoal: string
  shareWithOrganizers: boolean
  contactName: string
  contactEmail: string
  contactPhone: string
  consentFollowup: boolean
}

export const emptySubmissionFormData: SubmissionFormData = {
  businessName: '',
  sector: '',
  stage: '',
  yearsInOperation: '',
  teamSize: '',
  revenueRange: '',
  customerType: '',
  processesDocumented: '',
  financialPlanning: '',
  techMaturity: '',
  biggestChallenge: '',
  growthGoal: '',
  shareWithOrganizers: true,
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  consentFollowup: false,
}
