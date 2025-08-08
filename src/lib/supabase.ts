import { createClient } from "@supabase/supabase-js";

// For local development, we'll use direct PostgreSQL connection
// instead of Supabase client since we have a local PostgreSQL database
const createSupabaseClient = () => {
  console.warn(
    "⚠️  Using local PostgreSQL database for development."
  );
  return createMockSupabaseClient();
};

const createMockSupabaseClient = () => {
  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: null, error: null }),
          limit: (count: number) => Promise.resolve({ data: [], error: null }),
        }),
        limit: (count: number) => Promise.resolve({ data: [], error: null }),
        order: (column: string, options?: any) =>
          Promise.resolve({ data: [], error: null }),
      }),
      insert: (data: any) => ({
        select: () => Promise.resolve({ data: [data], error: null }),
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => Promise.resolve({ data: [data], error: null }),
        }),
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ error: null }),
      }),
    }),
  };
};

export const supabase = createSupabaseClient() as any;

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          company_name: string | null;
          subscription: string;
          flow_access: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          company_name?: string | null;
          subscription?: string;
          flow_access?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          company_name?: string | null;
          subscription?: string;
          flow_access?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      accounts: {
        Row: {
          id: string;
          name: string;
          type: string;
          number: string | null;
          balance: number;
          is_active: boolean;
          description: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          number?: string | null;
          balance?: number;
          is_active?: boolean;
          description?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          number?: string | null;
          balance?: number;
          is_active?: boolean;
          description?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          date: string;
          description: string;
          amount: number;
          type: string;
          reference: string | null;
          is_reconciled: boolean;
          category_id: string | null;
          account_id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          description: string;
          amount: number;
          type: string;
          reference?: string | null;
          is_reconciled?: boolean;
          category_id?: string | null;
          account_id: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          description?: string;
          amount?: number;
          type?: string;
          reference?: string | null;
          is_reconciled?: boolean;
          category_id?: string | null;
          account_id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          type: string;
          description: string | null;
          is_active: boolean;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          description?: string | null;
          is_active?: boolean;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          description?: string | null;
          is_active?: boolean;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          country: string | null;
          status: string;
          total_invoiced: number;
          total_paid: number;
          balance: number;
          last_transaction_date: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          country?: string | null;
          status?: string;
          total_invoiced?: number;
          total_paid?: number;
          balance?: number;
          last_transaction_date?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          country?: string | null;
          status?: string;
          total_invoiced?: number;
          total_paid?: number;
          balance?: number;
          last_transaction_date?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      vendors: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          country: string | null;
          status: string;
          total_billed: number;
          total_paid: number;
          balance: number;
          last_transaction_date: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          country?: string | null;
          status?: string;
          total_billed?: number;
          total_paid?: number;
          balance?: number;
          last_transaction_date?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          country?: string | null;
          status?: string;
          total_billed?: number;
          total_paid?: number;
          balance?: number;
          last_transaction_date?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          number: string;
          date: string;
          due_date: string;
          status: string;
          subtotal: number;
          tax: number;
          total: number;
          notes: string | null;
          customer_id: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          number: string;
          date: string;
          due_date: string;
          status: string;
          subtotal: number;
          tax?: number;
          total: number;
          notes?: string | null;
          customer_id?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          number?: string;
          date?: string;
          due_date?: string;
          status?: string;
          subtotal?: number;
          tax?: number;
          total?: number;
          notes?: string | null;
          customer_id?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      bills: {
        Row: {
          id: string;
          number: string;
          date: string;
          due_date: string;
          status: string;
          subtotal: number;
          tax: number;
          total: number;
          notes: string | null;
          vendor_id: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          number: string;
          date: string;
          due_date: string;
          status: string;
          subtotal: number;
          tax?: number;
          total: number;
          notes?: string | null;
          vendor_id?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          number?: string;
          date?: string;
          due_date?: string;
          status?: string;
          subtotal?: number;
          tax?: number;
          total?: number;
          notes?: string | null;
          vendor_id?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          amount: number;
          method: string;
          reference: string | null;
          notes: string | null;
          date: string;
          status: string;
          customer_id: string | null;
          invoice_id: string | null;
          transaction_id: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          amount: number;
          method: string;
          reference?: string | null;
          notes?: string | null;
          date: string;
          status: string;
          customer_id?: string | null;
          invoice_id?: string | null;
          transaction_id?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          amount?: number;
          method?: string;
          reference?: string | null;
          notes?: string | null;
          date?: string;
          status?: string;
          customer_id?: string | null;
          invoice_id?: string | null;
          transaction_id?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string;
          status: string;
          start_date: string;
          end_date: string | null;
          budget: number;
          actual_cost: number;
          customer_id: string | null;
          manager: string;
          team_size: number;
          progress: number;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          status: string;
          start_date: string;
          end_date?: string | null;
          budget?: number;
          actual_cost?: number;
          customer_id?: string | null;
          manager: string;
          team_size?: number;
          progress?: number;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          status?: string;
          start_date?: string;
          end_date?: string | null;
          budget?: number;
          actual_cost?: number;
          customer_id?: string | null;
          manager?: string;
          team_size?: number;
          progress?: number;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          name: string;
          file_name: string;
          file_type: string;
          file_size: number;
          file_path: string;
          description: string | null;
          tags: string | null;
          invoice_id: string | null;
          transaction_id: string | null;
          payment_id: string | null;
          bill_id: string | null;
          job_id: string | null;
          task_id: string | null;
          client_id: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          file_name: string;
          file_type: string;
          file_size: number;
          file_path: string;
          description?: string | null;
          tags?: string | null;
          invoice_id?: string | null;
          transaction_id?: string | null;
          payment_id?: string | null;
          bill_id?: string | null;
          job_id?: string | null;
          task_id?: string | null;
          client_id?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          file_name?: string;
          file_type?: string;
          file_size?: number;
          file_path?: string;
          description?: string | null;
          tags?: string | null;
          invoice_id?: string | null;
          transaction_id?: string | null;
          payment_id?: string | null;
          bill_id?: string | null;
          job_id?: string | null;
          task_id?: string | null;
          client_id?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          title: string;
          message: string;
          type: string;
          priority: string;
          is_read: boolean;
          is_sent: boolean;
          scheduled_for: string | null;
          sent_at: string | null;
          transaction_id: string | null;
          invoice_id: string | null;
          payment_id: string | null;
          bill_id: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          message: string;
          type: string;
          priority: string;
          is_read?: boolean;
          is_sent?: boolean;
          scheduled_for?: string | null;
          sent_at?: string | null;
          transaction_id?: string | null;
          invoice_id?: string | null;
          payment_id?: string | null;
          bill_id?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          message?: string;
          type?: string;
          priority?: string;
          is_read?: boolean;
          is_sent?: boolean;
          scheduled_for?: string | null;
          sent_at?: string | null;
          transaction_id?: string | null;
          invoice_id?: string | null;
          payment_id?: string | null;
          bill_id?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          company_name: string | null;
          industry: string | null;
          status: string;
          assigned_to: string | null;
          total_revenue: number;
          active_jobs: number;
          last_contact: string | null;
          next_follow_up: string | null;
          documents: number;
          communications: number;
          engagement_status: string;
          engagement_letter: boolean;
          conflict_check: string;
          risk_assessment: string;
          risk_factors: string[];
          quality_review: string;
          compliance_status: string;
          billing_model: string;
          retainer_amount: number | null;
          hourly_rate: number | null;
          special_instructions: string | null;
          tax_year: string | null;
          filing_status: string | null;
          entity_type: string | null;
          deadline_reminders: boolean;
          portal_access: boolean;
          secure_messaging: boolean;
          address: string | null;
          website: string | null;
          primary_contact: string | null;
          secondary_contact: string | null;
          notes: string | null;
          tags: string[];
          next_deadline: string | null;
          outstanding_balance: number;
          payment_terms: string | null;
          credit_limit: number | null;
          risk_score: number;
          satisfaction_score: number;
          referral_source: string | null;
          marketing_consent: boolean;
          data_retention: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          company_name?: string | null;
          industry?: string | null;
          status?: string;
          assigned_to?: string | null;
          total_revenue?: number;
          active_jobs?: number;
          last_contact?: string | null;
          next_follow_up?: string | null;
          documents?: number;
          communications?: number;
          engagement_status?: string;
          engagement_letter?: boolean;
          conflict_check?: string;
          risk_assessment?: string;
          risk_factors?: string[];
          quality_review?: string;
          compliance_status?: string;
          billing_model?: string;
          retainer_amount?: number | null;
          hourly_rate?: number | null;
          special_instructions?: string | null;
          tax_year?: string | null;
          filing_status?: string | null;
          entity_type?: string | null;
          deadline_reminders?: boolean;
          portal_access?: boolean;
          secure_messaging?: boolean;
          address?: string | null;
          website?: string | null;
          primary_contact?: string | null;
          secondary_contact?: string | null;
          notes?: string | null;
          tags?: string[];
          next_deadline?: string | null;
          outstanding_balance?: number;
          payment_terms?: string | null;
          credit_limit?: number | null;
          risk_score?: number;
          satisfaction_score?: number;
          referral_source?: string | null;
          marketing_consent?: boolean;
          data_retention?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          company_name?: string | null;
          industry?: string | null;
          status?: string;
          assigned_to?: string | null;
          total_revenue?: number;
          active_jobs?: number;
          last_contact?: string | null;
          next_follow_up?: string | null;
          documents?: number;
          communications?: number;
          engagement_status?: string;
          engagement_letter?: boolean;
          conflict_check?: string;
          risk_assessment?: string;
          risk_factors?: string[];
          quality_review?: string;
          compliance_status?: string;
          billing_model?: string;
          retainer_amount?: number | null;
          hourly_rate?: number | null;
          special_instructions?: string | null;
          tax_year?: string | null;
          filing_status?: string | null;
          entity_type?: string | null;
          deadline_reminders?: boolean;
          portal_access?: boolean;
          secure_messaging?: boolean;
          address?: string | null;
          website?: string | null;
          primary_contact?: string | null;
          secondary_contact?: string | null;
          notes?: string | null;
          tags?: string[];
          next_deadline?: string | null;
          outstanding_balance?: number;
          payment_terms?: string | null;
          credit_limit?: number | null;
          risk_score?: number;
          satisfaction_score?: number;
          referral_source?: string | null;
          marketing_consent?: boolean;
          data_retention?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          status: string;
          priority: string;
          start_date: string | null;
          due_date: string | null;
          completed_date: string | null;
          budget: number;
          actual_cost: number;
          billable_hours: number;
          client_id: string | null;
          project_id: string | null;
          assigned_to: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          status: string;
          priority: string;
          start_date?: string | null;
          due_date?: string | null;
          completed_date?: string | null;
          budget?: number;
          actual_cost?: number;
          billable_hours?: number;
          client_id?: string | null;
          project_id?: string | null;
          assigned_to?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          status?: string;
          priority?: string;
          start_date?: string | null;
          due_date?: string | null;
          completed_date?: string | null;
          budget?: number;
          actual_cost?: number;
          billable_hours?: number;
          client_id?: string | null;
          project_id?: string | null;
          assigned_to?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          status: string;
          priority: string;
          start_date: string | null;
          due_date: string | null;
          completed_date: string | null;
          estimated_hours: number;
          actual_hours: number;
          billable: boolean;
          client_id: string | null;
          job_id: string | null;
          assigned_to: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          status: string;
          priority: string;
          start_date?: string | null;
          due_date?: string | null;
          completed_date?: string | null;
          estimated_hours?: number;
          actual_hours?: number;
          billable?: boolean;
          client_id?: string | null;
          job_id?: string | null;
          assigned_to?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          status?: string;
          priority?: string;
          start_date?: string | null;
          due_date?: string | null;
          completed_date?: string | null;
          estimated_hours?: number;
          actual_hours?: number;
          billable?: boolean;
          client_id?: string | null;
          job_id?: string | null;
          assigned_to?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      calendar_events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          start: string;
          end: string;
          all_day: boolean;
          location: string | null;
          status: string;
          priority: string;
          type: string;
          source: string | null;
          is_auto_generated: boolean;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          start: string;
          end: string;
          all_day?: boolean;
          location?: string | null;
          status: string;
          priority: string;
          type: string;
          source?: string | null;
          is_auto_generated?: boolean;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          start?: string;
          end?: string;
          all_day?: boolean;
          location?: string | null;
          status?: string;
          priority?: string;
          type?: string;
          source?: string | null;
          is_auto_generated?: boolean;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      recurring_transactions: {
        Row: {
          id: string;
          description: string;
          amount: number;
          type: string;
          frequency: string;
          interval: number;
          start_date: string;
          end_date: string | null;
          last_processed: string | null;
          next_due_date: string;
          is_active: boolean;
          category_id: string | null;
          account_id: string;
          notes: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          description: string;
          amount: number;
          type: string;
          frequency: string;
          interval?: number;
          start_date: string;
          end_date?: string | null;
          last_processed?: string | null;
          next_due_date: string;
          is_active?: boolean;
          category_id?: string | null;
          account_id: string;
          notes?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          description?: string;
          amount?: number;
          type?: string;
          frequency?: string;
          interval?: number;
          start_date?: string;
          end_date?: string | null;
          last_processed?: string | null;
          next_due_date?: string;
          is_active?: boolean;
          category_id?: string | null;
          account_id?: string;
          notes?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      recurring_invoices: {
        Row: {
          id: string;
          number: string;
          description: string;
          subtotal: number;
          tax: number;
          total: number;
          frequency: string;
          interval: number;
          start_date: string;
          end_date: string | null;
          last_processed: string | null;
          next_due_date: string;
          is_active: boolean;
          customer_id: string;
          notes: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          number: string;
          description: string;
          subtotal: number;
          tax?: number;
          total: number;
          frequency: string;
          interval?: number;
          start_date: string;
          end_date?: string | null;
          last_processed?: string | null;
          next_due_date: string;
          is_active?: boolean;
          customer_id: string;
          notes?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          number?: string;
          description?: string;
          subtotal?: number;
          tax?: number;
          total?: number;
          frequency?: string;
          interval?: number;
          start_date?: string;
          end_date?: string | null;
          last_processed?: string | null;
          next_due_date?: string;
          is_active?: boolean;
          customer_id?: string;
          notes?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      recurring_bills: {
        Row: {
          id: string;
          number: string;
          description: string;
          subtotal: number;
          tax: number;
          total: number;
          frequency: string;
          interval: number;
          start_date: string;
          end_date: string | null;
          last_processed: string | null;
          next_due_date: string;
          is_active: boolean;
          vendor_id: string;
          notes: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          number: string;
          description: string;
          subtotal: number;
          tax?: number;
          total: number;
          frequency: string;
          interval?: number;
          start_date: string;
          end_date?: string | null;
          last_processed?: string | null;
          next_due_date: string;
          is_active?: boolean;
          vendor_id: string;
          notes?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          number?: string;
          description?: string;
          subtotal?: number;
          tax?: number;
          total?: number;
          frequency?: string;
          interval?: number;
          start_date?: string;
          end_date?: string | null;
          last_processed?: string | null;
          next_due_date?: string;
          is_active?: boolean;
          vendor_id?: string;
          notes?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      workflow_rules: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          trigger: string;
          conditions: any;
          actions: any;
          is_active: boolean;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          trigger: string;
          conditions: any;
          actions: any;
          is_active?: boolean;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          trigger?: string;
          conditions?: any;
          actions?: any;
          is_active?: boolean;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_suggestions: {
        Row: {
          id: string;
          type: string;
          title: string;
          description: string;
          confidence: number;
          action: string | null;
          metadata: any | null;
          is_applied: boolean;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          title: string;
          description: string;
          confidence: number;
          action?: string | null;
          metadata?: any | null;
          is_applied?: boolean;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          title?: string;
          description?: string;
          confidence?: number;
          action?: string | null;
          metadata?: any | null;
          is_applied?: boolean;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          action: string;
          entity: string;
          entity_id: string;
          old_values: any | null;
          new_values: any | null;
          user_id: string;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          action: string;
          entity: string;
          entity_id: string;
          old_values?: any | null;
          new_values?: any | null;
          user_id: string;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          action?: string;
          entity?: string;
          entity_id?: string;
          old_values?: any | null;
          new_values?: any | null;
          user_id?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
