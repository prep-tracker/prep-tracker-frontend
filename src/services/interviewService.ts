import api from './api';
import { InterviewTopic, InterviewTopicCreateRequest, InterviewTopicUpdateRequest } from '../types/interview';
import { PageResponse, SearchParams } from '../types/common';

const mapResponse = (r: any): InterviewTopic => ({
  ...r,
  topic: r.topic,
  questionsTotal: r.totalQuestions || 0,
  questionsSolved: r.solvedQuestions || 0,
  category: r.difficulty === 'ADVANCED' ? 'System Design' : 'Java',
  status: r.solvedQuestions > 0 ? (r.solvedQuestions === r.totalQuestions ? 'SOLVED' : 'IN_PROGRESS' as any) : 'NOT_STARTED' as any,
  difficulty: r.difficulty
});

const interviewService = {
  getAll: async (params?: SearchParams): Promise<PageResponse<InterviewTopic>> => {
    const response = await api.get<PageResponse<any>>('/interview-topics', { params });
    return {
      ...response.data,
      content: response.data.content.map(mapResponse)
    };
  },
  getById: async (id: number): Promise<InterviewTopic> => {
    const response = await api.get<any>(`/interview-topics/${id}`);
    return mapResponse(response.data);
  },
  create: async (data: InterviewTopicCreateRequest): Promise<InterviewTopic> => {
    const backendData = {
      topic: data.topic,
      totalQuestions: data.questionsTotal,
      solvedQuestions: (data as any).questionsSolved || 0,
      difficulty: data.difficulty
    };
    const response = await api.post<any>('/interview-topics', backendData);
    return mapResponse(response.data);
  },
  update: async (id: number, data: InterviewTopicUpdateRequest): Promise<InterviewTopic> => {
    const backendData = {
      topic: data.topic,
      totalQuestions: data.questionsTotal,
      solvedQuestions: data.questionsSolved,
      difficulty: data.difficulty
    };
    const response = await api.put<any>(`/interview-topics/${id}`, backendData);
    return mapResponse(response.data);
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/interview-topics/${id}`);
  },
};
export default interviewService;