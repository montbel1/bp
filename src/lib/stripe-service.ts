import Stripe from "stripe";
import { prisma } from "./prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export interface PaymentIntentData {
  amount: number;
  currency: string;
  customerId: string;
  invoiceId?: string;
  metadata?: Record<string, string>;
  description?: string;
}

export interface PaymentMethodData {
  type: "card" | "bank_account" | "sepa_debit";
  card?: {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
  };
  billing_details?: {
    name: string;
    email: string;
    address?: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

export class StripeService {
  // Create a payment intent for processing payments
  static async createPaymentIntent(data: PaymentIntentData) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency || "usd",
        customer: data.customerId,
        metadata: {
          ...data.metadata,
          invoiceId: data.invoiceId || "",
          description: data.description || "",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        paymentIntent,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      console.error("Error creating payment intent:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Confirm a payment intent
  static async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId: string
  ) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(
        paymentIntentId,
        {
          payment_method: paymentMethodId,
        }
      );

      return {
        success: true,
        paymentIntent,
      };
    } catch (error) {
      console.error("Error confirming payment intent:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Create a customer in Stripe
  static async createCustomer(customerData: {
    email: string;
    name: string;
    phone?: string;
    address?: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  }) {
    try {
      const customer = await stripe.customers.create({
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
        address: customerData.address,
      });

      return {
        success: true,
        customer,
      };
    } catch (error) {
      console.error("Error creating customer:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Process a refund
  static async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: reason as any,
      });

      return {
        success: true,
        refund,
      };
    } catch (error) {
      console.error("Error creating refund:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Handle webhook events
  static async handleWebhookEvent(event: Stripe.Event) {
    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          await this.handlePaymentSuccess(
            event.data.object as Stripe.PaymentIntent
          );
          break;
        case "payment_intent.payment_failed":
          await this.handlePaymentFailure(
            event.data.object as Stripe.PaymentIntent
          );
          break;
        case "charge.refunded":
          await this.handleRefund(event.data.object as Stripe.Charge);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { success: true };
    } catch (error) {
      console.error("Error handling webhook event:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Handle successful payment
  private static async handlePaymentSuccess(
    paymentIntent: Stripe.PaymentIntent
  ) {
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "COMPLETED",
          stripeChargeId: paymentIntent.latest_charge as string,
          updatedAt: new Date(),
        },
      });

      // Update invoice status if linked
      if (payment.invoiceId) {
        await prisma.invoice.update({
          where: { id: payment.invoiceId },
          data: { status: "PAID" },
        });
      }

      // Create notification
      await prisma.notification.create({
        data: {
          type: "PAYMENT_SUCCESS",
          title: "Payment Received",
          message: `Payment of $${(paymentIntent.amount / 100).toFixed(2)} received successfully`,
          priority: "HIGH",
          userId: payment.userId,
          metadata: {
            paymentId: payment.id,
            amount: paymentIntent.amount,
            customerId: payment.customerId,
          },
        },
      });
    }
  }

  // Handle failed payment
  private static async handlePaymentFailure(
    paymentIntent: Stripe.PaymentIntent
  ) {
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          updatedAt: new Date(),
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          type: "PAYMENT_FAILED",
          title: "Payment Failed",
          message: `Payment of $${(paymentIntent.amount / 100).toFixed(2)} failed`,
          priority: "HIGH",
          userId: payment.userId,
          metadata: {
            paymentId: payment.id,
            amount: paymentIntent.amount,
            customerId: payment.customerId,
            failureReason: paymentIntent.last_payment_error?.message,
          },
        },
      });
    }
  }

  // Handle refund
  private static async handleRefund(charge: Stripe.Charge) {
    const payment = await prisma.payment.findFirst({
      where: { stripeChargeId: charge.id },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          stripeRefundId: charge.refunds?.data[0]?.id,
          updatedAt: new Date(),
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          type: "REFUND_PROCESSED",
          title: "Refund Processed",
          message: `Refund of $${(charge.amount_refunded / 100).toFixed(2)} processed`,
          priority: "MEDIUM",
          userId: payment.userId,
          metadata: {
            paymentId: payment.id,
            refundAmount: charge.amount_refunded,
            customerId: payment.customerId,
          },
        },
      });
    }
  }
}
