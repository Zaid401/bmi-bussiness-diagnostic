import type { SubmissionFormData } from './submissionTypes'

type Errors = Partial<Record<keyof SubmissionFormData, string>>

export function validateStep(step: number, data: SubmissionFormData): Errors {
  const errors: Errors = {}

  if (step === 1) {
    if (!data.businessName.trim()) errors.businessName = 'Business name is required.'
    if (!data.sector) errors.sector = 'Please select a sector.'
    if (!data.stage) errors.stage = 'Please select a stage.'
  }

  if (step === 2) {
    if (!data.revenueRange) errors.revenueRange = 'Please select a revenue range.'
    if (!data.customerType) errors.customerType = 'Please select a customer type.'
  }

  if (step === 3) {
    if (!data.processesDocumented)
      errors.processesDocumented = 'Please select an option.'
    if (!data.financialPlanning)
      errors.financialPlanning = 'Please select an option.'
    if (!data.techMaturity) errors.techMaturity = 'Please select an option.'
  }

  if (step === 4) {
    if (!data.biggestChallenge.trim())
      errors.biggestChallenge = 'Please describe your biggest challenge.'
    if (!data.contactName.trim())
      errors.contactName = 'Contact person name is required.'
    if (!data.contactEmail.trim()) {
      errors.contactEmail = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail.trim())) {
      errors.contactEmail = 'Enter a valid email address.'
    }
    if (!data.contactPhone.trim()) {
      errors.contactPhone = 'Phone number is required.'
    } else if (!/^[+]?[\d\s-()]{10,15}$/.test(data.contactPhone.trim())) {
      errors.contactPhone = 'Enter a valid phone number (at least 10 digits).'
    } else if (data.contactPhone.replace(/\D/g, '').length < 10) {
      errors.contactPhone = 'Enter a valid phone number (at least 10 digits).'
    }
  }

  return errors
}
