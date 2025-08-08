import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    // In development, allow access even without session
    if (process.env.NODE_ENV === "development") {
      try {
        // Query the database for categories
        const result = await query(`
          SELECT 
            id,
            name,
            type,
            description,
            is_active as "isActive",
            user_id as "userId"
          FROM categories
          ORDER BY type, name
        `);

        return NextResponse.json(result.rows);
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Fallback to mock data if database fails
        return NextResponse.json([
          {
            id: "1",
            name: "Office Supplies",
            type: "EXPENSE",
            description: "Office supplies and materials",
            isActive: true,
            userId: "dev-user-id"
          },
          {
            id: "2",
            name: "Professional Services",
            type: "EXPENSE",
            description: "Professional and consulting services",
            isActive: true,
            userId: "dev-user-id"
          },
          {
            id: "3",
            name: "Service Revenue",
            type: "INCOME",
            description: "Revenue from services provided",
            isActive: true,
            userId: "dev-user-id"
          }
        ])
      }
    }
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const isActive = searchParams.get("isActive")

    // Build where clause
    const where: {
      userId: string
      type?: "INCOME" | "EXPENSE"
      isActive?: boolean
    } = {
      userId: session.user.id
    }

    if (type) {
      where.type = type as "INCOME" | "EXPENSE"
    }

    if (isActive !== null) {
      where.isActive = isActive === "true"
    }

    // Fetch categories
    const categories = await prisma.category.findMany({
      where,
      orderBy: [
        { type: "asc" },
        { name: "asc" }
      ]
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    // In development, allow access even without session
    if (process.env.NODE_ENV !== "development" && !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, type, description, isActive } = body

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      )
    }

    // Validate type
    if (!["INCOME", "EXPENSE"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be either INCOME or EXPENSE" },
        { status: 400 }
      )
    }

    // Check if category name already exists for this user
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        type,
        userId: session!.user.id
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name and type already exists" },
        { status: 400 }
      )
    }

    // Create the category
    const category = await prisma.category.create({
      data: {
        name,
        type,
        description: description || null,
        isActive: isActive ?? true,
        userId: session!.user.id
      }
    })

    console.log("Category created successfully:", category)
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
