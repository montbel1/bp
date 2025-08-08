import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// POST /api/test-data/industry-setup - Setup industry data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create industries
    const industries = await Promise.all([
      prisma.industry.upsert({
        where: { code: 'healthcare' },
        update: {},
        create: {
          name: 'Healthcare',
          code: 'healthcare',
          description: 'Medical offices, dental practices, veterinary clinics',
          icon: 'Stethoscope',
          color: '#10B981',
          features: JSON.stringify(['Patient Management', 'Appointment Scheduling', 'Insurance Billing', 'HIPAA Compliance']),
          compliance: JSON.stringify(['HIPAA', 'HITECH', 'State Medical Regulations'])
        }
      }),
      prisma.industry.upsert({
        where: { code: 'legal' },
        update: {},
        create: {
          name: 'Legal',
          code: 'legal',
          description: 'Law firms, solo practitioners, legal consultants',
          icon: 'Scale',
          color: '#3B82F6',
          features: JSON.stringify(['Case Management', 'Court Scheduling', 'Document Automation', 'Client Billing']),
          compliance: JSON.stringify(['Attorney Ethics Rules', 'Client Confidentiality', 'Court Filing Requirements'])
        }
      }),
      prisma.industry.upsert({
        where: { code: 'financial' },
        update: {},
        create: {
          name: 'Financial Services',
          code: 'financial',
          description: 'Accounting firms, financial advisors, tax preparers',
          icon: 'Calculator',
          color: '#F59E0B',
          features: JSON.stringify(['Tax Season Workflows', 'Client Portfolio Management', 'Regulatory Compliance', 'Financial Reporting']),
          compliance: JSON.stringify(['IRS Regulations', 'SEC Requirements', 'State Tax Laws', 'Financial Privacy'])
        }
      }),
      prisma.industry.upsert({
        where: { code: 'real-estate' },
        update: {},
        create: {
          name: 'Real Estate',
          code: 'real-estate',
          description: 'Real estate agents, property managers, brokers',
          icon: 'Home',
          color: '#8B5CF6',
          features: JSON.stringify(['Property Management', 'Showing Scheduling', 'Commission Tracking', 'Transaction Management']),
          compliance: JSON.stringify(['Real Estate Licensing', 'Fair Housing Laws', 'Property Disclosure Requirements'])
        }
      }),
      prisma.industry.upsert({
        where: { code: 'consulting' },
        update: {},
        create: {
          name: 'Consulting & Professional Services',
          code: 'consulting',
          description: 'Management consultants, IT consultants, marketing agencies',
          icon: 'Users',
          color: '#EF4444',
          features: JSON.stringify(['Project Management', 'Time Tracking', 'Client Collaboration', 'Resource Planning']),
          compliance: JSON.stringify(['Professional Licensing', 'Client Confidentiality', 'Industry Standards'])
        }
      }),
      prisma.industry.upsert({
        where: { code: 'creative' },
        update: {},
        create: {
          name: 'Creative & Media',
          code: 'creative',
          description: 'Design agencies, marketing firms, content creators',
          icon: 'Palette',
          color: '#EC4899',
          features: JSON.stringify(['Creative Asset Management', 'Project Billing', 'Client Approval Workflows', 'Portfolio Management']),
          compliance: JSON.stringify(['Copyright Protection', 'Client IP Rights', 'Creative Licensing'])
        }
      }),
      prisma.industry.upsert({
        where: { code: 'technology' },
        update: {},
        create: {
          name: 'Technology & Startups',
          code: 'technology',
          description: 'Software companies, tech startups, IT services',
          icon: 'Code',
          color: '#06B6D4',
          features: JSON.stringify(['Agile Project Management', 'Development Time Tracking', 'Client Management', 'Technical Documentation']),
          compliance: JSON.stringify(['Data Privacy', 'Software Licensing', 'Technical Standards'])
        }
      })
    ]);

    // Get industry IDs
    const healthcare = await prisma.industry.findUnique({ where: { code: 'healthcare' } });
    const legal = await prisma.industry.findUnique({ where: { code: 'legal' } });
    const financial = await prisma.industry.findUnique({ where: { code: 'financial' } });
    const realEstate = await prisma.industry.findUnique({ where: { code: 'real-estate' } });
    const consulting = await prisma.industry.findUnique({ where: { code: 'consulting' } });
    const creative = await prisma.industry.findUnique({ where: { code: 'creative' } });
    const technology = await prisma.industry.findUnique({ where: { code: 'technology' } });

    // Create industry workflows
    const workflows = await Promise.all([
      // Healthcare workflows
      prisma.industryWorkflow.upsert({
        where: { id: 'healthcare-patient-intake' },
        update: {},
        create: {
          id: 'healthcare-patient-intake',
          name: 'Patient Intake',
          description: 'New patient registration and initial assessment',
          industryId: healthcare!.id,
          steps: JSON.stringify([
            { name: 'Patient Registration', description: 'Collect patient information' },
            { name: 'Medical History Review', description: 'Review patient medical history' },
            { name: 'Insurance Verification', description: 'Verify insurance coverage' },
            { name: 'Initial Assessment', description: 'Conduct initial medical assessment' }
          ]),
          isDefault: true
        }
      }),
      prisma.industryWorkflow.upsert({
        where: { id: 'healthcare-appointment-scheduling' },
        update: {},
        create: {
          id: 'healthcare-appointment-scheduling',
          name: 'Appointment Scheduling',
          description: 'Schedule and manage patient appointments',
          industryId: healthcare!.id,
          steps: JSON.stringify([
            { name: 'Check Availability', description: 'Check provider availability' },
            { name: 'Schedule Appointment', description: 'Schedule the appointment' },
            { name: 'Send Confirmation', description: 'Send appointment confirmation' },
            { name: 'Follow-up Reminder', description: 'Send follow-up reminders' }
          ]),
          isDefault: true
        }
      }),
      // Legal workflows
      prisma.industryWorkflow.upsert({
        where: { id: 'legal-case-intake' },
        update: {},
        create: {
          id: 'legal-case-intake',
          name: 'Case Intake',
          description: 'Initial client consultation and case assessment',
          industryId: legal!.id,
          steps: JSON.stringify([
            { name: 'Client Consultation', description: 'Initial client meeting' },
            { name: 'Case Assessment', description: 'Assess case merits and requirements' },
            { name: 'Conflict Check', description: 'Check for conflicts of interest' },
            { name: 'Engagement Agreement', description: 'Prepare and sign engagement agreement' }
          ]),
          isDefault: true
        }
      }),
      // Financial workflows
      prisma.industryWorkflow.upsert({
        where: { id: 'financial-tax-preparation' },
        update: {},
        create: {
          id: 'financial-tax-preparation',
          name: 'Tax Preparation',
          description: 'Complete tax return preparation workflow',
          industryId: financial!.id,
          steps: JSON.stringify([
            { name: 'Client Information Gathering', description: 'Collect client tax information' },
            { name: 'Document Review', description: 'Review and organize tax documents' },
            { name: 'Tax Return Preparation', description: 'Prepare tax returns' },
            { name: 'Review and Filing', description: 'Review and file tax returns' }
          ]),
          isDefault: true
        }
      })
    ]);

    // Create industry tasks
    const tasks = await Promise.all([
      // Healthcare tasks
      prisma.industryTask.upsert({
        where: { id: 'healthcare-patient-registration' },
        update: {},
        create: {
          id: 'healthcare-patient-registration',
          name: 'Patient Registration',
          description: 'Register new patients in the system',
          industryId: healthcare!.id,
          category: 'Administrative',
          estimatedHours: 0.5,
          isBillable: false,
          isDefault: true
        }
      }),
      prisma.industryTask.upsert({
        where: { id: 'healthcare-treatment-planning' },
        update: {},
        create: {
          id: 'healthcare-treatment-planning',
          name: 'Treatment Planning',
          description: 'Create and manage treatment plans',
          industryId: healthcare!.id,
          category: 'Clinical',
          estimatedHours: 2.0,
          isBillable: true,
          isDefault: true
        }
      }),
      // Legal tasks
      prisma.industryTask.upsert({
        where: { id: 'legal-client-consultation' },
        update: {},
        create: {
          id: 'legal-client-consultation',
          name: 'Client Consultation',
          description: 'Initial client consultation meeting',
          industryId: legal!.id,
          category: 'Client Relations',
          estimatedHours: 1.0,
          isBillable: true,
          isDefault: true
        }
      }),
      prisma.industryTask.upsert({
        where: { id: 'legal-document-review' },
        update: {},
        create: {
          id: 'legal-document-review',
          name: 'Document Review',
          description: 'Review legal documents and contracts',
          industryId: legal!.id,
          category: 'Legal Work',
          estimatedHours: 2.0,
          isBillable: true,
          isDefault: true
        }
      })
    ]);

    // Create industry deliverables
    const deliverables = await Promise.all([
      // Healthcare deliverables
      prisma.industryDeliverable.upsert({
        where: { id: 'healthcare-patient-records' },
        update: {},
        create: {
          id: 'healthcare-patient-records',
          name: 'Patient Records',
          description: 'Comprehensive patient medical records',
          industryId: healthcare!.id,
          type: 'DOCUMENT',
          template: JSON.stringify({
            sections: ['Patient Information', 'Medical History', 'Treatment Plans', 'Notes']
          }),
          isDefault: true
        }
      }),
      // Legal deliverables
      prisma.industryDeliverable.upsert({
        where: { id: 'legal-legal-documents' },
        update: {},
        create: {
          id: 'legal-legal-documents',
          name: 'Legal Documents',
          description: 'Contracts, agreements, and legal filings',
          industryId: legal!.id,
          type: 'DOCUMENT',
          template: JSON.stringify({
            sections: ['Parties', 'Terms', 'Conditions', 'Signatures']
          }),
          isDefault: true
        }
      })
    ]);

    // Create industry billing models
    const billingModels = await Promise.all([
      // Healthcare billing
      prisma.industryBillingModel.upsert({
        where: { id: 'healthcare-fee-for-service' },
        update: {},
        create: {
          id: 'healthcare-fee-for-service',
          name: 'Fee-for-Service',
          description: 'Fixed fees for specific services',
          industryId: healthcare!.id,
          type: 'FIXED',
          rates: JSON.stringify({
            consultation: 150,
            treatment: 300,
            followUp: 100
          }),
          isDefault: true
        }
      }),
      // Legal billing
      prisma.industryBillingModel.upsert({
        where: { id: 'legal-hourly-billing' },
        update: {},
        create: {
          id: 'legal-hourly-billing',
          name: 'Hourly Billing',
          description: 'Time-based hourly billing',
          industryId: legal!.id,
          type: 'HOURLY',
          rates: JSON.stringify({
            partner: 350,
            associate: 250,
            paralegal: 150
          }),
          isDefault: true
        }
      })
    ]);

    return NextResponse.json({
      message: 'Industry data setup completed successfully',
      industries: industries.length,
      workflows: workflows.length,
      tasks: tasks.length,
      deliverables: deliverables.length,
      billingModels: billingModels.length
    });

  } catch (error) {
    console.error('Error setting up industry data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
