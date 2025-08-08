import puppeteer from 'puppeteer';
// Define types for Supabase instead of Prisma
export interface Invoice {
  id: string;
  number: string;
  date: string;
  due_date: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  notes: string | null;
  customer_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  status: string;
  total_invoiced: number;
  total_paid: number;
  balance: number;
  last_transaction_date: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  invoice_id: string;
  created_at: string;
  updated_at: string;
}

export interface PDFInvoiceData {
  invoice: Invoice & {
    customer: Customer;
    items: InvoiceItem[];
  };
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
  };
}

export interface PDFReportData {
  title: string;
  data: any;
  type: 'profit-loss' | 'balance-sheet' | 'cash-flow' | 'custom';
  dateRange: {
    from: string;
    to: string;
  };
}

export class PDFService {
  private static browser: puppeteer.Browser | null = null;

  private static async getBrowser(): Promise<puppeteer.Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
    return this.browser;
  }

  static async generatePDF(html: string, filename: string): Promise<Buffer> {
    try {
      const browser = await this.getBrowser();
      const page = await browser.newPage();
      
      // Set content and wait for rendering
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
      });

      await page.close();
      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  static generateInvoiceHTML(data: PDFInvoiceData): string {
    const { invoice, companyInfo } = data;
    const total = invoice.items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (total * invoice.tax) / 100;
    const grandTotal = total + taxAmount;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice ${invoice.number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .company-info { float: left; }
            .invoice-info { float: right; text-align: right; }
            .clear { clear: both; }
            .customer-info { margin-bottom: 30px; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            .items-table th { background-color: #f8f9fa; font-weight: bold; }
            .total-row { font-weight: bold; background-color: #f8f9fa; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            .amount { text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info">
              <h1>${companyInfo.name}</h1>
              <p>${companyInfo.address}</p>
              <p>Phone: ${companyInfo.phone}</p>
              <p>Email: ${companyInfo.email}</p>
              ${companyInfo.website ? `<p>Website: ${companyInfo.website}</p>` : ''}
            </div>
            <div class="invoice-info">
              <h2>INVOICE</h2>
              <p><strong>Invoice #:</strong> ${invoice.number}</p>
              <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
            <div class="clear"></div>
          </div>

          <div class="customer-info">
            <h3>Bill To:</h3>
            <p><strong>${invoice.customer.name}</strong></p>
            <p>${invoice.customer.email}</p>
            ${invoice.customer.address ? `<p>${invoice.customer.address}</p>` : ''}
            ${invoice.customer.phone ? `<p>Phone: ${invoice.customer.phone}</p>` : ''}
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th class="amount">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.unitPrice.toFixed(2)}</td>
                  <td class="amount">$${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="amount"><strong>Subtotal:</strong></td>
                <td class="amount">$${total.toFixed(2)}</td>
              </tr>
              ${invoice.tax > 0 ? `
                <tr>
                  <td colspan="3" class="amount"><strong>Tax (${invoice.tax}%):</strong></td>
                  <td class="amount">$${taxAmount.toFixed(2)}</td>
                </tr>
              ` : ''}
              <tr class="total-row">
                <td colspan="3" class="amount"><strong>Total:</strong></td>
                <td class="amount"><strong>$${grandTotal.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>

          ${invoice.notes ? `
            <div style="margin-top: 30px;">
              <h4>Notes:</h4>
              <p>${invoice.notes}</p>
            </div>
          ` : ''}

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Please make checks payable to ${companyInfo.name}</p>
          </div>
        </body>
      </html>
    `;
  }

  static generateProfitLossHTML(data: PDFReportData): string {
    const { reportData, dateRange } = data;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Profit & Loss Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .section h3 { border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .item { display: flex; justify-content: space-between; padding: 5px 0; }
            .item.total { font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px; }
            .amount { text-align: right; }
            .positive { color: #28a745; }
            .negative { color: #dc3545; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Profit & Loss Report</h1>
            <p>Period: ${dateRange.from} to ${dateRange.to}</p>
          </div>
          
          <div class="section">
            <h3>Revenue</h3>
            ${reportData.revenue.map((item: any) => `
              <div class="item">
                <span>${item.name}</span>
                <span class="amount positive">$${item.amount.toFixed(2)}</span>
              </div>
            `).join('')}
            <div class="item total">
              <span>Total Revenue</span>
              <span class="amount positive">$${reportData.revenue.reduce((sum: number, item: any) => sum + item.amount, 0).toFixed(2)}</span>
            </div>
          </div>
          
          <div class="section">
            <h3>Expenses</h3>
            ${reportData.expenses.map((item: any) => `
              <div class="item">
                <span>${item.name}</span>
                <span class="amount negative">$${item.amount.toFixed(2)}</span>
              </div>
            `).join('')}
            <div class="item total">
              <span>Total Expenses</span>
              <span class="amount negative">$${reportData.expenses.reduce((sum: number, item: any) => sum + item.amount, 0).toFixed(2)}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="item total">
              <span>Net Profit/Loss</span>
              <span class="amount ${reportData.netProfit >= 0 ? 'positive' : 'negative'}">$${reportData.netProfit.toFixed(2)}</span>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  static generateBalanceSheetHTML(data: PDFReportData): string {
    const { reportData, dateRange } = data;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Balance Sheet</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .section h3 { border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .item { display: flex; justify-content: space-between; padding: 5px 0; }
            .item.total { font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px; }
            .item.final { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
            .amount { text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Balance Sheet</h1>
            <p>As of ${dateRange.to}</p>
          </div>
          
          <div class="section">
            <h3>Assets</h3>
            ${reportData.assets.map((item: any) => `
              <div class="item">
                <span>${item.name}</span>
                <span class="amount">$${item.balance.toFixed(2)}</span>
              </div>
            `).join('')}
            <div class="item total">
              <span>Total Assets</span>
              <span class="amount">$${reportData.assets.reduce((sum: number, item: any) => sum + item.balance, 0).toFixed(2)}</span>
            </div>
          </div>
          
          <div class="section">
            <h3>Liabilities</h3>
            ${reportData.liabilities.map((item: any) => `
              <div class="item">
                <span>${item.name}</span>
                <span class="amount">$${item.balance.toFixed(2)}</span>
              </div>
            `).join('')}
            <div class="item total">
              <span>Total Liabilities</span>
              <span class="amount">$${reportData.liabilities.reduce((sum: number, item: any) => sum + item.balance, 0).toFixed(2)}</span>
            </div>
          </div>
          
          <div class="section">
            <h3>Equity</h3>
            ${reportData.equity.map((item: any) => `
              <div class="item">
                <span>${item.name}</span>
                <span class="amount">$${item.balance.toFixed(2)}</span>
              </div>
            `).join('')}
            <div class="item total">
              <span>Total Equity</span>
              <span class="amount">$${reportData.equity.reduce((sum: number, item: any) => sum + item.balance, 0).toFixed(2)}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="item final">
              <span>Total Liabilities + Equity</span>
              <span class="amount">$${(reportData.liabilities.reduce((sum: number, item: any) => sum + item.balance, 0) + 
                       reportData.equity.reduce((sum: number, item: any) => sum + item.balance, 0)).toFixed(2)}</span>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  static async generateInvoicePDF(data: PDFInvoiceData): Promise<Buffer> {
    const html = this.generateInvoiceHTML(data);
    return this.generatePDF(html, `invoice-${data.invoice.number}.pdf`);
  }

  static async generateReportPDF(data: PDFReportData): Promise<Buffer> {
    let html = '';
    
    switch (data.type) {
      case 'profit-loss':
        html = this.generateProfitLossHTML(data);
        break;
      case 'balance-sheet':
        html = this.generateBalanceSheetHTML(data);
        break;
      default:
        html = `<html><body><h1>${data.title}</h1><p>Report data: ${JSON.stringify(data.data)}</p></body></html>`;
    }
    
    return this.generatePDF(html, `${data.type}-report.pdf`);
  }

  static async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
} 
