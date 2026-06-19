export enum InterviewTopicStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEWING = 'REVIEWING',
  SOLVED = 'SOLVED'
}

export interface InterviewTopic {
  id: number;
  topic: string;
  category?: string;
  description?: string;
  status: InterviewTopicStatus;
  difficulty?: string;
  questionsTotal: number;
  questionsSolved: number;
  notes?: string;
  resources?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface InterviewTopicCreateRequest {
  topic: string;
  category?: string;
  description?: string;
  status?: InterviewTopicStatus;
  difficulty?: string;
  questionsTotal?: number;
  notes?: string;
  resources?: number[];
}

export interface InterviewTopicUpdateRequest extends Partial<InterviewTopicCreateRequest> {
  questionsSolved?: number;
  status?: InterviewTopicStatus;
}