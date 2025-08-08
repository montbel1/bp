import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { StripeService } from "@/lib/stripe-service";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const customerId = searchParams.get("customerId");

    const skip = (page - 1) * limit;

    const where: any = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          invoice: {
            select: {
              id: true,
              number: true,
              total: true,
            },
          },
        },
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ]);

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session!.user.email || "dev@example.com",
          name: session!.user.name || "Development User",
          role: "USER",
          subscription: "BASIC",
          flowAccess: true,
        },
      });
    }

    const body = await request.json();
    const {
      invoiceId,
      customerId,
      amount,
      method,
      reference,
      notes,
      paymentMethodId,
    } = body;

    // Validation
    if (!invoiceId || !customerId || !amount || !method) {
      return NextResponse.json(
        { error: "Invoice, customer, amount, and payment method are required" },
        { status: 400 }
      );
    }

    // Check if invoice exists and belongs to user
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: user.id,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Check if customer exists and belongs to user
    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        userId: user.id,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Create or get Stripe customer
    let stripeCustomerId = customer.stripeCustomerId;
    if (!stripeCustomerId) {
      const stripeCustomerResult = await StripeService.createCustomer({
        email: customer.email,
        name: customer.name,
        phone: customer.phone || undefined,
      });

      if (stripeCustomerResult.success && stripeCustomerResult.customer) {
        stripeCustomerId = stripeCustomerResult.customer.id;

        // Update customer with Stripe ID
        await prisma.customer.update({
          where: { id: customerId },
          data: { stripeCustomerId },
        });
      }
    }

    // Create payment intent with Stripe
    const paymentIntentResult = await StripeService.createPaymentIntent({
      amount: parseFloat(amount),
      currency: "usd",
      customerId: stripeCustomerId!,
      invoiceId,
      description: `Payment for invoice ${invoice.number}`,
      metadata: {
        invoiceNumber: invoice.number,
        customerName: customer.name,
        userId: user.id,
      },
    });

    if (!paymentIntentResult.success) {
      return NextResponse.json(
        { error: "Failed to create payment intent" },
        { status: 500 }
      );
    }

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        method: method as any,
        reference: reference || `Payment for ${invoice.number}`,
        notes: notes || null,
        date: new Date(),
        status: "PENDING",
        stripePaymentIntentId: paymentIntentResult.paymentIntent.id,
        stripeCustomerId,
        customerId,
        invoiceId,
        userId: user.id,
        metadata: {
          clientSecret: paymentIntentResult.clientSecret,
          paymentIntentId: paymentIntentResult.paymentIntent.id,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        invoice: {
          select: {
            id: true,
            number: true,
            total: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        payment,
        clientSecret: paymentIntentResult.clientSecret,
        paymentIntentId: paymentIntentResult.paymentIntent.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
