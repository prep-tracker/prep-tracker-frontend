export enum PlanPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum PlanStatus {
  BACKLOG = 'BACKLOG',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED'
}

export interface PreparationPlan {
  id: number;
  title: string;
  description?: string;
  priority: PlanPriority;
  status: PlanStatus;
  dueDate?: string;
  progress: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PlanCreateRequest {
  title: string;
  description?: string;
  priority: PlanPriority;
  status?: PlanStatus;
  dueDate?: string;
  tags?: string[];
}

export interface PlanUpdateRequest extends Partial<PlanCreateRequest> {
  progress?: number;
  status?: PlanStatus;
}