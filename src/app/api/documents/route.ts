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

    // Ensure user exists in database
    let user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) {
      user = await prisma.user.create({ 
        data: { 
          id: session.user.id, 
          email: session.user.email || 'dev@example.com', 
          name: session.user.name || 'Development User', 
          role: 'USER', 
          subscription: 'BASIC', 
          flowAccess: true 
        } 
      })
    }

    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get("entityType") // invoice, transaction, etc.
    const entityId = searchParams.get("entityId")
    const search = searchParams.get("search")

    const where: any = { userId: user.id }
    
    if (entityType && entityId) {
      where[`${entityType}Id`] = entityId
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Ensure user exists in database
    let user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) {
      user = await prisma.user.create({ 
        data: { 
          id: session.user.id, 
          email: session.user.email || 'dev@example.com', 
          name: session.user.name || 'Development User', 
          role: 'USER', 
          subscription: 'BASIC', 
          flowAccess: true 
        } 
      })
    }

    const body = await request.json()
    const { name, fileName, fileType, fileSize, filePath, description, tags, entityType, entityId } = body

    // Validation
    if (!name || !fileName || !fileType || !fileSize || !filePath) {
      return NextResponse.json({ error: "All file information is required" }, { status: 400 })
    }

    // Create document record
    const document = await prisma.document.create({
      data: {
        name,
        fileName,
        fileType,
        fileSize: parseInt(fileSize),
        filePath,
        description: description || null,
        tags: tags || null,
        userId: user.id,
        // Link to entity if provided
        ...(entityType === 'invoice' && entityId && { invoiceId: entityId }),
        ...(entityType === 'transaction' && entityId && { transactionId: entityId }),
        ...(entityType === 'payment' && entityId && { paymentId: entityId }),
        ...(entityType === 'bill' && entityId && { billId: entityId }),
        ...(entityType === 'job' && entityId && { jobId: entityId }),
        ...(entityType === 'task' && entityId && { taskId: entityId }),
        ...(entityType === 'client' && entityId && { clientId: entityId })
      }
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error("Error creating document:", error)
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 })
  }
} 
