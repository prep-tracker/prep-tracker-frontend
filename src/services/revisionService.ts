import api from './api';
import { Revision, RevisionCreateRequest, RevisionUpdateRequest } from '../types/revision';
import { PageResponse, SearchParams } from '../types/common';

const mapResponse = (r: any): Revision => ({
  ...r,
  topic: r.subject,
  nextRevisionAt: r.nextReminder ? r.nextReminder + 'T00:00:00' : new Date().toISOString(),
  timesRevised: (r.firstRevision ? 1 : 0) + (r.secondRevision ? 1 : 0) + (r.thirdRevision ? 1 : 0),
  confidence: r.thirdRevision ? 5 : (r.secondRevision ? 3 : (r.firstRevision ? 2 : 1)),
  priority: 2
});

const revisionService = {
  getAll: async (params?: SearchParams): Promise<PageResponse<Revision>> => {
    const response = await api.get<PageResponse<any>>('/revisions', { params });
    return {
      ...response.data,
      content: response.data.content.map(mapResponse)
    };
  },
  getById: async (id: number): Promise<Revision> => {
    const response = await api.get<any>(`/revisions/${id}`);
    return mapResponse(response.data);
  },
  create: async (data: RevisionCreateRequest): Promise<Revision> => {
    const backendData = {
      subject: data.topic,
      nextReminder: data.nextRevisionAt ? data.nextRevisionAt.substring(0, 10) : new Date().toISOString().substring(0, 10),
      firstRevision: new Date().toISOString().substring(0, 10)
    };
    const response = await api.post<any>('/revisions', backendData);
    return mapResponse(response.data);
  },
  update: async (id: number, data: RevisionUpdateRequest): Promise<Revision> => {
    const backendData = {
      subject: data.topic,
      nextReminder: data.nextRevisionAt ? data.nextRevisionAt.substring(0, 10) : undefined,
      firstRevision: (data as any).firstRevision,
      secondRevision: (data as any).secondRevision,
      thirdRevision: (data as any).thirdRevision
    };
    const response = await api.put<any>(`/revisions/${id}`, backendData);
    return mapResponse(response.data);
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/revisions/${id}`);
  },
};
export default revisionService;