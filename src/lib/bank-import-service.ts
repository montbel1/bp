import { parse } from "csv-parse";
import { parseString } from "ofx-js";
import { prisma } from "./prisma";

export interface BankTransaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: "credit" | "debit";
  reference?: string;
  category?: string;
  matchedTransactionId?: string;
  confidence?: number;
}

export interface ImportResult {
  success: boolean;
  transactions: BankTransaction[];
  matchedCount: number;
  unmatchedCount: number;
  errors: string[];
  summary: {
    total: number;
    credits: number;
    debits: number;
    dateRange: {
      from: Date;
      to: Date;
    };
  };
}

export interface MatchingRule {
  field: "description" | "amount" | "date";
  operator: "contains" | "exact" | "fuzzy" | "range";
  value: string | number | Date;
  weight: number;
}

export class BankImportService {
  // Parse CSV bank statement
  static async parseCSV(
    csvContent: string,
    options: {
      dateColumn?: string;
      descriptionColumn?: string;
      amountColumn?: string;
      typeColumn?: string;
      referenceColumn?: string;
      dateFormat?: string;
      hasHeader?: boolean;
    } = {}
  ): Promise<{
    success: boolean;
    transactions?: BankTransaction[];
    error?: string;
  }> {
    try {
      const {
        dateColumn = "Date",
        descriptionColumn = "Description",
        amountColumn = "Amount",
        typeColumn = "Type",
        referenceColumn = "Reference",
        dateFormat = "MM/DD/YYYY",
        hasHeader = true,
      } = options;

      return new Promise((resolve) => {
        const transactions: BankTransaction[] = [];
        const errors: string[] = [];

        parse(
          csvContent,
          {
            columns: hasHeader,
            skip_empty_lines: true,
            trim: true,
          },
          (err, records) => {
            if (err) {
              resolve({ success: false, error: err.message });
              return;
            }

            records.forEach((record: any, index: number) => {
              try {
                // Parse date
                let date: Date;
                try {
                  date = new Date(record[dateColumn]);
                  if (isNaN(date.getTime())) {
                    throw new Error("Invalid date format");
                  }
                } catch (dateError) {
                  errors.push(`Row ${index + 1}: Invalid date format`);
                  return;
                }

                // Parse amount
                const amountStr = record[amountColumn]
                  ?.toString()
                  .replace(/[$,]/g, "");
                const amount = parseFloat(amountStr);
                if (isNaN(amount)) {
                  errors.push(`Row ${index + 1}: Invalid amount`);
                  return;
                }

                // Determine transaction type
                let type: "credit" | "debit";
                if (typeColumn && record[typeColumn]) {
                  const typeStr = record[typeColumn].toLowerCase();
                  type =
                    typeStr.includes("credit") ||
                    typeStr.includes("deposit") ||
                    amount > 0
                      ? "credit"
                      : "debit";
                } else {
                  type = amount > 0 ? "credit" : "debit";
                }

                const transaction: BankTransaction = {
                  id: `import_${Date.now()}_${index}`,
                  date,
                  description: record[descriptionColumn] || "Unknown",
                  amount: Math.abs(amount),
                  type,
                  reference: record[referenceColumn],
                  category: undefined,
                  matchedTransactionId: undefined,
                  confidence: 0,
                };

                transactions.push(transaction);
              } catch (error) {
                errors.push(
                  `Row ${index + 1}: ${error instanceof Error ? error.message : "Unknown error"}`
                );
              }
            });

            resolve({
              success: errors.length === 0,
              transactions,
              error: errors.length > 0 ? errors.join("; ") : undefined,
            });
          }
        );
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Parse OFX bank statement
  static async parseOFX(
    ofxContent: string
  ): Promise<{
    success: boolean;
    transactions?: BankTransaction[];
    error?: string;
  }> {
    try {
      return new Promise((resolve) => {
        parseString(ofxContent, (err, result) => {
          if (err) {
            resolve({ success: false, error: err.message });
            return;
          }

          const transactions: BankTransaction[] = [];
          const bankTransactions =
            result?.OFX?.BANKMSGSRSV1?.STMTTRNRS?.STMTRS?.BANKTRANLIST
              ?.STMTTRN || [];

          if (!Array.isArray(bankTransactions)) {
            resolve({
              success: false,
              error: "No transactions found in OFX file",
            });
            return;
          }

          bankTransactions.forEach((transaction: any, index: number) => {
            try {
              const date = new Date(transaction.DTPOSTED);
              const amount = parseFloat(transaction.TRNAMT);
              const type = amount > 0 ? "credit" : "debit";

              const bankTransaction: BankTransaction = {
                id: `import_${Date.now()}_${index}`,
                date,
                description: transaction.MEMO || transaction.NAME || "Unknown",
                amount: Math.abs(amount),
                type,
                reference: transaction.FITID,
                category: undefined,
                matchedTransactionId: undefined,
                confidence: 0,
              };

              transactions.push(bankTransaction);
            } catch (error) {
              console.error(`Error parsing OFX transaction ${index}:`, error);
            }
          });

          resolve({ success: true, transactions });
        });
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Match imported transactions with existing transactions
  static async matchTransactions(
    importedTransactions: BankTransaction[],
    userId: string,
    rules: MatchingRule[] = []
  ): Promise<{
    success: boolean;
    matchedTransactions: BankTransaction[];
    error?: string;
  }> {
    try {
      // Get existing transactions for the user
      const existingTransactions = await prisma.transaction.findMany({
        where: { userId },
        select: {
          id: true,
          date: true,
          description: true,
          amount: true,
          type: true,
          reference: true,
        },
      });

      const matchedTransactions = importedTransactions.map((imported) => {
        let bestMatch: { transactionId: string; confidence: number } | null =
          null;

        existingTransactions.forEach((existing) => {
          let totalConfidence = 0;
          let ruleCount = 0;

          // Apply matching rules
          rules.forEach((rule) => {
            let matchScore = 0;

            switch (rule.field) {
              case "description":
                if (rule.operator === "contains") {
                  const importedDesc = imported.description.toLowerCase();
                  const existingDesc = existing.description.toLowerCase();
                  if (
                    importedDesc.includes(existingDesc) ||
                    existingDesc.includes(importedDesc)
                  ) {
                    matchScore = rule.weight;
                  }
                } else if (rule.operator === "fuzzy") {
                  const similarity = this.calculateSimilarity(
                    imported.description,
                    existing.description
                  );
                  matchScore = similarity * rule.weight;
                }
                break;

              case "amount":
                if (rule.operator === "exact") {
                  if (Math.abs(imported.amount - existing.amount) < 0.01) {
                    matchScore = rule.weight;
                  }
                } else if (rule.operator === "range") {
                  const tolerance = rule.value as number;
                  if (
                    Math.abs(imported.amount - existing.amount) <= tolerance
                  ) {
                    matchScore = rule.weight;
                  }
                }
                break;

              case "date":
                if (rule.operator === "exact") {
                  const dateDiff = Math.abs(
                    imported.date.getTime() - existing.date.getTime()
                  );
                  if (dateDiff === 0) {
                    matchScore = rule.weight;
                  }
                } else if (rule.operator === "range") {
                  const tolerance = rule.value as number; // days
                  const dateDiff = Math.abs(
                    imported.date.getTime() - existing.date.getTime()
                  );
                  const daysDiff = dateDiff / (1000 * 60 * 60 * 24);
                  if (daysDiff <= tolerance) {
                    matchScore = rule.weight;
                  }
                }
                break;
            }

            totalConfidence += matchScore;
            ruleCount++;
          });

          // Calculate average confidence
          const averageConfidence =
            ruleCount > 0 ? totalConfidence / ruleCount : 0;

          // Update best match if this one is better
          if (
            averageConfidence > 0.7 &&
            (!bestMatch || averageConfidence > bestMatch.confidence)
          ) {
            bestMatch = {
              transactionId: existing.id,
              confidence: averageConfidence,
            };
          }
        });

        return {
          ...imported,
          matchedTransactionId: bestMatch?.transactionId,
          confidence: bestMatch?.confidence || 0,
        };
      });

      return { success: true, matchedTransactions };
    } catch (error) {
      return {
        success: false,
        matchedTransactions: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Calculate string similarity using Levenshtein distance
  private static calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  // Calculate Levenshtein distance
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  // Save imported transactions to database
  static async saveImportedTransactions(
    transactions: BankTransaction[],
    userId: string,
    bankAccountId: string
  ): Promise<{ success: boolean; savedCount: number; error?: string }> {
    try {
      const savedTransactions = [];

      for (const transaction of transactions) {
        const bankTransaction = await prisma.bankTransaction.create({
          data: {
            date: transaction.date,
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type === "credit" ? "CREDIT" : "DEBIT",
            reference: transaction.reference,
            category: transaction.category,
            isReconciled: !!transaction.matchedTransactionId,
            matchedTransactionId: transaction.matchedTransactionId,
            confidence: transaction.confidence,
            bankAccountId,
            userId,
          },
        });

        savedTransactions.push(bankTransaction);
      }

      return { success: true, savedCount: savedTransactions.length };
    } catch (error) {
      return {
        success: false,
        savedCount: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Process complete import workflow
  static async processImport(
    fileContent: string,
    fileType: "csv" | "ofx",
    userId: string,
    bankAccountId: string,
    options: {
      csvOptions?: any;
      matchingRules?: MatchingRule[];
    } = {}
  ): Promise<ImportResult> {
    try {
      // Parse file
      let parseResult;
      if (fileType === "csv") {
        parseResult = await this.parseCSV(fileContent, options.csvOptions);
      } else {
        parseResult = await this.parseOFX(fileContent);
      }

      if (!parseResult.success || !parseResult.transactions) {
        return {
          success: false,
          transactions: [],
          matchedCount: 0,
          unmatchedCount: 0,
          errors: [parseResult.error || "Failed to parse file"],
          summary: {
            total: 0,
            credits: 0,
            debits: 0,
            dateRange: { from: new Date(), to: new Date() },
          },
        };
      }

      // Match transactions
      const matchResult = await this.matchTransactions(
        parseResult.transactions,
        userId,
        options.matchingRules
      );

      if (!matchResult.success) {
        return {
          success: false,
          transactions: [],
          matchedCount: 0,
          unmatchedCount: 0,
          errors: [matchResult.error || "Failed to match transactions"],
          summary: {
            total: 0,
            credits: 0,
            debits: 0,
            dateRange: { from: new Date(), to: new Date() },
          },
        };
      }

      // Save to database
      const saveResult = await this.saveImportedTransactions(
        matchResult.matchedTransactions,
        userId,
        bankAccountId
      );

      if (!saveResult.success) {
        return {
          success: false,
          transactions: [],
          matchedCount: 0,
          unmatchedCount: 0,
          errors: [saveResult.error || "Failed to save transactions"],
          summary: {
            total: 0,
            credits: 0,
            debits: 0,
            dateRange: { from: new Date(), to: new Date() },
          },
        };
      }

      // Calculate summary
      const matchedCount = matchResult.matchedTransactions.filter(
        (t) => t.matchedTransactionId
      ).length;
      const unmatchedCount =
        matchResult.matchedTransactions.length - matchedCount;
      const credits = matchResult.matchedTransactions.filter(
        (t) => t.type === "credit"
      ).length;
      const debits = matchResult.matchedTransactions.filter(
        (t) => t.type === "debit"
      ).length;
      const dates = matchResult.matchedTransactions.map((t) => t.date);
      const dateRange = {
        from: new Date(Math.min(...dates.map((d) => d.getTime()))),
        to: new Date(Math.max(...dates.map((d) => d.getTime()))),
      };

      return {
        success: true,
        transactions: matchResult.matchedTransactions,
        matchedCount,
        unmatchedCount,
        errors: [],
        summary: {
          total: matchResult.matchedTransactions.length,
          credits,
          debits,
          dateRange,
        },
      };
    } catch (error) {
      return {
        success: false,
        transactions: [],
        matchedCount: 0,
        unmatchedCount: 0,
        errors: [error instanceof Error ? error.message : "Unknown error"],
        summary: {
          total: 0,
          credits: 0,
          debits: 0,
          dateRange: { from: new Date(), to: new Date() },
        },
      };
    }
  }
}
