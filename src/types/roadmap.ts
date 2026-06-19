export enum RoadmapItemStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED'
}

export interface Roadmap {
  id: number;
  title: string;
  description?: string;
  targetDate?: string;
  progress: number;
  items: RoadmapItem[];
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapItem {
  id: number;
  title: string;
  description?: string;
  status: RoadmapItemStatus;
  order: number;
  estimatedHours?: number;
  actualHours?: number;
  resources?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapCreateRequest {
  title: string;
  description?: string;
  targetDate?: string;
}

export interface RoadmapUpdateRequest extends Partial<RoadmapCreateRequest> {
  progress?: number;
}

export interface RoadmapItemCreateRequest {
  title: string;
  description?: string;
  order?: number;
  estimatedHours?: number;
  resources?: number[];
}

export interface RoadmapItemUpdateRequest extends Partial<RoadmapItemCreateRequest> {
  status?: RoadmapItemStatus;
  actualHours?: number;
}