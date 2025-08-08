export interface CategorySuggestion {
  categoryId: string
  categoryName: string
  confidence: number
  keywords: string[]
}

export interface TransactionData {
  description: string
  amount: number
  merchant?: string
  reference?: string
}

export class SmartCategorizationService {
  private static categoryKeywords: Map<string, string[]> = new Map([
    ['office_supplies', ['staples', 'office depot', 'paper', 'ink', 'printer', 'supplies']],
    ['travel', ['uber', 'lyft', 'hotel', 'airbnb', 'flight', 'gas', 'fuel', 'parking']],
    ['meals', ['restaurant', 'starbucks', 'mcdonalds', 'food', 'lunch', 'dinner', 'coffee']],
    ['utilities', ['electric', 'water', 'gas', 'internet', 'phone', 'utility']],
    ['software', ['adobe', 'microsoft', 'zoom', 'slack', 'subscription', 'saas']],
    ['marketing', ['google ads', 'facebook ads', 'advertising', 'marketing', 'promotion']],
    ['insurance', ['insurance', 'liability', 'health', 'auto', 'business']],
    ['legal', ['lawyer', 'legal', 'attorney', 'court', 'filing']],
    ['accounting', ['quickbooks', 'accounting', 'cpa', 'tax', 'bookkeeping']],
    ['rent', ['rent', 'lease', 'property', 'office space']]
  ])

  static async suggestCategory(transaction: TransactionData): Promise<CategorySuggestion[]> {
    const suggestions: CategorySuggestion[] = []
    const description = transaction.description.toLowerCase()
    const merchant = transaction.merchant?.toLowerCase() || ''
    const reference = transaction.reference?.toLowerCase() || ''

    // Analyze text for category matches
    for (const [categoryId, keywords] of this.categoryKeywords) {
      let confidence = 0
      let matchedKeywords: string[] = []

      // Check description
      for (const keyword of keywords) {
        if (description.includes(keyword)) {
          confidence += 0.3
          matchedKeywords.push(keyword)
        }
      }

      // Check merchant name
      for (const keyword of keywords) {
        if (merchant.includes(keyword)) {
          confidence += 0.4
          matchedKeywords.push(keyword)
        }
      }

      // Check reference
      for (const keyword of keywords) {
        if (reference.includes(keyword)) {
          confidence += 0.2
          matchedKeywords.push(keyword)
        }
      }

      // Amount-based heuristics
      if (this.isAmountTypical(transaction.amount, categoryId)) {
        confidence += 0.1
      }

      if (confidence > 0.1) {
        suggestions.push({
          categoryId,
          categoryName: this.getCategoryName(categoryId),
          confidence: Math.min(confidence, 1.0),
          keywords: [...new Set(matchedKeywords)]
        })
      }
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence)
  }

  private static isAmountTypical(amount: number, categoryId: string): boolean {
    const typicalRanges: Record<string, { min: number; max: number }> = {
      'office_supplies': { min: 10, max: 500 },
      'travel': { min: 20, max: 1000 },
      'meals': { min: 5, max: 200 },
      'utilities': { min: 50, max: 500 },
      'software': { min: 10, max: 500 },
      'marketing': { min: 100, max: 10000 },
      'insurance': { min: 100, max: 5000 },
      'legal': { min: 200, max: 10000 },
      'accounting': { min: 100, max: 2000 },
      'rent': { min: 500, max: 10000 }
    }

    const range = typicalRanges[categoryId]
    if (!range) return false

    return amount >= range.min && amount <= range.max
  }

  private static getCategoryName(categoryId: string): string {
    const names: Record<string, string> = {
      'office_supplies': 'Office Supplies',
      'travel': 'Travel & Transportation',
      'meals': 'Meals & Entertainment',
      'utilities': 'Utilities',
      'software': 'Software & Subscriptions',
      'marketing': 'Marketing & Advertising',
      'insurance': 'Insurance',
      'legal': 'Legal & Professional',
      'accounting': 'Accounting & Tax',
      'rent': 'Rent & Lease'
    }

    return names[categoryId] || categoryId
  }

  static async learnFromUserChoice(
    transaction: TransactionData, 
    selectedCategoryId: string, 
    wasCorrect: boolean
  ): Promise<void> {
    // In a real implementation, this would update the AI model
    // For now, we'll just log the learning
    console.log(`Learning: ${transaction.description} -> ${selectedCategoryId} (correct: ${wasCorrect})`)
  }

  static async bulkCategorize(transactions: TransactionData[]): Promise<Map<string, CategorySuggestion[]>> {
    const results = new Map<string, CategorySuggestion[]>()
    
    for (const transaction of transactions) {
      const suggestions = await this.suggestCategory(transaction)
      results.set(transaction.description, suggestions)
    }
    
    return results
  }
} 
