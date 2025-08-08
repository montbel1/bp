import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = parseInt(searchParams.get("period") || "12")

    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - period)

    // Fetch all relevant data
    const [
      transactions,
      invoices,
      payments,
      bills,
      accounts
    ] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId: session.user.id,
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          account: true,
          category: true
        }
      }),
      prisma.invoice.findMany({
        where: {
          userId: session.user.id,
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          payments: true
        }
      }),
      prisma.payment.findMany({
        where: {
          userId: session.user.id,
          date: {
            gte: startDate,
            lte: endDate
          }
        }
      }),
      prisma.bill.findMany({
        where: {
          userId: session.user.id,
          date: {
            gte: startDate,
            lte: endDate
          }
        }
      }),
      prisma.chartAccount.findMany({
        where: {
          userId: session.user.id
        }
      })
    ])

    // Calculate basic metrics
    const revenue = transactions
      .filter(t => t.account.type === 'REVENUE')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = transactions
      .filter(t => t.account.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)

    const netProfit = revenue - expenses
    const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0

    // Calculate cash flow
    const cashInflows = payments.reduce((sum, p) => sum + p.amount, 0)
    const cashOutflows = bills.reduce((sum, b) => sum + b.total, 0)
    const cashFlow = cashInflows - cashOutflows

    // Calculate accounts receivable and payable
    const accountsReceivable = invoices
      .filter(i => i.status !== 'PAID')
      .reduce((sum, i) => sum + i.total, 0)

    const accountsPayable = bills
      .filter(b => b.status !== 'PAID')
      .reduce((sum, b) => sum + b.total, 0)

    // Calculate working capital and ratios
    const currentAssets = accounts
      .filter(a => a.type === 'ASSET' && a.balance > 0)
      .reduce((sum, a) => sum + a.balance, 0)

    const currentLiabilities = accounts
      .filter(a => a.type === 'LIABILITY' && a.balance > 0)
      .reduce((sum, a) => sum + a.balance, 0)

    const workingCapital = currentAssets - currentLiabilities
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0

    // Calculate quick ratio (excluding inventory)
    const quickAssets = currentAssets // Simplified - in real app would exclude inventory
    const quickRatio = currentLiabilities > 0 ? quickAssets / currentLiabilities : 0

    // Calculate debt-to-equity ratio
    const totalLiabilities = accounts
      .filter(a => a.type === 'LIABILITY')
      .reduce((sum, a) => sum + a.balance, 0)

    const totalEquity = accounts
      .filter(a => a.type === 'EQUITY')
      .reduce((sum, a) => sum + a.balance, 0)

    const debtToEquity = totalEquity > 0 ? totalLiabilities / totalEquity : 0

    // Calculate return on assets and equity
    const totalAssets = accounts
      .filter(a => a.type === 'ASSET')
      .reduce((sum, a) => sum + a.balance, 0)

    const returnOnAssets = totalAssets > 0 ? (netProfit / totalAssets) * 100 : 0
    const returnOnEquity = totalEquity > 0 ? (netProfit / totalEquity) * 100 : 0

    // Calculate growth rates
    const previousPeriodStart = new Date(startDate)
    previousPeriodStart.setMonth(previousPeriodStart.getMonth() - period)

    const previousTransactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: previousPeriodStart,
          lt: startDate
        }
      },
      include: {
        account: true
      }
    })

    const previousRevenue = previousTransactions
      .filter(t => t.account.type === 'REVENUE')
      .reduce((sum, t) => sum + t.amount, 0)

    const monthlyGrowth = previousRevenue > 0 ? ((revenue - previousRevenue) / previousRevenue) * 100 : 0
    const yearOverYearGrowth = monthlyGrowth // Simplified - would calculate actual YoY in real app

    // Generate monthly data
    const monthlyData = generateMonthlyData(transactions, invoices, payments, bills, startDate, endDate)

    const metrics = {
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit,
      profitMargin,
      cashFlow,
      accountsReceivable,
      accountsPayable,
      workingCapital,
      currentRatio,
      quickRatio,
      debtToEquity,
      returnOnAssets,
      returnOnEquity,
      monthlyGrowth,
      yearOverYearGrowth
    }

    return NextResponse.json({
      metrics,
      monthlyData
    })
  } catch (error) {
    console.error("Error generating advanced reports:", error)
    return NextResponse.json(
      { error: "Failed to generate advanced reports" },
      { status: 500 }
    )
  }
}

function generateMonthlyData(
  transactions: any[],
  invoices: any[],
  payments: any[],
  bills: any[],
  startDate: Date,
  endDate: Date
) {
  const monthlyData = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date)
      return tDate >= monthStart && tDate <= monthEnd
    })

    const monthInvoices = invoices.filter(i => {
      const iDate = new Date(i.date)
      return iDate >= monthStart && iDate <= monthEnd
    })

    const monthPayments = payments.filter(p => {
      const pDate = new Date(p.date)
      return pDate >= monthStart && pDate <= monthEnd
    })

    const monthBills = bills.filter(b => {
      const bDate = new Date(b.date)
      return bDate >= monthStart && bDate <= monthEnd
    })

    const revenue = monthTransactions
      .filter(t => t.account.type === 'REVENUE')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = monthTransactions
      .filter(t => t.account.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)

    const profit = revenue - expenses
    const cashFlow = monthPayments.reduce((sum, p) => sum + p.amount, 0) - 
                    monthBills.reduce((sum, b) => sum + b.total, 0)

    monthlyData.push({
      month: currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      revenue,
      expenses,
      profit,
      cashFlow
    })

    currentDate.setMonth(currentDate.getMonth() + 1)
  }

  return monthlyData
} 
