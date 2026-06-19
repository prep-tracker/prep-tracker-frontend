export enum ResourceType {
  VIDEO = 'VIDEO',
  ARTICLE = 'ARTICLE',
  BOOK = 'BOOK',
  COURSE = 'COURSE',
  PRACTICE = 'PRACTICE',
  DOCUMENTATION = 'DOCUMENTATION',
  OTHER = 'OTHER'
}

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export interface Resource {
  id: number;
  title: string;
  description?: string;
  url?: string;
  type: ResourceType;
  difficulty: Difficulty;
  category?: string;
  tags?: string[];
  completed: boolean;
  timeSpent?: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceCreateRequest {
  title: string;
  description?: string;
  url?: string;
  type: ResourceType;
  difficulty: Difficulty;
  category?: string;
  tags?: string[];
}

export interface ResourceUpdateRequest extends Partial<ResourceCreateRequest> {
  completed?: boolean;
  timeSpent?: number;
  rating?: number;
}