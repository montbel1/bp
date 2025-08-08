import { Resend } from "resend";
import { prisma } from "./prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailTemplate {
  name: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailData {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export interface NotificationTrigger {
  type: "invoice_due" | "payment_received" | "payment_failed" | "system_alert";
  userId: string;
  data: any;
}

export class EmailService {
  private static templates: Record<string, EmailTemplate> = {
    invoice_due: {
      name: "Invoice Due Reminder",
      subject: "Invoice #{invoiceNumber} is due",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Invoice Due Reminder</h2>
          <p>Dear {customerName},</p>
          <p>This is a friendly reminder that invoice #{invoiceNumber} for ${amount} is due on {dueDate}.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Invoice Details:</h3>
            <p><strong>Invoice Number:</strong> #{invoiceNumber}</p>
            <p><strong>Amount Due:</strong> ${amount}</p>
            <p><strong>Due Date:</strong> {dueDate}</p>
            <p><strong>Description:</strong> {description}</p>
          </div>
          <p>Please make your payment as soon as possible to avoid any late fees.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>{companyName}</p>
        </div>
      `,
    },
    payment_received: {
      name: "Payment Received Confirmation",
      subject: "Payment received for invoice #{invoiceNumber}",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">Payment Received</h2>
          <p>Dear {customerName},</p>
          <p>Thank you for your payment of ${amount} for invoice #{invoiceNumber}.</p>
          <div style="background-color: #d4edda; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Payment Details:</h3>
            <p><strong>Invoice Number:</strong> #{invoiceNumber}</p>
            <p><strong>Amount Paid:</strong> ${amount}</p>
            <p><strong>Payment Date:</strong> {paymentDate}</p>
            <p><strong>Payment Method:</strong> {paymentMethod}</p>
          </div>
          <p>Your payment has been processed successfully. A receipt has been attached to this email.</p>
          <p>Thank you for your business!</p>
          <p>Best regards,<br>{companyName}</p>
        </div>
      `,
    },
    payment_failed: {
      name: "Payment Failed Notification",
      subject: "Payment failed for invoice #{invoiceNumber}",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Payment Failed</h2>
          <p>Dear {customerName},</p>
          <p>We were unable to process your payment of ${amount} for invoice #{invoiceNumber}.</p>
          <div style="background-color: #f8d7da; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Payment Details:</h3>
            <p><strong>Invoice Number:</strong> #{invoiceNumber}</p>
            <p><strong>Amount:</strong> ${amount}</p>
            <p><strong>Failure Reason:</strong> {failureReason}</p>
          </div>
          <p>Please check your payment method and try again, or contact us for assistance.</p>
          <p>Best regards,<br>{companyName}</p>
        </div>
      `,
    },
    system_alert: {
      name: "System Alert",
      subject: "System Alert: {alertType}",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ffc107;">System Alert</h2>
          <p>Hello {userName},</p>
          <p>This is an automated alert from your accounting system.</p>
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Alert Details:</h3>
            <p><strong>Alert Type:</strong> {alertType}</p>
            <p><strong>Message:</strong> {message}</p>
            <p><strong>Timestamp:</strong> {timestamp}</p>
          </div>
          <p>Please log into your account to review this alert.</p>
          <p>Best regards,<br>System Administrator</p>
        </div>
      `,
    },
  };

  // Send a single email
  static async sendEmail(
    emailData: EmailData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const { data, error } = await resend.emails.send({
        from:
          emailData.from || process.env.FROM_EMAIL || "noreply@yourdomain.com",
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        attachments: emailData.attachments,
      });

      if (error) {
        console.error("Resend error:", error);
        return { success: false, error: error.message };
      }

      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error("Email sending error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Send email using a template
  static async sendTemplateEmail(
    templateName: string,
    to: string,
    variables: Record<string, string>,
    attachments?: Array<{
      filename: string;
      content: Buffer;
      contentType: string;
    }>
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const template = this.templates[templateName];
    if (!template) {
      return { success: false, error: `Template '${templateName}' not found` };
    }

    let html = template.html;
    let subject = template.subject;

    // Replace variables in template
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, "g");
      html = html.replace(regex, value);
      subject = subject.replace(regex, value);
    });

    return this.sendEmail({
      to,
      subject,
      html,
      text: template.text,
      attachments,
    });
  }

  // Send invoice due reminder
  static async sendInvoiceDueReminder(
    invoiceId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
          customer: true,
          user: true,
        },
      });

      if (!invoice) {
        return { success: false, error: "Invoice not found" };
      }

      const variables = {
        customerName: invoice.customer.name,
        invoiceNumber: invoice.number,
        amount: `$${invoice.total.toFixed(2)}`,
        dueDate: new Date(invoice.dueDate).toLocaleDateString(),
        description: invoice.items?.[0]?.description || "Services rendered",
        companyName: invoice.user.name || "Your Company",
      };

      const result = await this.sendTemplateEmail(
        "invoice_due",
        invoice.customer.email,
        variables
      );

      // Log the email attempt
      await prisma.notification.create({
        data: {
          type: "EMAIL_SENT",
          title: "Invoice Due Reminder Sent",
          message: `Reminder sent to ${invoice.customer.email} for invoice ${invoice.number}`,
          priority: "MEDIUM",
          userId: invoice.userId,
          metadata: {
            invoiceId,
            customerEmail: invoice.customer.email,
            success: result.success,
          },
        },
      });

      return result;
    } catch (error) {
      console.error("Error sending invoice due reminder:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Send payment confirmation
  static async sendPaymentConfirmation(
    paymentId: string,
    pdfBuffer?: Buffer
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          customer: true,
          invoice: true,
          user: true,
        },
      });

      if (!payment) {
        return { success: false, error: "Payment not found" };
      }

      const variables = {
        customerName: payment.customer.name,
        invoiceNumber: payment.invoice?.number || "N/A",
        amount: `$${payment.amount.toFixed(2)}`,
        paymentDate: new Date(payment.date).toLocaleDateString(),
        paymentMethod: payment.method,
        companyName: payment.user.name || "Your Company",
      };

      const attachments = pdfBuffer
        ? [
            {
              filename: `receipt-${payment.id}.pdf`,
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ]
        : undefined;

      const result = await this.sendTemplateEmail(
        "payment_received",
        payment.customer.email,
        variables,
        attachments
      );

      // Log the email attempt
      await prisma.notification.create({
        data: {
          type: "EMAIL_SENT",
          title: "Payment Confirmation Sent",
          message: `Confirmation sent to ${payment.customer.email} for payment of $${payment.amount}`,
          priority: "MEDIUM",
          userId: payment.userId,
          metadata: {
            paymentId,
            customerEmail: payment.customer.email,
            success: result.success,
          },
        },
      });

      return result;
    } catch (error) {
      console.error("Error sending payment confirmation:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Send payment failure notification
  static async sendPaymentFailureNotification(
    paymentId: string,
    failureReason: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          customer: true,
          invoice: true,
          user: true,
        },
      });

      if (!payment) {
        return { success: false, error: "Payment not found" };
      }

      const variables = {
        customerName: payment.customer.name,
        invoiceNumber: payment.invoice?.number || "N/A",
        amount: `$${payment.amount.toFixed(2)}`,
        failureReason,
        companyName: payment.user.name || "Your Company",
      };

      const result = await this.sendTemplateEmail(
        "payment_failed",
        payment.customer.email,
        variables
      );

      // Log the email attempt
      await prisma.notification.create({
        data: {
          type: "EMAIL_SENT",
          title: "Payment Failure Notification Sent",
          message: `Failure notification sent to ${payment.customer.email}`,
          priority: "HIGH",
          userId: payment.userId,
          metadata: {
            paymentId,
            customerEmail: payment.customer.email,
            failureReason,
            success: result.success,
          },
        },
      });

      return result;
    } catch (error) {
      console.error("Error sending payment failure notification:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Send system alert
  static async sendSystemAlert(
    userId: string,
    alertType: string,
    message: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return { success: false, error: "User not found" };
      }

      const variables = {
        userName: user.name || "User",
        alertType,
        message,
        timestamp: new Date().toLocaleString(),
      };

      const result = await this.sendTemplateEmail(
        "system_alert",
        user.email,
        variables
      );

      // Log the email attempt
      await prisma.notification.create({
        data: {
          type: "SYSTEM_ALERT",
          title: `System Alert: ${alertType}`,
          message,
          priority: "HIGH",
          userId,
          metadata: {
            alertType,
            success: result.success,
          },
        },
      });

      return result;
    } catch (error) {
      console.error("Error sending system alert:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Process notification triggers
  static async processNotificationTrigger(
    trigger: NotificationTrigger
  ): Promise<void> {
    try {
      switch (trigger.type) {
        case "invoice_due":
          if (trigger.data.invoiceId) {
            await this.sendInvoiceDueReminder(trigger.data.invoiceId);
          }
          break;
        case "payment_received":
          if (trigger.data.paymentId) {
            await this.sendPaymentConfirmation(
              trigger.data.paymentId,
              trigger.data.pdfBuffer
            );
          }
          break;
        case "payment_failed":
          if (trigger.data.paymentId && trigger.data.failureReason) {
            await this.sendPaymentFailureNotification(
              trigger.data.paymentId,
              trigger.data.failureReason
            );
          }
          break;
        case "system_alert":
          if (trigger.data.alertType && trigger.data.message) {
            await this.sendSystemAlert(
              trigger.userId,
              trigger.data.alertType,
              trigger.data.message
            );
          }
          break;
      }
    } catch (error) {
      console.error("Error processing notification trigger:", error);
    }
  }
}
