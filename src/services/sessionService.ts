import api from './api';
import { StudySession, SessionCreateRequest, SessionUpdateRequest } from '../types/session';
import { PageResponse, PaginationParams } from '../types/common';

const mapResponse = (s: any): StudySession => ({
  ...s,
  title: s.resource?.title || s.resource?.name || s.topicCovered || 'Study Session',
  topic: s.topicCovered,
  startTime: s.sessionDate ? s.sessionDate + 'T00:00:00' : new Date().toISOString(),
  duration: s.durationMinutes
});

export const sessionService = {
  getAll: async (params?: PaginationParams): Promise<PageResponse<StudySession>> => {
    const response = await api.get<PageResponse<any>>('/study-sessions', { params });
    return {
      ...response.data,
      content: response.data.content.map(mapResponse)
    };
  },
  getById: async (id: number): Promise<StudySession> => {
    const response = await api.get<any>(`/study-sessions/${id}`);
    return mapResponse(response.data);
  },
  create: async (data: SessionCreateRequest): Promise<StudySession> => {
    const backendData = {
      sessionDate: data.startTime ? data.startTime.substring(0, 10) : new Date().toISOString().substring(0, 10),
      durationMinutes: (data as any).duration || 0,
      notes: data.notes,
      topicCovered: data.topic || data.title,
      resourceId: data.resourceId
    };
    const response = await api.post<any>('/study-sessions', backendData);
    return mapResponse(response.data);
  },
  update: async (id: number, data: SessionUpdateRequest): Promise<StudySession> => {
    const backendData = {
      sessionDate: data.startTime ? data.startTime.substring(0, 10) : undefined,
      durationMinutes: data.duration,
      notes: data.notes,
      topicCovered: data.topic || data.title,
      resourceId: data.resourceId
    };
    const response = await api.put<any>(`/study-sessions/${id}`, backendData);
    return mapResponse(response.data);
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/study-sessions/${id}`);
  },
};
export default sessionService;