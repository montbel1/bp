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
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taxForm = await prisma.taxForm.findUnique({
      where: { 
        id: params.id,
        user: { email: session.user.email }
      },
      include: {
        client: true,
        documents: true,
      }
    });

    if (!taxForm) {
      return NextResponse.json({ error: "Tax form not found" }, { status: 404 });
    }

    return NextResponse.json({ taxForm });
  } catch (error) {
    console.error("Error fetching tax form:", error);
    return NextResponse.json(
      { error: "Failed to fetch tax form" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { data, status, notes } = body;

    // Verify the tax form belongs to the user
    const existingForm = await prisma.taxForm.findUnique({
      where: { 
        id: params.id,
        user: { email: session.user.email }
      }
    });

    if (!existingForm) {
      return NextResponse.json({ error: "Tax form not found" }, { status: 404 });
    }

    const updatedForm = await prisma.taxForm.update({
      where: { id: params.id },
      data: {
        data: data || existingForm.data,
        status: status || existingForm.status,
        notes: notes !== undefined ? notes : existingForm.notes,
        updatedAt: new Date(),
      },
      include: {
        client: true,
        documents: true,
      }
    });

    return NextResponse.json({ taxForm: updatedForm });
  } catch (error) {
    console.error("Error updating tax form:", error);
    return NextResponse.json(
      { error: "Failed to update tax form" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the tax form belongs to the user
    const existingForm = await prisma.taxForm.findUnique({
      where: { 
        id: params.id,
        user: { email: session.user.email }
      }
    });

    if (!existingForm) {
      return NextResponse.json({ error: "Tax form not found" }, { status: 404 });
    }

    await prisma.taxForm.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Tax form deleted successfully" });
  } catch (error) {
    console.error("Error deleting tax form:", error);
    return NextResponse.json(
      { error: "Failed to delete tax form" },
      { status: 500 }
    );
  }
} 