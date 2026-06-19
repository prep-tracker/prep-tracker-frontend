import api from './api';
import { Goal, GoalCreateRequest, GoalUpdateRequest } from '../types/goal';
import { PageResponse, SearchParams } from '../types/common';

export const goalService = {
  getAll: async (params?: SearchParams): Promise<PageResponse<Goal>> => {
    const response = await api.get<PageResponse<Goal>>('/goals', { params });
    return response.data;
  },
  getById: async (id: number): Promise<Goal> => {
    const response = await api.get<Goal>(`/goals/${id}`);
    return response.data;
  },
  create: async (data: GoalCreateRequest): Promise<Goal> => {
    const response = await api.post<Goal>('/goals', data);
    return response.data;
  },
  update: async (id: number, data: GoalUpdateRequest): Promise<Goal> => {
    const response = await api.put<Goal>(`/goals/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },
};
export default goalService;