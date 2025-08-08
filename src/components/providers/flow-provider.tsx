'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
interface Job {
  id: string;
  title: string;
  description?: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'REVIEW' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: Date;
  startDate?: Date;
  completedDate?: Date;
  budgetHours: number;
  actualHours: number;
  remainingHours: number;
  progress: number;
  tags?: string[];
  notes?: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  assignedToId?: string;
  clientId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: Date;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  isCompleted: boolean;
  completedAt?: Date;
  tags?: string[];
  notes?: string;
  checklist?: string[];
  jobId?: string;
  assignedToId?: string;
  parentTaskId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  companyName?: string;
  industry?: string;
  taxId?: string;
  website?: string;
  notes?: string;
  isActive: boolean;
  source?: string;
  assignedToId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TimeEntry {
  id: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  isBillable: boolean;
  hourlyRate?: number;
  totalAmount?: number;
  notes?: string;
  tags?: string[];
  userId: string;
  jobId?: string;
  taskId?: string;
  clientId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Team {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TeamMember {
  id: string;
  role: 'OWNER' | 'MANAGER' | 'MEMBER' | 'VIEWER';
  permissions?: string[];
  joinedAt: Date;
  leftAt?: Date;
  teamId: string;
  userId: string;
}

interface Workflow {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  steps: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface WorkflowInstance {
  id: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  currentStep: number;
  startedAt: Date;
  completedAt?: Date;
  data?: string;
  workflowId: string;
  jobId?: string;
  userId: string;
}

// State interface
interface FlowState {
  jobs: Job[];
  tasks: Task[];
  clients: Client[];
  timeEntries: TimeEntry[];
  teams: Team[];
  teamMembers: TeamMember[];
  workflows: Workflow[];
  workflowInstances: WorkflowInstance[];
  loading: boolean;
  error: string | null;
}

// Action types
type FlowAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_JOBS'; payload: Job[] }
  | { type: 'ADD_JOB'; payload: Job }
  | { type: 'UPDATE_JOB'; payload: Job }
  | { type: 'DELETE_JOB'; payload: string }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'SET_TIME_ENTRIES'; payload: TimeEntry[] }
  | { type: 'ADD_TIME_ENTRY'; payload: TimeEntry }
  | { type: 'UPDATE_TIME_ENTRY'; payload: TimeEntry }
  | { type: 'DELETE_TIME_ENTRY'; payload: string }
  | { type: 'SET_TEAMS'; payload: Team[] }
  | { type: 'ADD_TEAM'; payload: Team }
  | { type: 'UPDATE_TEAM'; payload: Team }
  | { type: 'DELETE_TEAM'; payload: string }
  | { type: 'SET_TEAM_MEMBERS'; payload: TeamMember[] }
  | { type: 'ADD_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'UPDATE_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'DELETE_TEAM_MEMBER'; payload: string }
  | { type: 'SET_WORKFLOWS'; payload: Workflow[] }
  | { type: 'ADD_WORKFLOW'; payload: Workflow }
  | { type: 'UPDATE_WORKFLOW'; payload: Workflow }
  | { type: 'DELETE_WORKFLOW'; payload: string }
  | { type: 'SET_WORKFLOW_INSTANCES'; payload: WorkflowInstance[] }
  | { type: 'ADD_WORKFLOW_INSTANCE'; payload: WorkflowInstance }
  | { type: 'UPDATE_WORKFLOW_INSTANCE'; payload: WorkflowInstance }
  | { type: 'DELETE_WORKFLOW_INSTANCE'; payload: string };

// Initial state
const initialState: FlowState = {
  jobs: [],
  tasks: [],
  clients: [],
  timeEntries: [],
  teams: [],
  teamMembers: [],
  workflows: [],
  workflowInstances: [],
  loading: false,
  error: null,
};

// Reducer
function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_JOBS':
      return { ...state, jobs: action.payload };
    case 'ADD_JOB':
      return { ...state, jobs: [...state.jobs, action.payload] };
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job => job.id === action.payload.id ? action.payload : job),
      };
    case 'DELETE_JOB':
      return {
        ...state,
        jobs: state.jobs.filter(job => job.id !== action.payload),
      };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => task.id === action.payload.id ? action.payload : task),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client => client.id === action.payload.id ? action.payload : client),
      };
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload),
      };
    case 'SET_TIME_ENTRIES':
      return { ...state, timeEntries: action.payload };
    case 'ADD_TIME_ENTRY':
      return { ...state, timeEntries: [...state.timeEntries, action.payload] };
    case 'UPDATE_TIME_ENTRY':
      return {
        ...state,
        timeEntries: state.timeEntries.map(entry => entry.id === action.payload.id ? action.payload : entry),
      };
    case 'DELETE_TIME_ENTRY':
      return {
        ...state,
        timeEntries: state.timeEntries.filter(entry => entry.id !== action.payload),
      };
    case 'SET_TEAMS':
      return { ...state, teams: action.payload };
    case 'ADD_TEAM':
      return { ...state, teams: [...state.teams, action.payload] };
    case 'UPDATE_TEAM':
      return {
        ...state,
        teams: state.teams.map(team => team.id === action.payload.id ? action.payload : team),
      };
    case 'DELETE_TEAM':
      return {
        ...state,
        teams: state.teams.filter(team => team.id !== action.payload),
      };
    case 'SET_TEAM_MEMBERS':
      return { ...state, teamMembers: action.payload };
    case 'ADD_TEAM_MEMBER':
      return { ...state, teamMembers: [...state.teamMembers, action.payload] };
    case 'UPDATE_TEAM_MEMBER':
      return {
        ...state,
        teamMembers: state.teamMembers.map(member => member.id === action.payload.id ? action.payload : member),
      };
    case 'DELETE_TEAM_MEMBER':
      return {
        ...state,
        teamMembers: state.teamMembers.filter(member => member.id !== action.payload),
      };
    case 'SET_WORKFLOWS':
      return { ...state, workflows: action.payload };
    case 'ADD_WORKFLOW':
      return { ...state, workflows: [...state.workflows, action.payload] };
    case 'UPDATE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.map(workflow => workflow.id === action.payload.id ? action.payload : workflow),
      };
    case 'DELETE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.filter(workflow => workflow.id !== action.payload),
      };
    case 'SET_WORKFLOW_INSTANCES':
      return { ...state, workflowInstances: action.payload };
    case 'ADD_WORKFLOW_INSTANCE':
      return { ...state, workflowInstances: [...state.workflowInstances, action.payload] };
    case 'UPDATE_WORKFLOW_INSTANCE':
      return {
        ...state,
        workflowInstances: state.workflowInstances.map(instance => instance.id === action.payload.id ? action.payload : instance),
      };
    case 'DELETE_WORKFLOW_INSTANCE':
      return {
        ...state,
        workflowInstances: state.workflowInstances.filter(instance => instance.id !== action.payload),
      };
    default:
      return state;
  }
}

// Context
interface FlowContextType {
  state: FlowState;
  dispatch: React.Dispatch<FlowAction>;
  // Helper functions
  getJobById: (id: string) => Job | undefined;
  getTasksByJobId: (jobId: string) => Task[];
  getClientById: (id: string) => Client | undefined;
  getTimeEntriesByJobId: (jobId: string) => TimeEntry[];
  getTeamById: (id: string) => Team | undefined;
  getTeamMembersByTeamId: (teamId: string) => TeamMember[];
  getWorkflowById: (id: string) => Workflow | undefined;
  getWorkflowInstancesByWorkflowId: (workflowId: string) => WorkflowInstance[];
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

// Provider component
interface FlowProviderProps {
  children: ReactNode;
}

export function FlowProvider({ children }: FlowProviderProps) {
  const [state, dispatch] = useReducer(flowReducer, initialState);

  // Helper functions
  const getJobById = (id: string) => state.jobs.find(job => job.id === id);
  const getTasksByJobId = (jobId: string) => state.tasks.filter(task => task.jobId === jobId);
  const getClientById = (id: string) => state.clients.find(client => client.id === id);
  const getTimeEntriesByJobId = (jobId: string) => state.timeEntries.filter(entry => entry.jobId === jobId);
  const getTeamById = (id: string) => state.teams.find(team => team.id === id);
  const getTeamMembersByTeamId = (teamId: string) => state.teamMembers.filter(member => member.teamId === teamId);
  const getWorkflowById = (id: string) => state.workflows.find(workflow => workflow.id === id);
  const getWorkflowInstancesByWorkflowId = (workflowId: string) => state.workflowInstances.filter(instance => instance.workflowId === workflowId);

  const value: FlowContextType = {
    state,
    dispatch,
    getJobById,
    getTasksByJobId,
    getClientById,
    getTimeEntriesByJobId,
    getTeamById,
    getTeamMembersByTeamId,
    getWorkflowById,
    getWorkflowInstancesByWorkflowId,
  };

  return (
    <FlowContext.Provider value={value}>
      {children}
    </FlowContext.Provider>
  );
}

// Hook to use the context
export function useFlow() {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
} 