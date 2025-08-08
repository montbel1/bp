import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// GET /api/industry - Get available industries
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const industries = await prisma.industry.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(industries);
  } catch (error) {
    console.error('Error fetching industries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/industry - Save industry configuration
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { industryId, settings, workflows, templates, billingModel, compliance, terminology } = body;

    // Get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if industry exists
    const industry = await prisma.industry.findUnique({
      where: { id: industryId }
    });

    if (!industry) {
      return NextResponse.json({ error: 'Industry not found' }, { status: 404 });
    }

    // Upsert industry configuration
    const industryConfig = await prisma.industryConfig.upsert({
      where: {
        industryId_userId: {
          industryId,
          userId: user.id
        }
      },
      update: {
        settings: JSON.stringify(settings),
        workflows: JSON.stringify(workflows),
        templates: JSON.stringify(templates),
        billingModel: JSON.stringify(billingModel),
        compliance: JSON.stringify(compliance),
        terminology: JSON.stringify(terminology),
        updatedAt: new Date()
      },
      create: {
        industryId,
        userId: user.id,
        settings: JSON.stringify(settings),
        workflows: JSON.stringify(workflows),
        templates: JSON.stringify(templates),
        billingModel: JSON.stringify(billingModel),
        compliance: JSON.stringify(compliance),
        terminology: JSON.stringify(terminology)
      }
    });

    return NextResponse.json(industryConfig);
  } catch (error) {
    console.error('Error saving industry configuration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
