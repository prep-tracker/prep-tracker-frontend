export interface Revision {
  id: number;
  topic: string;
  description?: string;
  resourceId?: number;
  priority: number;
  lastRevisedAt?: string;
  nextRevisionAt: string;
  timesRevised: number;
  confidence: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RevisionCreateRequest {
  topic: string;
  description?: string;
  resourceId?: number;
  priority?: number;
  nextRevisionAt: string;
  notes?: string;
}

export interface RevisionUpdateRequest extends Partial<RevisionCreateRequest> {
  lastRevisedAt?: string;
  nextRevisionAt?: string;
  timesRevised?: number;
  confidence?: number;
}