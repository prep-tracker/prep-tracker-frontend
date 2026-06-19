import api from './api';
import { PreparationPlan, PlanCreateRequest, PlanUpdateRequest } from '../types/plan';
import { PageResponse, SearchParams } from '../types/common';

const mapResponse = (p: any): PreparationPlan => ({
  ...p,
  title: p.goal,
  dueDate: p.targetCompletionDate
});

export const planService = {
  getAll: async (params?: SearchParams): Promise<PageResponse<PreparationPlan>> => {
    const response = await api.get<PageResponse<any>>('/preparation-plans', { params });
    return {
      ...response.data,
      content: response.data.content.map(mapResponse)
    };
  },

  getById: async (id: number): Promise<PreparationPlan> => {
    const response = await api.get<any>(`/preparation-plans/${id}`);
    return mapResponse(response.data);
  },

  create: async (data: PlanCreateRequest): Promise<PreparationPlan> => {
    const backendData = {
      goal: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      targetCompletionDate: data.dueDate,
      tags: data.tags
    };
    const response = await api.post<any>('/preparation-plans', backendData);
    return mapResponse(response.data);
  },

  update: async (id: number, data: PlanUpdateRequest): Promise<PreparationPlan> => {
    const backendData = {
      goal: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      targetCompletionDate: data.dueDate,
      tags: data.tags,
      progress: data.progress
    };
    const response = await api.put<any>(`/preparation-plans/${id}`, backendData);
    return mapResponse(response.data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/preparation-plans/${id}`);
  },

  getByStatus: async (status: string, params?: SearchParams): Promise<PageResponse<PreparationPlan>> => {
    const response = await api.get<PageResponse<any>>('/preparation-plans', {
      params: { ...params, status },
    });
    return {
      ...response.data,
      content: response.data.content.map(mapResponse)
    };
  },
};

export default planService;