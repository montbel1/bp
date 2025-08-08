import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Get contacts for this client
    const contacts = await prisma.contact.findMany({
      where: {
        clientId: params.id,
      },
      orderBy: [
        { isPrimary: "desc" },
        { name: "asc" },
      ],
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, title, email, phone, isPrimary = false } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Contact name is required" },
        { status: 400 }
      );
    }

    // If this is a primary contact, unset other primary contacts
    if (isPrimary) {
      await prisma.contact.updateMany({
        where: {
          clientId: params.id,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Create contact
    const contact = await prisma.contact.create({
      data: {
        name,
        title,
        email,
        phone,
        isPrimary,
        clientId: params.id,
      },
    });

    return NextResponse.json({
      message: "Contact created successfully",
      contact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
