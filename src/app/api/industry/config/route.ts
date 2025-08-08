import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// GET /api/industry/config - Get user's industry configuration
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // In development, allow access even without session
    if (process.env.NODE_ENV === "development") {
      // Return mock data for development
      return NextResponse.json({ 
        config: {
          id: "dev-config",
          industry: "healthcare",
          subIndustry: "dental",
          settings: {
            appointmentDuration: 60,
            billingCycle: "monthly",
            taxRate: 8.25
          },
          workflows: [],
          templates: [],
          billingModel: {},
          compliance: {},
          terminology: {}
        }
      });
    }
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's industry configuration
    const industryConfig = await prisma.industryConfig.findFirst({
      where: { userId: user.id },
      include: {
        industry: true
      }
    });

    if (!industryConfig) {
      return NextResponse.json({ config: null });
    }

    // Parse JSON fields
    const config = {
      ...industryConfig,
      settings: JSON.parse(industryConfig.settings),
      workflows: industryConfig.workflows ? JSON.parse(industryConfig.workflows) : [],
      templates: industryConfig.templates ? JSON.parse(industryConfig.templates) : [],
      billingModel: industryConfig.billingModel ? JSON.parse(industryConfig.billingModel) : {},
      compliance: industryConfig.compliance ? JSON.parse(industryConfig.compliance) : {},
      terminology: industryConfig.terminology ? JSON.parse(industryConfig.terminology) : {}
    };

    return NextResponse.json({ config });
  } catch (error) {
    console.error('Error fetching industry configuration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/industry/config - Save user's industry configuration
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // In development, allow access even without session
    if (process.env.NODE_ENV === "development") {
      const body = await request.json();
      return NextResponse.json({ 
        success: true, 
        message: "Configuration saved successfully",
        config: body
      });
    }
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Upsert industry configuration
    const industryConfig = await prisma.industryConfig.upsert({
      where: { 
        industryId_userId: {
          industryId: body.industry,
          userId: user.id
        }
      },
      update: {
        settings: JSON.stringify(body.settings || {}),
        workflows: body.workflows ? JSON.stringify(body.workflows) : null,
        templates: body.templates ? JSON.stringify(body.templates) : null,
        billingModel: body.billingModel ? JSON.stringify(body.billingModel) : null,
        compliance: body.compliance ? JSON.stringify(body.compliance) : null,
        terminology: body.terminology ? JSON.stringify(body.terminology) : null
      },
      create: {
        userId: user.id,
        industryId: body.industry,
        settings: JSON.stringify(body.settings || {}),
        workflows: body.workflows ? JSON.stringify(body.workflows) : null,
        templates: body.templates ? JSON.stringify(body.templates) : null,
        billingModel: body.billingModel ? JSON.stringify(body.billingModel) : null,
        compliance: body.compliance ? JSON.stringify(body.compliance) : null,
        terminology: body.terminology ? JSON.stringify(body.terminology) : null
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Configuration saved successfully",
      config: industryConfig
    });
  } catch (error) {
    console.error('Error saving industry configuration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
