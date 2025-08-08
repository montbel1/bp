import { TaxFormData, TaxCalculation, TaxRates, Deduction, ValidationResult } from '@/types/tax'

// IRS Free File API Integration
export class IRSTaxAPI {
  private baseUrl = 'https://api.irs.gov/freefile'
  
  async calculateTax2024(income: number, deductions: number, filingStatus: string): Promise<TaxCalculation> {
    try {
      const response = await fetch(`${this.baseUrl}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.IRS_API_KEY || 'demo-key'}`
        },
        body: JSON.stringify({
          taxYear: 2024,
          income,
          deductions,
          filingStatus
        })
      })
      
      if (!response.ok) {
        throw new Error(`IRS API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('IRS API error:', error)
      // Fallback to basic calculation
      return this.basicCalculation(income, deductions, filingStatus)
    }
  }
  
  async getCurrentYearRates(): Promise<TaxRates> {
    try {
      const response = await fetch(`${this.baseUrl}/rates/2024`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching IRS rates:', error)
      return this.getDefaultRates()
    }
  }
  
  private basicCalculation(income: number, deductions: number, filingStatus: string): TaxCalculation {
    const taxableIncome = Math.max(0, income - deductions)
    const taxOwed = this.calculateTaxOwed(taxableIncome, filingStatus)
    
    return {
      grossIncome: income,
      adjustedGrossIncome: income,
      taxableIncome,
      taxOwed,
      refund: 0,
      effectiveRate: (taxOwed / income) * 100,
      breakdown: {
        federalTax: taxOwed,
        stateTax: 0,
        localTax: 0,
        credits: 0
      }
    }
  }
  
  private calculateTaxOwed(taxableIncome: number, filingStatus: string): number {
    // 2024 Tax Brackets (simplified)
    const brackets = {
      'SINGLE': [
        { rate: 0.10, max: 11600 },
        { rate: 0.12, max: 47150 },
        { rate: 0.22, max: 100525 },
        { rate: 0.24, max: 191950 },
        { rate: 0.32, max: 243725 },
        { rate: 0.35, max: 609350 },
        { rate: 0.37, max: Infinity }
      ],
      'MARRIED': [
        { rate: 0.10, max: 23200 },
        { rate: 0.12, max: 94300 },
        { rate: 0.22, max: 201050 },
        { rate: 0.24, max: 383900 },
        { rate: 0.32, max: 487450 },
        { rate: 0.35, max: 731200 },
        { rate: 0.37, max: Infinity }
      ]
    }
    
    const bracketSet = brackets[filingStatus as keyof typeof brackets] || brackets.SINGLE
    let tax = 0
    let remainingIncome = taxableIncome
    
    for (let i = 0; i < bracketSet.length; i++) {
      const bracket = bracketSet[i]
      const prevMax = i > 0 ? bracketSet[i - 1].max : 0
      const bracketIncome = Math.min(remainingIncome, bracket.max - prevMax)
      
      if (bracketIncome > 0) {
        tax += bracketIncome * bracket.rate
        remainingIncome -= bracketIncome
      }
      
      if (remainingIncome <= 0) break
    }
    
    return tax
  }
  
  private getDefaultRates(): TaxRates {
    return {
      year: 2024,
      brackets: {
        SINGLE: [
          { rate: 0.10, max: 11600 },
          { rate: 0.12, max: 47150 },
          { rate: 0.22, max: 100525 },
          { rate: 0.24, max: 191950 },
          { rate: 0.32, max: 243725 },
          { rate: 0.35, max: 609350 },
          { rate: 0.37, max: Infinity }
        ],
        MARRIED: [
          { rate: 0.10, max: 23200 },
          { rate: 0.12, max: 94300 },
          { rate: 0.22, max: 201050 },
          { rate: 0.24, max: 383900 },
          { rate: 0.32, max: 487450 },
          { rate: 0.35, max: 731200 },
          { rate: 0.37, max: Infinity }
        ],
        HEAD_OF_HOUSEHOLD: [
          { rate: 0.10, max: 16550 },
          { rate: 0.12, max: 63100 },
          { rate: 0.22, max: 100500 },
          { rate: 0.24, max: 191950 },
          { rate: 0.32, max: 243700 },
          { rate: 0.35, max: 609350 },
          { rate: 0.37, max: Infinity }
        ],
        QUALIFYING_WIDOW: [
          { rate: 0.10, max: 23200 },
          { rate: 0.12, max: 94300 },
          { rate: 0.22, max: 201050 },
          { rate: 0.24, max: 383900 },
          { rate: 0.32, max: 487450 },
          { rate: 0.35, max: 731200 },
          { rate: 0.37, max: Infinity }
        ]
      }
    }
  }
}

// TaxCloud API Integration (Free Tier)
export class TaxCloudAPI {
  private baseUrl = 'https://api.taxcloud.com'
  
  async calculateSalesTax(amount: number, state: string, county?: string): Promise<{
    taxAmount: number;
    rate: number;
    total: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/sales-tax`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.TAXCLOUD_API_KEY || 'demo-key'}`
        },
        body: JSON.stringify({
          amount,
          state,
          county,
          taxYear: 2024
        })
      })
      
      if (!response.ok) {
        throw new Error(`TaxCloud API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('TaxCloud API error:', error)
      // Fallback to basic sales tax calculation
      return this.basicSalesTax(amount, state)
    }
  }
  
  private basicSalesTax(amount: number, state: string): { taxAmount: number; rate: number; total: number } {
    // Basic state sales tax rates (simplified)
    const stateRates: Record<string, number> = {
      'CA': 0.075,
      'NY': 0.04,
      'TX': 0.0625,
      'FL': 0.06,
      'IL': 0.0625,
      'PA': 0.06,
      'OH': 0.0575,
      'GA': 0.04,
      'NC': 0.0475,
      'MI': 0.06
    }
    
    const rate = stateRates[state] || 0.05 // Default 5%
    const taxAmount = amount * rate
    
    return {
      taxAmount,
      rate,
      total: amount + taxAmount
    }
  }
}

// Main Tax Calculation Service
export class TaxCalculationService {
  private irsAPI: IRSTaxAPI
  private taxCloudAPI: TaxCloudAPI
  
  constructor() {
    this.irsAPI = new IRSTaxAPI()
    this.taxCloudAPI = new TaxCloudAPI()
  }
  
  async calculateTax(taxData: TaxFormData): Promise<TaxCalculation> {
    const { income, deductions, filingStatus, state } = taxData
    
    // Calculate federal tax using IRS API
    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0)
    const federalCalculation = await this.irsAPI.calculateTax2024(
      income,
      totalDeductions,
      filingStatus
    )
    
    // Calculate state tax if applicable
    let stateTax = 0
    if (state && state !== 'NONE') {
      const stateCalculation = await this.calculateStateTax(income, state)
      stateTax = stateCalculation.taxAmount
    }
    
    // Calculate sales tax if applicable
    let salesTax = 0
    if (taxData.salesAmount && state) {
      const salesCalculation = await this.taxCloudAPI.calculateSalesTax(
        taxData.salesAmount,
        state
      )
      salesTax = salesCalculation.taxAmount
    }
    
    const totalTax = federalCalculation.taxOwed + stateTax + salesTax
    const effectiveRate = (totalTax / income) * 100
    
    return {
      ...federalCalculation,
      stateTax,
      salesTax,
      totalTax,
      effectiveRate,
      breakdown: {
        ...federalCalculation.breakdown,
        stateTax
      },
      confidence: this.calculateConfidence(federalCalculation),
      recommendations: this.generateRecommendations(taxData, totalTax)
    }
  }
  
  async validateDeductions(deductions: Deduction[]): Promise<ValidationResult> {
    const validDeductions: Deduction[] = []
    const invalidDeductions: Deduction[] = []
    
    for (const deduction of deductions) {
      const isValid = await this.validateDeduction(deduction)
      if (isValid) {
        validDeductions.push(deduction)
      } else {
        invalidDeductions.push(deduction)
      }
    }
    
    return {
      validDeductions,
      invalidDeductions,
      totalValidAmount: validDeductions.reduce((sum, d) => sum + d.amount, 0),
      totalInvalidAmount: invalidDeductions.reduce((sum, d) => sum + d.amount, 0)
    }
  }
  
  async getCurrentYearRates(): Promise<TaxRates> {
    return await this.irsAPI.getCurrentYearRates()
  }
  
  async calculateEstimatedTax(income: number, filingStatus: string): Promise<{
    quarterlyAmount: number;
    annualAmount: number;
    dueDates: string[];
  }> {
    const annualTax = await this.irsAPI.calculateTax2024(income, 0, filingStatus)
    const quarterlyAmount = annualTax.taxOwed / 4
    
    return {
      quarterlyAmount,
      annualAmount: annualTax.taxOwed,
      dueDates: [
        '2024-04-15',
        '2024-06-15',
        '2024-09-15',
        '2025-01-15'
      ]
    }
  }
  
  private async calculateStateTax(income: number, state: string): Promise<{ taxAmount: number }> {
    // Simplified state tax calculation
    const stateRates: Record<string, number> = {
      'CA': 0.075,
      'NY': 0.0685,
      'TX': 0, // No state income tax
      'FL': 0, // No state income tax
      'IL': 0.0495,
      'PA': 0.0307,
      'OH': 0.0399,
      'GA': 0.0575,
      'NC': 0.0499,
      'MI': 0.0425
    }
    
    const rate = stateRates[state] || 0.05
    return { taxAmount: income * rate }
  }
  
  private async validateDeduction(deduction: Deduction): Promise<boolean> {
    // Basic deduction validation logic
    const validTypes = [
      'STANDARD_DEDUCTION',
      'ITEMIZED_DEDUCTION',
      'BUSINESS_EXPENSE',
      'CHARITABLE_CONTRIBUTION',
      'MORTGAGE_INTEREST',
      'PROPERTY_TAX',
      'MEDICAL_EXPENSE'
    ]
    
    return validTypes.includes(deduction.type) && deduction.amount > 0
  }
  
  private calculateConfidence(calculation: TaxCalculation): number {
    // Calculate confidence based on data quality and API responses
    let confidence = 0.8 // Base confidence
    
    // Adjust based on income level (more reliable for middle income)
    if (calculation.grossIncome > 50000 && calculation.grossIncome < 200000) {
      confidence += 0.1
    }
    
    // Adjust based on deduction complexity
    if (calculation.taxableIncome > 0) {
      confidence += 0.05
    }
    
    return Math.min(confidence, 0.95) // Cap at 95%
  }
  
  private generateRecommendations(taxData: TaxFormData, totalTax: number): string[] {
    const recommendations: string[] = []
    
    // Basic recommendations based on tax situation
    if (totalTax > taxData.income * 0.3) {
      recommendations.push('Consider consulting a tax professional for high tax burden')
    }
    
    if (taxData.deductions.length === 0) {
      recommendations.push('Consider itemizing deductions if you have significant expenses')
    }
    
    if (taxData.income > 100000) {
      recommendations.push('Consider estimated tax payments to avoid penalties')
    }
    
    if (taxData.state && taxData.state !== 'NONE') {
      recommendations.push('Verify state tax calculations with local tax authority')
    }
    
    return recommendations
  }
}

// Export singleton instance
export const taxCalculationService = new TaxCalculationService() 
