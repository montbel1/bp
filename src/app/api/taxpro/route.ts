import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "forms" or "documents"
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");

    if (type === "forms") {
      const where: any = {
        user: { email: session.user.email }
      };

      if (status) {
        where.status = status;
      }

      if (clientId) {
        where.clientId = clientId;
      }

      const taxForms = await prisma.taxForm.findMany({
        where,
        include: {
          client: true,
          documents: true,
        },
        orderBy: { createdAt: "desc" }
      });

      return NextResponse.json({ taxForms });
    }

    if (type === "documents") {
      const where: any = {
        user: { email: session.user.email }
      };

      if (status) {
        where.status = status;
      }

      if (clientId) {
        where.clientId = clientId;
      }

      const documents = await prisma.taxDocument.findMany({
        where,
        include: {
          client: true,
          taxForm: true,
        },
        orderBy: { createdAt: "desc" }
      });

      return NextResponse.json({ documents });
    }

    // Default: return stats
    const [totalForms, pendingForms, completedForms, overdueForms, totalDocuments, pendingDocuments] = await Promise.all([
      prisma.taxForm.count({ where: { user: { email: session.user.email } } }),
      prisma.taxForm.count({ 
        where: { 
          user: { email: session.user.email },
          status: { in: ["DRAFT", "IN_REVIEW"] }
        } 
      }),
      prisma.taxForm.count({ 
        where: { 
          user: { email: session.user.email },
          status: { in: ["FINALIZED", "SUBMITTED"] }
        } 
      }),
      prisma.taxForm.count({ 
        where: { 
          user: { email: session.user.email },
          status: { not: "FINALIZED" }
        } 
      }),
      prisma.taxDocument.count({ where: { client: { user: { email: session.user.email } } } }),
      prisma.taxDocument.count({ 
        where: { 
          client: { user: { email: session.user.email } },
          status: "PENDING"
        } 
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalForms,
        pendingForms,
        completedForms,
        overdueForms,
        totalDocuments,
        pendingDocuments,
      }
    });

  } catch (error) {
    console.error("Error fetching TaxPro data:", error);
    return NextResponse.json(
      { error: "Failed to fetch TaxPro data" },
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

    const body = await request.json();
    const { type, data } = body;

    if (type === "taxForm") {
      const { formType, taxYear, clientId, notes } = data;

      // Ensure user exists in database
      let user = await prisma.user.findUnique({
        where: { id: session.user.id }
      });

      if (!user) {
        // Create user if it doesn't exist (for development)
        user = await prisma.user.create({
          data: {
            id: session.user.id,
            email: session.user.email || 'dev@example.com',
            name: session.user.name || 'Development User',
            role: 'USER',
            subscription: 'BASIC',
            flowAccess: true
          }
        });
      }

      const taxForm = await prisma.taxForm.create({
        data: {
          formType,
          taxYear,
          notes,
          status: "DRAFT",
          data: {},
          clientId,
          userId: user.id,
        },
        include: {
          client: true,
        }
      });

      return NextResponse.json({ taxForm }, { status: 201 });
    }

    if (type === "document") {
      const { name, fileUrl, fileType, description, clientId, taxFormId } = data;

      // Ensure user exists in database
      let user = await prisma.user.findUnique({
        where: { id: session.user.id }
      });

      if (!user) {
        // Create user if it doesn't exist (for development)
        user = await prisma.user.create({
          data: {
            id: session.user.id,
            email: session.user.email || 'dev@example.com',
            name: session.user.name || 'Development User',
            role: 'USER',
            subscription: 'BASIC',
            flowAccess: true
          }
        });
      }

      const document = await prisma.taxDocument.create({
        data: {
          name,
          fileUrl,
          fileType,
          description,
          status: "PENDING",
          clientId,
          taxFormId,
          uploadedBy: user.id,
        },
        include: {
          client: true,
          taxForm: true,
        }
      });

      return NextResponse.json({ document }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  } catch (error) {
    console.error("Error creating TaxPro item:", error);
    return NextResponse.json(
      { error: "Failed to create TaxPro item" },
      { status: 500 }
    );
  }
} 
