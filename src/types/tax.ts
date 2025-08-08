export interface TaxFormData {
  income: number
  deductions: Deduction[]
  filingStatus: 'SINGLE' | 'MARRIED' | 'HEAD_OF_HOUSEHOLD' | 'QUALIFYING_WIDOW'
  state?: string
  salesAmount?: number
  taxYear: number
}

export interface TaxCalculation {
  grossIncome: number
  adjustedGrossIncome: number
  taxableIncome: number
  taxOwed: number
  refund: number
  effectiveRate: number
  stateTax?: number
  salesTax?: number
  totalTax?: number
  breakdown: TaxBreakdown
  confidence?: number
  recommendations?: string[]
}

export interface TaxBreakdown {
  federalTax: number
  stateTax: number
  localTax: number
  credits: number
}

export interface Deduction {
  id: string
  type: DeductionType
  amount: number
  description: string
  isEligible: boolean
}

export type DeductionType = 
  | 'STANDARD_DEDUCTION'
  | 'ITEMIZED_DEDUCTION'
  | 'BUSINESS_EXPENSE'
  | 'CHARITABLE_CONTRIBUTION'
  | 'MORTGAGE_INTEREST'
  | 'PROPERTY_TAX'
  | 'MEDICAL_EXPENSE'
  | 'STATE_TAX'
  | 'LOCAL_TAX'
  | 'STUDENT_LOAN_INTEREST'
  | 'HSA_CONTRIBUTION'
  | 'IRA_CONTRIBUTION'
  | '401K_CONTRIBUTION'

export interface ValidationResult {
  validDeductions: Deduction[]
  invalidDeductions: Deduction[]
  totalValidAmount: number
  totalInvalidAmount: number
}

export interface TaxRates {
  year: number
  brackets: {
    SINGLE: TaxBracket[]
    MARRIED: TaxBracket[]
    HEAD_OF_HOUSEHOLD: TaxBracket[]
    QUALIFYING_WIDOW: TaxBracket[]
  }
}

export interface TaxBracket {
  rate: number
  max: number
}

export interface EstimatedTax {
  quarterlyAmount: number
  annualAmount: number
  dueDates: string[]
}

export interface TaxForm {
  id: string
  formType: string
  taxYear: number
  status: TaxFormStatus
  clientId: string
  userId: string
  data: TaxFormData
  calculation?: TaxCalculation
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type TaxFormStatus = 
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'FINALIZED'
  | 'SUBMITTED'
  | 'ACCEPTED'
  | 'REJECTED'

export interface TaxDocument {
  id: string
  name: string
  fileUrl: string
  fileType: string
  description?: string
  status: DocumentStatus
  clientId: string
  taxFormId?: string
  uploadedBy: string
  createdAt: Date
  updatedAt: Date
}

export type DocumentStatus = 
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'COMPLETED'

export interface TaxClient {
  id: string
  name: string
  email: string
  phone?: string
  companyName?: string
  taxId?: string
  filingStatus?: string
  dependents?: number
  previousYearIncome?: number
  previousYearRefund?: number
  estimatedTaxPayments?: number
  isActive: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface TaxDeadline {
  id: string
  deadlineType: string
  dueDate: Date
  description: string
  clientId: string
  isCompleted: boolean
  daysRemaining: number
  userId: string
  createdAt: Date
  updatedAt: Date
} 
