import { prisma } from "./prisma";

export interface IndustryConfig {
  id: string;
  industryId: string;
  userId: string;
  settings: any;
  workflows: string[];
  templates: string[];
  billingModel: any;
  compliance: any;
  terminology: any;
  industry: {
    id: string;
    name: string;
    code: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    features: string[];
    compliance: string[];
  };
}

export interface IndustryWorkflow {
  id: string;
  name: string;
  description: string | null;
  steps: any[];
  triggers?: any[];
  conditions?: any[];
  isDefault: boolean;
}

export interface IndustryTask {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  estimatedHours: number;
  isBillable: boolean;
  isRecurring: boolean;
  recurrencePattern?: any;
  isDefault: boolean;
}

export interface IndustryDeliverable {
  id: string;
  name: string;
  description: string | null;
  type: string;
  template?: any;
  requirements?: any[];
  isDefault: boolean;
}

export interface IndustryBillingModel {
  id: string;
  name: string;
  description: string | null;
  type: string;
  rates: any;
  rules?: any;
  isDefault: boolean;
}

export class IndustryService {
  /**
   * Get user's current industry configuration
   */
  static async getUserIndustryConfig(
    userId: string
  ): Promise<IndustryConfig | null> {
    try {
      const config = await prisma.industryConfig.findFirst({
        where: { userId },
        include: {
          industry: true,
        },
      });

      if (!config) return null;

      return {
        ...config,
        settings: JSON.parse(config.settings),
        workflows: config.workflows ? JSON.parse(config.workflows) : [],
        templates: config.templates ? JSON.parse(config.templates) : [],
        billingModel: config.billingModel
          ? JSON.parse(config.billingModel)
          : {},
        compliance: config.compliance ? JSON.parse(config.compliance) : {},
        terminology: config.terminology ? JSON.parse(config.terminology) : {},
        industry: {
          ...config.industry,
          features: config.industry.features
            ? JSON.parse(config.industry.features)
            : [],
          compliance: config.industry.compliance
            ? JSON.parse(config.industry.compliance)
            : [],
        },
      };
    } catch (error) {
      console.error("Error getting user industry config:", error);
      return null;
    }
  }

  /**
   * Save user's industry configuration
   */
  static async saveIndustryConfig(
    userId: string,
    industryId: string,
    config: {
      settings: any;
      workflows: string[];
      templates: string[];
      billingModel: any;
      compliance: any;
      terminology: any;
    }
  ): Promise<IndustryConfig> {
    try {
      const industryConfig = await prisma.industryConfig.upsert({
        where: {
          industryId_userId: {
            industryId,
            userId,
          },
        },
        update: {
          settings: JSON.stringify(config.settings),
          workflows: JSON.stringify(config.workflows),
          templates: JSON.stringify(config.templates),
          billingModel: JSON.stringify(config.billingModel),
          compliance: JSON.stringify(config.compliance),
          terminology: JSON.stringify(config.terminology),
          updatedAt: new Date(),
        },
        create: {
          industryId,
          userId,
          settings: JSON.stringify(config.settings),
          workflows: JSON.stringify(config.workflows),
          templates: JSON.stringify(config.templates),
          billingModel: JSON.stringify(config.billingModel),
          compliance: JSON.stringify(config.compliance),
          terminology: JSON.stringify(config.terminology),
        },
        include: {
          industry: true,
        },
      });

      return {
        ...industryConfig,
        settings: JSON.parse(industryConfig.settings),
        workflows: industryConfig.workflows
          ? JSON.parse(industryConfig.workflows)
          : [],
        templates: industryConfig.templates
          ? JSON.parse(industryConfig.templates)
          : [],
        billingModel: industryConfig.billingModel
          ? JSON.parse(industryConfig.billingModel)
          : {},
        compliance: industryConfig.compliance
          ? JSON.parse(industryConfig.compliance)
          : {},
        terminology: industryConfig.terminology
          ? JSON.parse(industryConfig.terminology)
          : {},
        industry: {
          ...industryConfig.industry,
          features: industryConfig.industry.features
            ? JSON.parse(industryConfig.industry.features)
            : [],
          compliance: industryConfig.industry.compliance
            ? JSON.parse(industryConfig.industry.compliance)
            : [],
        },
      };
    } catch (error) {
      console.error("Error saving industry config:", error);
      throw error;
    }
  }

  /**
   * Get industry workflows
   */
  static async getIndustryWorkflows(
    industryId: string
  ): Promise<IndustryWorkflow[]> {
    try {
      const workflows = await prisma.industryWorkflow.findMany({
        where: {
          industryId,
          isActive: true,
        },
        orderBy: { name: "asc" },
      });

      return workflows.map((workflow) => ({
        ...workflow,
        steps: JSON.parse(workflow.steps),
        triggers: workflow.triggers ? JSON.parse(workflow.triggers) : [],
        conditions: workflow.conditions ? JSON.parse(workflow.conditions) : [],
      }));
    } catch (error) {
      console.error("Error getting industry workflows:", error);
      return [];
    }
  }

  /**
   * Get industry tasks
   */
  static async getIndustryTasks(industryId: string): Promise<IndustryTask[]> {
    try {
      const tasks = await prisma.industryTask.findMany({
        where: {
          industryId,
          isActive: true,
        },
        orderBy: { name: "asc" },
      });

      return tasks.map((task) => ({
        ...task,
        recurrencePattern: task.recurrencePattern
          ? JSON.parse(task.recurrencePattern)
          : null,
      }));
    } catch (error) {
      console.error("Error getting industry tasks:", error);
      return [];
    }
  }

  /**
   * Get industry deliverables
   */
  static async getIndustryDeliverables(
    industryId: string
  ): Promise<IndustryDeliverable[]> {
    try {
      const deliverables = await prisma.industryDeliverable.findMany({
        where: {
          industryId,
          isActive: true,
        },
        orderBy: { name: "asc" },
      });

      return deliverables.map((deliverable) => ({
        ...deliverable,
        template: deliverable.template
          ? JSON.parse(deliverable.template)
          : null,
        requirements: deliverable.requirements
          ? JSON.parse(deliverable.requirements)
          : [],
      }));
    } catch (error) {
      console.error("Error getting industry deliverables:", error);
      return [];
    }
  }

  /**
   * Get industry billing models
   */
  static async getIndustryBillingModels(
    industryId: string
  ): Promise<IndustryBillingModel[]> {
    try {
      const billingModels = await prisma.industryBillingModel.findMany({
        where: {
          industryId,
          isActive: true,
        },
        orderBy: { name: "asc" },
      });

      return billingModels.map((model) => ({
        ...model,
        rates: JSON.parse(model.rates),
        rules: model.rules ? JSON.parse(model.rules) : null,
      }));
    } catch (error) {
      console.error("Error getting industry billing models:", error);
      return [];
    }
  }

  /**
   * Get all available industries
   */
  static async getIndustries(): Promise<any[]> {
    try {
      const industries = await prisma.industry.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      });

      return industries.map((industry) => ({
        ...industry,
        features: industry.features ? JSON.parse(industry.features) : [],
        compliance: industry.compliance ? JSON.parse(industry.compliance) : [],
      }));
    } catch (error) {
      console.error("Error getting industries:", error);
      return [];
    }
  }

  /**
   * Apply industry configuration to user's practice
   */
  static async applyIndustryConfiguration(
    userId: string,
    industryId: string
  ): Promise<void> {
    try {
      // Get industry configuration
      const config = await this.getUserIndustryConfig(userId);
      if (!config) return;

      // Get industry workflows, tasks, deliverables, and billing models
      const workflows = await this.getIndustryWorkflows(industryId);
      const tasks = await this.getIndustryTasks(industryId);
      const deliverables = await this.getIndustryDeliverables(industryId);
      const billingModels = await this.getIndustryBillingModels(industryId);

      // Apply workflows to user's practice
      for (const workflow of workflows) {
        if (config.workflows.includes(workflow.id)) {
          await this.createUserWorkflow(userId, workflow);
        }
      }

      // Apply tasks to user's practice
      for (const task of tasks) {
        if (config.workflows.includes(task.id)) {
          await this.createUserTask(userId, task);
        }
      }

      // Apply deliverables to user's practice
      for (const deliverable of deliverables) {
        if (config.templates.includes(deliverable.id)) {
          await this.createUserDeliverable(userId, deliverable);
        }
      }

      // Apply billing models to user's practice
      for (const billingModel of billingModels) {
        if (config.billingModel[billingModel.id]) {
          await this.createUserBillingModel(userId, billingModel);
        }
      }
    } catch (error) {
      console.error("Error applying industry configuration:", error);
      throw error;
    }
  }

  /**
   * Create user workflow from industry template
   */
  private static async createUserWorkflow(
    userId: string,
    workflow: IndustryWorkflow
  ): Promise<void> {
    try {
      await prisma.workflow.create({
        data: {
          name: workflow.name,
          description: workflow.description,
          steps: JSON.stringify(workflow.steps),
          userId,
        },
      });
    } catch (error) {
      console.error("Error creating user workflow:", error);
    }
  }

  /**
   * Create user task from industry template
   */
  private static async createUserTask(
    userId: string,
    task: IndustryTask
  ): Promise<void> {
    try {
      // This would create a task template in the user's practice
      // Implementation depends on your task system
      console.log("Creating user task:", task.name);
    } catch (error) {
      console.error("Error creating user task:", error);
    }
  }

  /**
   * Create user deliverable from industry template
   */
  private static async createUserDeliverable(
    userId: string,
    deliverable: IndustryDeliverable
  ): Promise<void> {
    try {
      // This would create a deliverable template in the user's practice
      // Implementation depends on your deliverable system
      console.log("Creating user deliverable:", deliverable.name);
    } catch (error) {
      console.error("Error creating user deliverable:", error);
    }
  }

  /**
   * Create user billing model from industry template
   */
  private static async createUserBillingModel(
    userId: string,
    billingModel: IndustryBillingModel
  ): Promise<void> {
    try {
      // This would create a billing model in the user's practice
      // Implementation depends on your billing system
      console.log("Creating user billing model:", billingModel.name);
    } catch (error) {
      console.error("Error creating user billing model:", error);
    }
  }

  /**
   * Get AI-powered industry suggestions
   */
  static async getAIIndustrySuggestions(
    userId: string,
    industryId: string
  ): Promise<any> {
    try {
      // This would integrate with AI service to get industry-specific suggestions
      // For now, return mock suggestions
      return {
        workflows: [
          {
            name: "Optimized Patient Intake",
            confidence: 0.95,
            reason: "Based on your patient volume patterns",
          },
          {
            name: "Automated Insurance Verification",
            confidence: 0.88,
            reason: "Reduces manual work by 70%",
          },
        ],
        tasks: [
          {
            name: "Automated Follow-up Scheduling",
            confidence: 0.92,
            reason: "Improves patient retention",
          },
          {
            name: "Insurance Claim Optimization",
            confidence: 0.85,
            reason: "Increases claim approval rates",
          },
        ],
        billing: [
          {
            name: "Value-Based Pricing",
            confidence: 0.78,
            reason: "Aligns with industry trends",
          },
          {
            name: "Subscription Model",
            confidence: 0.82,
            reason: "Improves cash flow predictability",
          },
        ],
      };
    } catch (error) {
      console.error("Error getting AI industry suggestions:", error);
      return {};
    }
  }
}
