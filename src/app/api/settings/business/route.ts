import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// Industry configurations with default settings for each type
const industryConfigs = {
  E_COMMERCE: {
    defaultJobTypes: ['Product Development', 'Marketing Campaign', 'Customer Support', 'Inventory Management'],
    defaultTaskTypes: ['Product Research', 'SEO Optimization', 'Social Media Marketing', 'Order Processing'],
    defaultClientTypes: ['Online Customer', 'Wholesale Buyer', 'Affiliate Partner'],
    defaultCategories: ['Online Sales', 'Marketing Expenses', 'Shipping Costs', 'Platform Fees'],
    aiFocusAreas: ['Customer Behavior Analysis', 'Inventory Optimization', 'Marketing ROI'],
    aiKeywords: ['ecommerce', 'online sales', 'digital marketing', 'inventory', 'shipping'],
    appointmentTypes: ['Customer Consultation', 'Product Demo', 'Support Call'],
    defaultDuration: 30
  },
  BRICK_AND_MORTAR: {
    defaultJobTypes: ['Store Management', 'Inventory Control', 'Customer Service', 'Staff Training'],
    defaultTaskTypes: ['Stock Count', 'Customer Assistance', 'Store Maintenance', 'Sales Training'],
    defaultClientTypes: ['Walk-in Customer', 'Regular Customer', 'Business Client'],
    defaultCategories: ['Retail Sales', 'Store Rent', 'Utilities', 'Staff Wages'],
    aiFocusAreas: ['Foot Traffic Analysis', 'Inventory Management', 'Customer Retention'],
    aiKeywords: ['retail', 'brick and mortar', 'inventory', 'customer service', 'store management'],
    appointmentTypes: ['Customer Meeting', 'Staff Training', 'Vendor Meeting'],
    defaultDuration: 45
  },
  SERVICE_CONTRACTOR: {
    defaultJobTypes: ['Project Management', 'Site Work', 'Client Consultation', 'Equipment Maintenance'],
    defaultTaskTypes: ['Site Assessment', 'Material Procurement', 'Quality Control', 'Safety Inspection'],
    defaultClientTypes: ['Residential Client', 'Commercial Client', 'Government Contract'],
    defaultCategories: ['Labor Costs', 'Materials', 'Equipment Rental', 'Insurance'],
    aiFocusAreas: ['Project Timeline Optimization', 'Resource Allocation', 'Cost Estimation'],
    aiKeywords: ['contractor', 'construction', 'project management', 'labor', 'materials'],
    appointmentTypes: ['Site Visit', 'Client Meeting', 'Project Review'],
    defaultDuration: 60
  },
  CREATIVE_FREELANCER: {
    defaultJobTypes: ['Design Project', 'Content Creation', 'Brand Development', 'Client Consultation'],
    defaultTaskTypes: ['Concept Development', 'Design Iteration', 'Client Feedback', 'Project Delivery'],
    defaultClientTypes: ['Startup', 'Small Business', 'Individual Client', 'Agency'],
    defaultCategories: ['Design Services', 'Software Subscriptions', 'Equipment', 'Travel'],
    aiFocusAreas: ['Design Trend Analysis', 'Client Preference Learning', 'Project Estimation'],
    aiKeywords: ['design', 'creative', 'freelance', 'branding', 'content creation'],
    appointmentTypes: ['Client Consultation', 'Project Review', 'Design Presentation'],
    defaultDuration: 45
  },
  RETAIL_STORE: {
    defaultJobTypes: ['Store Operations', 'Inventory Management', 'Customer Service', 'Marketing'],
    defaultTaskTypes: ['Stock Replenishment', 'Customer Assistance', 'Sales Training', 'Promotion Setup'],
    defaultClientTypes: ['Retail Customer', 'Wholesale Client', 'Regular Customer'],
    defaultCategories: ['Retail Sales', 'Cost of Goods', 'Store Expenses', 'Marketing'],
    aiFocusAreas: ['Sales Pattern Analysis', 'Inventory Optimization', 'Customer Behavior'],
    aiKeywords: ['retail', 'sales', 'inventory', 'customer service', 'merchandising'],
    appointmentTypes: ['Customer Consultation', 'Staff Meeting', 'Vendor Meeting'],
    defaultDuration: 30
  },
  HEALTHCARE_FAMILY_PHYSICIAN: {
    defaultJobTypes: ['Patient Care', 'Medical Consultation', 'Preventive Care', 'Follow-up'],
    defaultTaskTypes: ['Patient Assessment', 'Treatment Planning', 'Medical Records', 'Patient Education'],
    defaultClientTypes: ['Individual Patient', 'Family', 'Insurance Provider'],
    defaultCategories: ['Medical Services', 'Office Supplies', 'Medical Equipment', 'Insurance'],
    aiFocusAreas: ['Patient Care Optimization', 'Treatment Effectiveness', 'Preventive Care'],
    aiKeywords: ['healthcare', 'medical', 'patient care', 'family medicine', 'preventive care'],
    appointmentTypes: ['Initial Consultation', 'Follow-up Visit', 'Preventive Care'],
    defaultDuration: 30
  },
  HEALTHCARE_DENTAL_PRACTICE: {
    defaultJobTypes: ['Dental Treatment', 'Patient Care', 'Hygiene Services', 'Emergency Care'],
    defaultTaskTypes: ['Patient Assessment', 'Treatment Planning', 'Dental Procedures', 'Patient Education'],
    defaultClientTypes: ['Dental Patient', 'Family', 'Insurance Provider'],
    defaultCategories: ['Dental Services', 'Medical Supplies', 'Dental Equipment', 'Insurance'],
    aiFocusAreas: ['Treatment Planning', 'Patient Care Coordination', 'Preventive Dentistry'],
    aiKeywords: ['dental', 'oral health', 'dental care', 'hygiene', 'treatment'],
    appointmentTypes: ['Initial Consultation', 'Cleaning', 'Treatment', 'Follow-up'],
    defaultDuration: 60
  },
  HEALTHCARE_PHYSICAL_THERAPY: {
    defaultJobTypes: ['Therapy Session', 'Patient Assessment', 'Treatment Planning', 'Progress Monitoring'],
    defaultTaskTypes: ['Patient Evaluation', 'Treatment Session', 'Progress Notes', 'Patient Education'],
    defaultClientTypes: ['Therapy Patient', 'Insurance Provider', 'Referral Source'],
    defaultCategories: ['Therapy Services', 'Medical Supplies', 'Equipment', 'Insurance'],
    aiFocusAreas: ['Treatment Progress Tracking', 'Patient Recovery Optimization', 'Exercise Planning'],
    aiKeywords: ['physical therapy', 'rehabilitation', 'therapy', 'patient care', 'recovery'],
    appointmentTypes: ['Initial Evaluation', 'Therapy Session', 'Progress Review'],
    defaultDuration: 45
  },
  LEGAL_FAMILY_LAWYER: {
    defaultJobTypes: ['Case Management', 'Client Consultation', 'Document Preparation', 'Court Representation'],
    defaultTaskTypes: ['Client Meeting', 'Document Review', 'Research', 'Court Preparation'],
    defaultClientTypes: ['Individual Client', 'Family', 'Court System'],
    defaultCategories: ['Legal Services', 'Court Fees', 'Research Costs', 'Office Expenses'],
    aiFocusAreas: ['Case Analysis', 'Document Review', 'Legal Research'],
    aiKeywords: ['family law', 'legal', 'divorce', 'custody', 'family court'],
    appointmentTypes: ['Initial Consultation', 'Case Review', 'Court Appearance'],
    defaultDuration: 60
  },
  LEGAL_CRIMINAL_LAWYER: {
    defaultJobTypes: ['Case Defense', 'Client Representation', 'Investigation', 'Court Proceedings'],
    defaultTaskTypes: ['Client Interview', 'Evidence Review', 'Legal Research', 'Court Preparation'],
    defaultClientTypes: ['Defendant', 'Court System', 'Witness'],
    defaultCategories: ['Legal Services', 'Court Fees', 'Investigation Costs', 'Expert Witness'],
    aiFocusAreas: ['Case Strategy', 'Evidence Analysis', 'Legal Research'],
    aiKeywords: ['criminal law', 'defense', 'court', 'evidence', 'legal defense'],
    appointmentTypes: ['Client Meeting', 'Court Appearance', 'Case Review'],
    defaultDuration: 90
  },
  LEGAL_CORPORATE_LAWYER: {
    defaultJobTypes: ['Contract Review', 'Corporate Compliance', 'Mergers & Acquisitions', 'Legal Advisory'],
    defaultTaskTypes: ['Document Review', 'Legal Research', 'Client Consultation', 'Contract Drafting'],
    defaultClientTypes: ['Corporation', 'Business Entity', 'Board of Directors'],
    defaultCategories: ['Legal Services', 'Research Costs', 'Filing Fees', 'Office Expenses'],
    aiFocusAreas: ['Contract Analysis', 'Compliance Monitoring', 'Risk Assessment'],
    aiKeywords: ['corporate law', 'business law', 'contracts', 'compliance', 'mergers'],
    appointmentTypes: ['Client Meeting', 'Board Meeting', 'Contract Review'],
    defaultDuration: 120
  },
  ACCOUNTING_CPA_FIRM: {
    defaultJobTypes: ['Tax Preparation', 'Audit Services', 'Financial Consulting', 'Compliance'],
    defaultTaskTypes: ['Document Review', 'Tax Calculation', 'Audit Procedures', 'Client Meeting'],
    defaultClientTypes: ['Individual Taxpayer', 'Business Client', 'Non-profit Organization'],
    defaultCategories: ['Professional Services', 'Software Subscriptions', 'Office Expenses', 'Continuing Education'],
    aiFocusAreas: ['Tax Optimization', 'Financial Analysis', 'Compliance Monitoring'],
    aiKeywords: ['accounting', 'tax preparation', 'audit', 'financial consulting', 'compliance'],
    appointmentTypes: ['Tax Consultation', 'Audit Meeting', 'Financial Review'],
    defaultDuration: 60
  },
  ACCOUNTING_BOOKKEEPING_SERVICE: {
    defaultJobTypes: ['Bookkeeping', 'Financial Reporting', 'Payroll Processing', 'Reconciliation'],
    defaultTaskTypes: ['Data Entry', 'Account Reconciliation', 'Report Generation', 'Client Communication'],
    defaultClientTypes: ['Small Business', 'Startup', 'Individual'],
    defaultCategories: ['Bookkeeping Services', 'Software Subscriptions', 'Office Expenses'],
    aiFocusAreas: ['Transaction Categorization', 'Financial Analysis', 'Error Detection'],
    aiKeywords: ['bookkeeping', 'accounting', 'financial reporting', 'reconciliation', 'payroll'],
    appointmentTypes: ['Client Meeting', 'Financial Review', 'Training Session'],
    defaultDuration: 45
  },
  ACCOUNTING_FINANCIAL_ADVISOR: {
    defaultJobTypes: ['Financial Planning', 'Investment Advisory', 'Retirement Planning', 'Estate Planning'],
    defaultTaskTypes: ['Client Assessment', 'Plan Development', 'Portfolio Review', 'Client Education'],
    defaultClientTypes: ['Individual Investor', 'Retirement Client', 'High Net Worth'],
    defaultCategories: ['Advisory Services', 'Software Subscriptions', 'Research Costs', 'Office Expenses'],
    aiFocusAreas: ['Portfolio Analysis', 'Risk Assessment', 'Investment Optimization'],
    aiKeywords: ['financial planning', 'investment', 'retirement', 'estate planning', 'wealth management'],
    appointmentTypes: ['Financial Review', 'Investment Consultation', 'Planning Session'],
    defaultDuration: 90
  },
  CREATIVE_VIDEO_PRODUCTION: {
    defaultJobTypes: ['Video Production', 'Post-Production', 'Client Consultation', 'Equipment Management'],
    defaultTaskTypes: ['Pre-production Planning', 'Filming', 'Editing', 'Client Review'],
    defaultClientTypes: ['Corporate Client', 'Wedding Client', 'Commercial Client', 'Individual'],
    defaultCategories: ['Production Services', 'Equipment Rental', 'Software Licenses', 'Travel'],
    aiFocusAreas: ['Content Analysis', 'Client Preference Learning', 'Project Management'],
    aiKeywords: ['video production', 'filming', 'editing', 'post-production', 'creative'],
    appointmentTypes: ['Client Consultation', 'Production Meeting', 'Review Session'],
    defaultDuration: 60
  },
  CREATIVE_PODCAST_STUDIO: {
    defaultJobTypes: ['Podcast Production', 'Audio Editing', 'Content Creation', 'Equipment Setup'],
    defaultTaskTypes: ['Recording Session', 'Audio Editing', 'Content Planning', 'Equipment Maintenance'],
    defaultClientTypes: ['Podcast Host', 'Guest Speaker', 'Sponsor', 'Individual Client'],
    defaultCategories: ['Production Services', 'Equipment', 'Software Subscriptions', 'Studio Rent'],
    aiFocusAreas: ['Content Analysis', 'Audio Quality Optimization', 'Audience Engagement'],
    aiKeywords: ['podcast', 'audio production', 'recording', 'editing', 'content creation'],
    appointmentTypes: ['Recording Session', 'Client Meeting', 'Equipment Setup'],
    defaultDuration: 120
  },
  REAL_ESTATE_AGENT: {
    defaultJobTypes: ['Property Listing', 'Client Representation', 'Property Showings', 'Negotiation'],
    defaultTaskTypes: ['Property Research', 'Client Meeting', 'Property Showing', 'Document Preparation'],
    defaultClientTypes: ['Buyer', 'Seller', 'Investor', 'Renter'],
    defaultCategories: ['Commission Income', 'Marketing Expenses', 'Office Expenses', 'Travel'],
    aiFocusAreas: ['Market Analysis', 'Property Valuation', 'Client Matching'],
    aiKeywords: ['real estate', 'property', 'buying', 'selling', 'listing'],
    appointmentTypes: ['Property Showing', 'Client Meeting', 'Closing'],
    defaultDuration: 60
  },
  REAL_ESTATE_PROPERTY_MANAGEMENT: {
    defaultJobTypes: ['Property Management', 'Tenant Relations', 'Maintenance Coordination', 'Financial Management'],
    defaultTaskTypes: ['Property Inspection', 'Tenant Communication', 'Maintenance Request', 'Financial Reporting'],
    defaultClientTypes: ['Property Owner', 'Tenant', 'Vendor', 'Insurance Company'],
    defaultCategories: ['Management Fees', 'Maintenance Costs', 'Property Expenses', 'Insurance'],
    aiFocusAreas: ['Property Performance Analysis', 'Maintenance Optimization', 'Tenant Satisfaction'],
    aiKeywords: ['property management', 'rental', 'maintenance', 'tenant relations', 'property'],
    appointmentTypes: ['Property Inspection', 'Tenant Meeting', 'Maintenance Review'],
    defaultDuration: 45
  },
  AUTOMOTIVE_AUTO_REPAIR: {
    defaultJobTypes: ['Vehicle Repair', 'Diagnostic Services', 'Preventive Maintenance', 'Parts Management'],
    defaultTaskTypes: ['Vehicle Inspection', 'Repair Work', 'Parts Ordering', 'Quality Control'],
    defaultClientTypes: ['Individual Customer', 'Fleet Client', 'Insurance Company'],
    defaultCategories: ['Repair Services', 'Parts Inventory', 'Equipment', 'Labor'],
    aiFocusAreas: ['Diagnostic Analysis', 'Parts Optimization', 'Service Scheduling'],
    aiKeywords: ['auto repair', 'automotive', 'vehicle maintenance', 'diagnostic', 'repair'],
    appointmentTypes: ['Vehicle Inspection', 'Repair Consultation', 'Service Review'],
    defaultDuration: 90
  },
  CONSULTING_FIRM: {
    defaultJobTypes: ['Strategic Consulting', 'Process Improvement', 'Change Management', 'Project Management'],
    defaultTaskTypes: ['Client Assessment', 'Strategy Development', 'Implementation Planning', 'Progress Review'],
    defaultClientTypes: ['Corporate Client', 'Small Business', 'Government Agency', 'Non-profit'],
    defaultCategories: ['Consulting Services', 'Travel Expenses', 'Research Costs', 'Office Expenses'],
    aiFocusAreas: ['Process Analysis', 'Strategy Optimization', 'Performance Measurement'],
    aiKeywords: ['consulting', 'strategy', 'process improvement', 'change management', 'business'],
    appointmentTypes: ['Client Meeting', 'Strategy Session', 'Progress Review'],
    defaultDuration: 120
  },
  OTHER: {
    defaultJobTypes: ['General Project', 'Client Work', 'Administrative', 'Custom Task'],
    defaultTaskTypes: ['Planning', 'Execution', 'Review', 'Follow-up'],
    defaultClientTypes: ['Client', 'Customer', 'Partner'],
    defaultCategories: ['Services', 'Expenses', 'Income', 'General'],
    aiFocusAreas: ['General Analysis', 'Process Optimization', 'Performance Tracking'],
    aiKeywords: ['business', 'service', 'project', 'client', 'work'],
    appointmentTypes: ['Client Meeting', 'Project Review', 'Consultation'],
    defaultDuration: 60
  }
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Implement businessSettings model
    // const businessSettings = await prisma.businessSettings.findUnique({
    //   where: { userId: session.user.id }
    // });

    return NextResponse.json({ 
      businessSettings: null,
      industryConfigs 
    });
  } catch (error) {
    console.error('Error fetching business settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { industryType, industryName, industryDescription, customSettings } = body;

    // Get default configuration for the selected industry
    const defaultConfig = industryConfigs[industryType as keyof typeof industryConfigs] || industryConfigs.OTHER;

    // Merge custom settings with defaults
    const settings = {
      industryType,
      industryName,
      industryDescription,
      defaultJobTypes: customSettings?.defaultJobTypes || defaultConfig.defaultJobTypes,
      defaultTaskTypes: customSettings?.defaultTaskTypes || defaultConfig.defaultTaskTypes,
      defaultClientTypes: customSettings?.defaultClientTypes || defaultConfig.defaultClientTypes,
      defaultCategories: customSettings?.defaultCategories || defaultConfig.defaultCategories,
      aiFocusAreas: customSettings?.aiFocusAreas || defaultConfig.aiFocusAreas,
      aiKeywords: customSettings?.aiKeywords || defaultConfig.aiKeywords,
      appointmentTypes: customSettings?.appointmentTypes || defaultConfig.appointmentTypes,
      defaultDuration: customSettings?.defaultDuration || defaultConfig.defaultDuration,
      autoAssignTasks: customSettings?.autoAssignTasks || false,
      autoCreateInvoices: customSettings?.autoCreateInvoices || false,
      autoSendReminders: customSettings?.autoSendReminders || false,
      customJobFields: customSettings?.customJobFields || null,
      customClientFields: customSettings?.customClientFields || null,
      customTaskFields: customSettings?.customTaskFields || null,
      businessHours: customSettings?.businessHours || null
    };

    // TODO: Implement businessSettings model
    // const businessSettings = await prisma.businessSettings.upsert({
    //   where: { userId: session.user.id },
    //   update: settings,
    //   create: {
    //     ...settings,
    //     userId: session.user.id
    //   }
    // });

    const businessSettings = null;

    return NextResponse.json({ businessSettings });
  } catch (error) {
    console.error('Error saving business settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
