export interface StudySession {
  id: number;
  title: string;
  description?: string;
  topic?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  notes?: string;
  resourceId?: number;
  planId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SessionCreateRequest {
  title: string;
  description?: string;
  topic?: string;
  startTime: string;
  endTime?: string;
  notes?: string;
  resourceId?: number;
  planId?: number;
}

export interface SessionUpdateRequest extends Partial<SessionCreateRequest> {
  duration?: number;
}