export enum GoalStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ACHIEVED = 'ACHIEVED',
  ABANDONED = 'ABANDONED'
}

export interface Goal {
  id: number;
  title: string;
  description?: string;
  status: GoalStatus;
  targetDate?: string;
  completedDate?: string;
  progress: number;
  milestones?: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface GoalCreateRequest {
  title: string;
  description?: string;
  status?: GoalStatus;
  targetDate?: string;
  milestones?: Omit<Milestone, 'id'>[];
}

export interface GoalUpdateRequest extends Partial<GoalCreateRequest> {
  progress?: number;
  completedDate?: string;
  status?: GoalStatus;
}